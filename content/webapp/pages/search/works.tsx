import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { emptyResultList } from '@weco/content/services/wellcome';
// TODO when we switch to semantic search APIs, we can remove the following imports
// getConcepts
// getImages
// CatalogueResultsList, Concept, Image
import { getConcepts } from '@weco/content/services/wellcome/catalogue/concepts';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import {
  CatalogueResultsList,
  Concept,
  Image,
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

// Semantic Search Prototype Configuration
// TODO: When ready to switch to semantic search APIs, replace getConcepts/getImages
// with getWorks calls using different elasticCluster parameters, e.g.:
//
// Alternative 2: getWorks({ params: { ...params, elasticCluster: 'openai' } })
// Alternative 3: getWorks({ params: { ...params, elasticCluster: 'elser' } })
//
// The comparison columns currently use:
//   - concepts API → will become semantic search with elasticCluster=openai
//   - images API → will become semantic search with elasticCluster=elser

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
  const params = fromQuery(query);

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

  const searchIn = typeof query.searchIn === 'string' ? query.searchIn : 'all';

  const semanticSearchPrototype =
    serverData.toggles.semanticSearchPrototype.value;
  const semanticSearchComparison =
    serverData.toggles.semanticSearchComparison.value;

  // TODO use when we update to semantic search APIs
  // Map searchIn to elasticCluster parameter for semantic search API
  // const getElasticCluster = (
  //   searchIn: string
  // ): 'openai' | 'elser' | undefined => {
  //   if (searchIn === 'alternative2') return 'openai';
  //   if (searchIn === 'alternative3') return 'elser';
  //   return undefined; // alternative1 uses default lexical search
  // };

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
    // todo or not prototype?
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

  // Fetch from multiple APIs for semantic search comparison
  // TODO: Replace getConcepts and getImages with semantic search variations of getWorks
  // Currently using concepts/images APIs as placeholders
  // Types will change:
  // let works2: WellcomeResultList<WorkBasic, WorkAggregations> | null = null;
  // let works3: WellcomeResultList<WorkBasic, WorkAggregations> | null = null;
  let works2: CatalogueResultsList<Concept> | null = null;
  let works3: CatalogueResultsList<Image> | null = null;

  if (semanticSearchPrototype || semanticSearchComparison) {
    const works2Promise = shouldFetchAlternative2
      ? getConcepts({
          params: { query: params.query, page: params.page },
          pageSize: 25,
          toggles: serverData.toggles,
        })
      : Promise.resolve(null);

    // Column 3: Currently images API, will be semantic search variant 2
    const works3Promise = shouldFetchAlternative3
      ? getImages({
          params: { query: params.query, page: params.page },
          pageSize: 25,
          toggles: serverData.toggles,
        })
      : Promise.resolve(null);

    const [works2Result, works3Result] = await Promise.all([
      works2Promise,
      works3Promise,
    ]);

    works2 =
      works2Result && works2Result.type !== 'Error' ? works2Result : null;
    works3 =
      works3Result && works3Result.type !== 'Error' ? works3Result : null;

    // TODO Replace above with the following when ready to switch to semantic search APIs:
    // const works2Promise = shouldFetchAlternative2
    //   ? getWorks({
    //       params: {
    //         ...worksApiProps,
    //         elasticCluster: getElasticCluster('alternative2'),
    //       },
    //       pageSize: 25,
    //       toggles: serverData.toggles,
    //     })
    //   : Promise.resolve(null);

    // const works3Promise = shouldFetchAlternative3
    //   ? getWorks({
    //       params: {
    //         ...worksApiProps,
    //         elasticCluster: getElasticCluster('alternative3'),
    //       },
    //       pageSize: 25,
    //       toggles: serverData.toggles,
    //     })
    //   : Promise.resolve(null);

    // const [works2Result, works3Result] = await Promise.all([
    //   works2Promise,
    //   works3Promise,
    // ]);

    // works2 = works2Result && works2Result.type !== 'Error'
    //   ? { ...works2Result, results: works2Result.results.map(toWorkBasic) }
    //   : null;

    // works3 = works3Result && works3Result.type !== 'Error'
    //   ? { ...works3Result, results: works3Result.results.map(toWorkBasic) }
    //   : null;
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
