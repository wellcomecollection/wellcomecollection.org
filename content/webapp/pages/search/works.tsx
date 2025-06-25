import { GetServerSideProps } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import { serialiseProps } from '@weco/common/utils/json';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { fromQuery } from '@weco/content/components/SearchPagesLink/Works';
import { emptyResultList } from '@weco/content/services/wellcome';
import { toWorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import { looksLikeSpam } from '@weco/content/utils/spam-detector';
import WorksSearchPage, {
  Props as WorksSearchPageProps,
} from '@weco/content/views/search/works.tsx';

type Props = WorksSearchPageProps & {
  pageview: Pageview;
};

const Page: NextPageWithLayout<Props> = (props: WorksSearchPageProps) => {
  return <WorksSearchPage {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
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
        pageview: {
          name: 'works',
          properties: {
            looksLikeSpam: 'true',
          },
        },
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

  const works = await getWorks({
    params: worksApiProps,
    pageSize: 25,
    toggles: serverData.toggles,
  });

  if (works.type === 'Error') {
    return appError(
      context,
      works.httpStatus,
      works.description || works.label
    );
  }

  return {
    props: serialiseProps<Props>({
      ...defaultProps,
      works: {
        ...works,
        results: works.results.map(toWorkBasic),
      },
      pageview: {
        name: 'works',
        properties: { totalResults: works.totalResults },
      },
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
