import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import {
  NextPageWithLayout,
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { fromQuery } from '@weco/content/views/components/SearchPagesLink/Events';
import { emptyResultList } from '@weco/content/services/wellcome';
import { getEvents } from '@weco/content/services/wellcome/content/events';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import { looksLikeSpam } from '@weco/content/utils/spam-detector';
import EventsSearchPage, {
  Props as EventSearchPageProps,
} from '@weco/content/views/pages/search/events';

const Page: NextPageWithLayout<EventSearchPageProps> = props => {
  return <EventsSearchPage {...props} />;
};

type Props = ServerSideProps<EventSearchPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.search);
  const serverData = await getServerData(context);
  const exhibitionsInEvents = !!serverData.toggles.exhibitionsInEvents?.value;

  const query = context.query;
  const params = fromQuery(query);
  const validTimespan = getQueryPropertyValue(params.timespan) || '';
  const validParams = {
    ...params,
    timespan: validTimespan === 'all' ? '' : validTimespan,
  };

  const defaultProps = serialiseProps({
    eventsRouteProps: validParams,
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
        eventResponseList: emptyResultList(),
        pageview: {
          name: 'events',
          properties: {
            looksLikeSpam: 'true',
          },
        },
        apiToolbarLinks: [],
      }),
    };
  }

  const { page, ...restOfQuery } = query;
  const pageNumber = getQueryPropertyValue(page);
  const paramsQuery = {
    ...restOfQuery,
    timespan: validTimespan,
    filterOutExhibitions: exhibitionsInEvents ? undefined : 'true',
  };

  const eventResponseList = await getEvents({
    params: {
      ...paramsQuery,
      sort:
        validTimespan === 'past' || validTimespan === 'future'
          ? 'times.startDateTime'
          : 'relevance',
      sortOrder: validTimespan === 'past' ? 'desc' : 'asc',
      ...(pageNumber && { page: Number(pageNumber) }),
      aggregations: [
        'format',
        'audience',
        'interpretation',
        'location',
        'isAvailableOnline',
        'timespan',
      ],
    },
    pageSize: 24,
    toggles: serverData.toggles,
  });

  if (eventResponseList?.type === 'Error') {
    return appError(context, eventResponseList.httpStatus, 'Content API error');
  }

  return {
    props: serialiseProps<Props>({
      ...defaultProps,
      eventResponseList,
      pageview: {
        name: 'events',
        properties: {
          totalResults: eventResponseList?.totalResults ?? 0,
        },
      },
      apiToolbarLinks: [
        {
          id: 'content-api',
          label: 'Content API query',
          link: eventResponseList._requestUrl,
        },
      ],
    }),
  };
};

export default Page;
