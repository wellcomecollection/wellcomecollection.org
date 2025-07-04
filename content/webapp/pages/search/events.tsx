import { GetServerSideProps } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import { pluralize } from '@weco/common/utils/grammar';
import { serialiseProps } from '@weco/common/utils/json';
import {
  getQueryPropertyValue,
  linkResolver,
  SEARCH_PAGES_FORM_ID,
} from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import EventsSearchResults from '@weco/content/components/EventsSearchResults';
import Pagination from '@weco/content/components/Pagination';
import SearchFilters from '@weco/content/components/SearchFilters';
import SearchNoResults from '@weco/content/components/SearchNoResults';
import { getSearchLayout } from '@weco/content/components/SearchPageLayout';
import {
  EventsProps,
  fromQuery,
} from '@weco/content/components/SearchPagesLink/Events';
import { emptyResultList } from '@weco/content/services/wellcome';
import { eventsFilters } from '@weco/content/services/wellcome/common/filters';
import { getEvents } from '@weco/content/services/wellcome/content/events';
import {
  ContentResultsList,
  EventDocument,
} from '@weco/content/services/wellcome/content/types/api';
import { Query } from '@weco/content/types/search';
import { getActiveFiltersLabel, hasFilters } from '@weco/content/utils/search';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import { looksLikeSpam } from '@weco/content/utils/spam-detector';

type Props = {
  eventResponseList: ContentResultsList<EventDocument>;
  query: Query;
  pageview: Pageview;
  apiToolbarLinks: ApiToolbarLink[];
  eventsRouteProps: EventsProps;
};

export const EventsSearchPage: NextPageWithLayout<Props> = ({
  eventResponseList,
  query,
  eventsRouteProps,
}) => {
  const { query: queryString } = query;

  const filters = eventsFilters({
    events: eventResponseList,
    props: eventsRouteProps,
  });

  const hasNoResults = eventResponseList.totalResults === 0;
  const hasActiveFilters = hasFilters({
    filters: filters.map(f => f.id),
    queryParams: query,
  });

  const activeFiltersLabels = getActiveFiltersLabel({ filters });

  return (
    <Space $v={{ size: 'l', properties: ['padding-bottom'] }}>
      {(!hasNoResults || (hasNoResults && hasActiveFilters)) && (
        <Container>
          <Space
            $v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
          >
            <SearchFilters
              query={queryString}
              linkResolver={params =>
                linkResolver({ params, pathname: '/search/events' })
              }
              searchFormId={SEARCH_PAGES_FORM_ID}
              changeHandler={() => {
                const form = document.getElementById(SEARCH_PAGES_FORM_ID);
                form &&
                  form.dispatchEvent(
                    new window.Event('submit', {
                      cancelable: true,
                      bubbles: true,
                    })
                  );
              }}
              filters={filters}
              hasNoResults={hasNoResults}
            />
          </Space>
        </Container>
      )}
      {eventResponseList && (
        <>
          {hasNoResults ? (
            <Container>
              <SearchNoResults query={queryString} />
            </Container>
          ) : (
            <Container>
              <PaginationWrapper $verticalSpacing="l">
                <span role="status">
                  {pluralize(eventResponseList.totalResults, 'result')}
                  {activeFiltersLabels.length > 0 && (
                    <span className="visually-hidden">
                      {' '}
                      filtered with: {activeFiltersLabels.join(', ')}
                    </span>
                  )}
                </span>

                <Pagination
                  totalPages={eventResponseList.totalPages}
                  ariaLabel="Events search pagination"
                  isHiddenMobile
                />
              </PaginationWrapper>
              <main>
                <EventsSearchResults
                  events={eventResponseList.results}
                  isInPastListing={eventsRouteProps.timespan === 'past'}
                />
              </main>

              <PaginationWrapper $verticalSpacing="l" $alignRight>
                <Pagination
                  totalPages={eventResponseList.totalPages}
                  ariaLabel="Events search pagination"
                />
              </PaginationWrapper>
            </Container>
          )}
        </>
      )}
    </Space>
  );
};

EventsSearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
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
      props: serialiseProps({
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
    props: serialiseProps({
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

export default EventsSearchPage;
