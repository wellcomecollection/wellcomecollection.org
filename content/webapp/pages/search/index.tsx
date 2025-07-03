import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { getAddressables } from '@weco/content/services/wellcome/content/all';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import { looksLikeSpam } from '@weco/content/utils/spam-detector';
import SearchPage, {
  Props as SearchPageProps,
} from '@weco/content/views/search';

export const Page: NextPage<SearchPageProps> = props => {
  return <SearchPage {...props} />;
};

type Props = ServerSideProps<SearchPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.search);
  const serverData = await getServerData(context);
  const query = context.query;

  const pageview: Pageview = {
    name: 'search',
    properties: {},
  };

  const defaultProps = {
    serverData,
    query,
    pageview,
  };

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
        pageview: {
          name: 'search',
          properties: {
            looksLikeSpam: 'true',
          },
        },
      }),
    };
  }

  try {
    let contentQueryFailed = false;

    // All/Addressables
    const contentResults = await getAddressables({
      params: query,
      pageSize: 20,
      toggles: serverData.toggles,
    });

    if (contentResults.type === 'Error') {
      contentQueryFailed = true;
      console.error(contentResults.label + ': Error fetching addressables');
    }

    const apiToolbarLinks = [
      contentResults && contentResults.type !== 'Error'
        ? {
            id: 'content-api',
            label: 'Content API query',
            link: contentResults._requestUrl,
          }
        : undefined,
    ].filter(isNotUndefined);

    return {
      props: serialiseProps<Props>({
        ...defaultProps,
        ...(contentResults?.type !== 'Error' && {
          contentResults,
        }),
        contentQueryFailed,
        apiToolbarLinks,
      }),
    };
  } catch (error) {
    console.error(error);
    return appError(context, 500, 'Search results error');
  }
};

export default Page;
