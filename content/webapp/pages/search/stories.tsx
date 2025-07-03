import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import { fromQuery } from '@weco/common/views/components/SearchPagesLink/Stories';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { emptyResultList } from '@weco/content/services/wellcome';
import { getArticles } from '@weco/content/services/wellcome/content/articles';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import { looksLikeSpam } from '@weco/content/utils/spam-detector';
import StoriesSearchPage, {
  Props as StoriesSearchPageProps,
} from '@weco/content/views/search/stories';

export const Page: NextPage<StoriesSearchPageProps> = props => {
  return <StoriesSearchPage {...props} />;
};

type Props = ServerSideProps<StoriesSearchPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.search);
  const serverData = await getServerData(context);
  const query = context.query;
  const params = fromQuery(query);
  const defaultProps = serialiseProps({
    storiesRouteProps: params,
    serverData,
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
        storyResponseList: emptyResultList(),
        pageview: {
          name: 'stories',
          properties: {
            looksLikeSpam: 'true',
          },
        },
        apiToolbarLinks: [],
      }),
    };
  }

  // Sending page=1 to Prismic skips the two first results, which seems to have to do with the cursor work
  // This is a workaround that ensures we only send the page if relevant
  const { page, ...restOfQuery } = query;
  const pageNumber = page !== '1' && getQueryPropertyValue(page);

  const storyResponseList = await getArticles({
    params: {
      ...restOfQuery,
      sort: getQueryPropertyValue(query.sort),
      sortOrder: getQueryPropertyValue(query.sortOrder),
      ...(pageNumber && { page: Number(pageNumber) }),
      aggregations: ['format', 'contributors.contributor'],
    },
    pageSize: 25,
    toggles: serverData.toggles,
  });

  if (storyResponseList?.type === 'Error') {
    return appError(context, storyResponseList.httpStatus, 'Content API error');
  }

  return {
    props: serialiseProps<Props>({
      ...defaultProps,
      storyResponseList,
      pageview: {
        name: 'stories',
        properties: {
          totalResults: storyResponseList?.totalResults ?? 0,
        },
      },
      apiToolbarLinks: [
        {
          id: 'content-api',
          label: 'Content API query',
          link: storyResponseList._requestUrl,
        },
      ],
    }),
  };
};

export default Page;
