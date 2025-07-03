import { NextPage } from 'next';

import { pluralize } from '@weco/common/utils/grammar';
import { linkResolver, SEARCH_PAGES_FORM_ID } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import EventsSearchResults from '@weco/common/views/components/EventsSearchResults';
import Pagination from '@weco/common/views/components/Pagination';
import SearchFilters from '@weco/common/views/components/SearchFilters';
import { EventsProps } from '@weco/common/views/components/SearchPagesLink/Events';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import { withSearchLayout } from '@weco/common/views/layouts/SearchPageLayout';
import { eventsFilters } from '@weco/content/services/wellcome/common/filters';
import {
  ContentResultsList,
  EventDocument,
} from '@weco/content/services/wellcome/content/types/api';
import { Query } from '@weco/content/types/search';
import { getActiveFiltersLabel, hasFilters } from '@weco/content/utils/search';
import SearchNoResults from '@weco/content/views/search/search.NoResults';

export type Props = {
  eventResponseList: ContentResultsList<EventDocument>;
  query: Query;
  apiToolbarLinks: ApiToolbarLink[];
  eventsRouteProps: EventsProps;
};

const EventsSearchPage: NextPage<Props> = withSearchLayout(
  ({ eventResponseList, query, eventsRouteProps }) => {
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
  }
);

export default EventsSearchPage;
