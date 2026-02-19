import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import {
  emptyResultList,
  WellcomeResultList,
} from '@weco/content/services/wellcome';
import {
  toWorkBasic,
  WorkAggregations,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import { looksLikeSpam } from '@weco/content/utils/spam-detector';
import { fromQuery } from '@weco/content/views/components/SearchPagesLink/Works';
import WorksSearchPage, {
  Props as WorksSearchPageProps,
} from '@weco/content/views/pages/search/works.tsx';

const Page: NextPage<WorksSearchPageProps> = props => {
  return <WorksSearchPage {...props} />;
};

type Props = ServerSideProps<WorksSearchPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.search);
  const serverData = await getServerData(context);
  const query = context.query;
  // TODO can remove searchIn when we remove the `semanticSearch...` toggles,
  const semanticSearchPrototype =
    serverData.toggles.semanticSearchPrototype.value;
  const semanticSearchComparison =
    serverData.toggles.semanticSearchComparison.value;

  let params = fromQuery(query);

  // If no `searchIn` is present in the URL, default it based on which toggle
  // is active: comparison mode -> `all`, prototype mode -> `alternative1`.
  if (!query.searchIn) {
    if (semanticSearchComparison) {
      params = { ...params, searchIn: 'all' };
    } else if (semanticSearchPrototype) {
      params = { ...params, searchIn: 'alternative1' };
    }
  }

  const searchIn =
    typeof params.searchIn === 'string' ? params.searchIn : 'all';

  const defaultProps = serialiseProps({
    serverData,
    worksRouteProps: params,
    query,
  });

  // If the request looks like spam, return a 400 error and skip actually fetching
  // the data from the APIs.
  //
  // Users will still see a meaningful error page with instructions about tweaking
  // their query/telling us if they expected results, but they won't be causing load
  // on our back-end APIs.
  //
  // The status code will also allow us to filter out spam-like requests from our analytics.
  if (looksLikeSpam(query.query)) {
    context.res.statusCode = 400;
    return {
      props: serialiseProps<Props>({
        ...defaultProps,
        works: emptyResultList(),
        apiToolbarLinks: [],
      }),
    };
  }

  const aggregations = serverData.toggles.aggregationsInSearch?.value
    ? [
        'workType',
        'availabilities',
        'genres.label',
        'languages',
        'subjects.label',
        'contributors.agent.label',
      ]
    : [];

  const worksApiProps = {
    ...params,
    aggregations,
  };

  // Map searchIn to elasticCluster parameter for semantic search API
  const getElasticCluster = (
    searchIn: string
  ): 'openai' | 'elser' | undefined => {
    if (searchIn === 'alternative2') return 'openai';
    if (searchIn === 'alternative3') return 'elser';
    return undefined; // alternative1 uses default lexical search
  };

  // Determine which APIs to fetch from based on searchIn parameter
  // Note: searchIn is only used when semanticSearchPrototype or semanticSearchComparison toggles are enabled
  const shouldFetchWorks =
    (!semanticSearchPrototype && !semanticSearchComparison) ||
    searchIn === 'all' ||
    searchIn === 'alternative1';
  const shouldFetchAlternative2 =
    searchIn === 'all' || searchIn === 'alternative2';
  const shouldFetchAlternative3 =
    searchIn === 'all' || searchIn === 'alternative3';

  // Fetch works if needed
  let works = emptyResultList<WorkBasic, WorkAggregations>();
  if (shouldFetchWorks) {
    const worksResult = await getWorks({
      params: worksApiProps,
      pageSize: 25,
      toggles: serverData.toggles,
    });

    if (worksResult.type === 'Error') {
      return appError(
        context,
        worksResult.httpStatus,
        worksResult.description || worksResult.label
      );
    }

    works = {
      ...worksResult,
      results: worksResult.results.map(toWorkBasic),
    };
  }

  // Results from semantic searches will be fetched in parallel, but only if needed based on the searchIn parameter
  let works2: WellcomeResultList<WorkBasic, WorkAggregations> | null = null;
  let works3: WellcomeResultList<WorkBasic, WorkAggregations> | null = null;

  if (semanticSearchPrototype || semanticSearchComparison) {
    const works2Promise = shouldFetchAlternative2
      ? getWorks({
          params: {
            ...worksApiProps,
            elasticCluster: getElasticCluster('alternative2'),
          },
          pageSize: 25,
          toggles: serverData.toggles,
        })
      : Promise.resolve(null);

    const works3Promise = shouldFetchAlternative3
      ? getWorks({
          params: {
            ...worksApiProps,
            elasticCluster: getElasticCluster('alternative3'),
          },
          pageSize: 25,
          toggles: serverData.toggles,
        })
      : Promise.resolve(null);

    const [works2Result, works3Result] = await Promise.all([
      works2Promise,
      works3Promise,
    ]);

    works2 =
      works2Result && works2Result.type !== 'Error'
        ? { ...works2Result, results: works2Result.results.map(toWorkBasic) }
        : null;

    works3 =
      works3Result && works3Result.type !== 'Error'
        ? { ...works3Result, results: works3Result.results.map(toWorkBasic) }
        : null;
  }

  return {
    props: serialiseProps<Props>({
      ...defaultProps,
      works,
      works2,
      works3,
      apiToolbarLinks: [
        {
          id: 'catalogue-api',
          label: 'Catalogue API query',
          link: works._requestUrl,
        },
      ],
    }),
  };
};

export default Page;
