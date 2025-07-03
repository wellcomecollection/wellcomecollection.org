import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { font } from '@weco/common/utils/classnames';
import { formDataAsUrlQuery } from '@weco/common/utils/forms';
import { pluralize } from '@weco/common/utils/grammar';
import {
  getQueryPropertyValue,
  getUrlQueryFromSortValue,
  linkResolver,
} from '@weco/common/utils/search';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import EventsSearchResults from '@weco/common/views/components/EventsSearchResults';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import Pagination from '@weco/common/views/components/Pagination';
import SearchFilters from '@weco/common/views/components/SearchFilters';
import { EventsProps } from '@weco/common/views/components/SearchPagesLink/Events';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import Tabs from '@weco/common/views/components/Tabs';
import { themeValues } from '@weco/common/views/themes/config';
import { eventsFilters } from '@weco/content/services/wellcome/common/filters';
import {
  ContentResultsList,
  EventDocument,
} from '@weco/content/services/wellcome/content/types/api';
import { Query } from '@weco/content/types/search';
import { getActiveFiltersLabel, hasFilters } from '@weco/content/utils/search';

import NoEvents from './events.NoEvents';

export type Props = {
  events: ContentResultsList<EventDocument>;
  eventsRouteProps: EventsProps;
  query: Query;
  period: 'future' | 'past';
  jsonLd: JsonLdObj[];
};

const EVENTS_LISTING_FORM_ID = 'events-listing-form';

const EventsPage: FunctionComponent<Props> = props => {
  const { period, jsonLd } = props;
  const router = useRouter();

  const isInPastListing = period === 'past';

  const updateUrl = (form: HTMLFormElement) => {
    const formValues = formDataAsUrlQuery(form);

    const sortOptionValue = getQueryPropertyValue(formValues.sortOrder);
    const urlFormattedSort = sortOptionValue
      ? getUrlQueryFromSortValue(sortOptionValue)
      : undefined;

    // now to strip the page number if page is not what has changed
    if (formValues.page === router.query.page) {
      delete formValues.page;
    }

    const link = linkResolver({
      params: {
        ...formValues,
        ...(urlFormattedSort && {
          sort: 'times.startDateTime',
          sortOrder: period === 'future' ? 'asc' : 'desc',
        }),
      },
      pathname: router.pathname,
    });

    return router.push(link.href, link.as);
  };

  const { events, query } = props;
  const firstEvent = events.results[0];

  const filters = eventsFilters({
    events,
    props: props.eventsRouteProps,
  }).filter(
    f =>
      f.id !== 'timespan' &&
      (isInPastListing ? true : f.id !== 'isAvailableOnline')
  );

  const hasNoResults = events.totalResults === 0;
  const hasActiveFilters = hasFilters({
    filters: filters.map(f => f.id),
    queryParams: query,
  });
  const activeFiltersLabels = getActiveFiltersLabel({ filters });

  return (
    <PageLayout
      title="Events"
      description={pageDescriptions.events}
      url={{ pathname: `/events${period ? `/${period}` : ''}` }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="whats-on"
      image={firstEvent && transformImage(firstEvent.image)}
    >
      <SpacingSection>
        <PageHeader
          breadcrumbs={getBreadcrumbItems('whats-on')}
          title="Events"
          isSlim={true}
        />

        {pageDescriptions.events && (
          <ContaineredLayout gridSizes={gridSize8(false)}>
            <div className={`body-text spaced-text ${font('intr', 4)}`}>
              <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                <p>{pageDescriptions.events}</p>
              </Space>
            </div>
          </ContaineredLayout>
        )}

        <ContaineredLayout gridSizes={gridSize12()}>
          <div
            style={{
              borderBottom: `1px solid ${themeValues.color('neutral.300')}`,
            }}
          >
            <Tabs
              tabBehaviour="navigate"
              currentSection={
                period === 'future' || !period ? 'future' : 'past'
              }
              label="Time-based event filter"
              items={[
                {
                  id: 'future',
                  url: `/events`,
                  text: 'Upcoming events',
                },
                {
                  id: 'past',
                  url: `/events/past`,
                  text: 'Past events',
                },
              ]}
              hideBorder
            />
          </div>
        </ContaineredLayout>

        {(!hasNoResults || (hasNoResults && hasActiveFilters)) && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <Space
              $v={{
                size: 'l',
                properties: ['padding-top', 'padding-bottom'],
              }}
            >
              <form
                role="search"
                id={EVENTS_LISTING_FORM_ID}
                onSubmit={event => {
                  event.preventDefault();

                  updateUrl(event.currentTarget);
                }}
              >
                {/* Normally the search input is here but we don't want one in this case..
                  We need the form for good functioning & No JS behaviour, but we deal with the filters
                  through Javascript and they can't be wrapped in the form as it causes bugs. Because we have
                  the filters twice (modal and desktop), we need to control which filters are assigned to the form
                  instead of including them all. */}
              </form>

              <SearchFilters
                linkResolver={params =>
                  linkResolver({ params, pathname: router.pathname })
                }
                searchFormId={EVENTS_LISTING_FORM_ID}
                changeHandler={() => {
                  const form = document.getElementById(EVENTS_LISTING_FORM_ID);
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
          </ContaineredLayout>
        )}
        {hasNoResults ? (
          <ContaineredLayout gridSizes={gridSize12()}>
            <NoEvents
              isPastListing={isInPastListing}
              hasFilters={hasActiveFilters}
            />
          </ContaineredLayout>
        ) : (
          <>
            <ContaineredLayout gridSizes={gridSize12()}>
              <PaginationWrapper $verticalSpacing="l">
                <span>
                  {pluralize(
                    events.totalResults,
                    (isInPastListing ? 'past ' : '') + 'event'
                  )}
                </span>
                {activeFiltersLabels.length > 0 && (
                  <span className="visually-hidden">
                    {' '}
                    filtered with: {activeFiltersLabels.join(', ')}
                  </span>
                )}

                <Pagination
                  totalPages={events.totalPages}
                  ariaLabel="Events pagination"
                  isHiddenMobile
                />
              </PaginationWrapper>

              <EventsSearchResults
                events={events.results}
                isInPastListing={isInPastListing}
              />
            </ContaineredLayout>

            <ContaineredLayout gridSizes={gridSize12()}>
              <PaginationWrapper $verticalSpacing="l" $alignRight>
                <Pagination
                  totalPages={events.totalPages}
                  ariaLabel="Events pagination"
                />
              </PaginationWrapper>
            </ContaineredLayout>
          </>
        )}
      </SpacingSection>
    </PageLayout>
  );
};

export default EventsPage;
