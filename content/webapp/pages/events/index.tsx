import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { Period } from '@weco/common/types/periods';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { font } from '@weco/common/utils/classnames';
import { pluralize } from '@weco/common/utils/grammar';
import { serialiseProps } from '@weco/common/utils/json';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import Divider from '@weco/common/views/components/Divider/Divider';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import EventsSearchResults from '@weco/content/components/EventsSearchResults';
import MoreLink from '@weco/content/components/MoreLink/MoreLink';
import Pagination from '@weco/content/components/Pagination/Pagination';
import Tabs from '@weco/content/components/Tabs';
import { orderEventsByNextAvailableDate } from '@weco/content/services/prismic/events';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import {
  transformEvent,
  transformEventBasic,
} from '@weco/content/services/prismic/transformers/events';
import {
  eventLd,
  eventLdContentApi,
} from '@weco/content/services/prismic/transformers/json-ld';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { getEvents } from '@weco/content/services/wellcome/content/events';
import {
  ContentResultsList,
  EventDocument,
} from '@weco/content/services/wellcome/content/types/api';
import { EventBasic } from '@weco/content/types/events';
import { getPage } from '@weco/content/utils/query-params';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';

export type Props = {
  title: string;
  events: PaginatedResults<EventBasic>;
  period?: Period;
  jsonLd: JsonLdObj[];
};

type NewProps = {
  events: ContentResultsList<EventDocument>;
  period: 'future' | 'past';
  jsonLd: JsonLdObj[];
};

export const getServerSideProps: GetServerSideProps<
  (NewProps | Props) | AppErrorProps
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const serverData = await getServerData(context);
  const isUsingContentAPI = !!serverData.toggles.filterEventsListing.value;

  if (isUsingContentAPI) {
    const { period = 'future', availableOnline, page } = context.query;

    if (availableOnline) {
      return {
        redirect: {
          permanent: false,
          destination: '/events/past?isAvailableOnline=true',
        },
      };
    }

    const pageNumber = getQueryPropertyValue(page);
    const paramsQuery = { timespan: getQueryPropertyValue(period) || '' };

    const eventResponseList = await getEvents({
      params: {
        ...paramsQuery,
        sort: getQueryPropertyValue(context.query.sort),
        sortOrder: getQueryPropertyValue(context.query.sortOrder),
        ...(pageNumber && { page: Number(pageNumber) }),
      },
      pageSize: 25,
      toggles: serverData.toggles,
    });

    if (eventResponseList?.type === 'Error') {
      return appError(
        context,
        eventResponseList.httpStatus,
        'Content API error'
      );
    }

    if (eventResponseList) {
      const jsonLd = eventResponseList.results.flatMap(eventLdContentApi);

      return {
        props: serialiseProps({
          events: eventResponseList,
          period: period as 'future' | 'past',
          jsonLd,
          serverData,
        }),
      };
    }

    return { notFound: true };
  } else {
    const {
      period = 'current-and-coming-up',
      isOnline,
      availableOnline,
    } = context.query;

    const client = createClient(context);

    const eventsQueryPromise = await fetchEvents(client, {
      page,
      period: period as 'current-and-coming-up' | 'past' | undefined,
      pageSize: 100,
      isOnline: isOnline === 'true',
      availableOnline: availableOnline === 'true',
    });

    const events = transformQuery(eventsQueryPromise, transformEvent);
    const basicEvents = transformQuery(eventsQueryPromise, transformEventBasic);

    if (events) {
      const title = (period === 'past' ? 'Past e' : 'E') + 'vents';
      const jsonLd = events.results.flatMap(eventLd);

      return {
        props: serialiseProps({
          events: {
            ...events,
            results: basicEvents.results,
          },
          title,
          period: period as Period,
          jsonLd,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  }
};

const EventsPage: FunctionComponent<Props | NewProps> = props => {
  const { period, jsonLd } = props;

  // Only the old page returns a title
  if (!('title' in props)) {
    const { events } = props;
    const firstEvent = events.results[0];

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
            breadcrumbs={{ items: [] }}
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
            />
          </ContaineredLayout>

          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="l">
              <span>
                {pluralize(
                  events.totalResults,
                  (period === 'past' ? 'past ' : '') + 'event'
                )}
              </span>
            </PaginationWrapper>

            <EventsSearchResults
              events={events.results}
              isInPastListing={period === 'past'}
            />
          </ContaineredLayout>

          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="l" $alignRight>
              <Pagination
                totalPages={events.totalPages}
                ariaLabel="Results pagination"
              />
            </PaginationWrapper>
          </ContaineredLayout>
        </SpacingSection>
      </PageLayout>
    );
  } else {
    const { events } = props;

    const convertedPaginatedResults = {
      ...events,
      results:
        period !== 'past'
          ? orderEventsByNextAvailableDate(events.results)
          : events.results,
    };
    const firstEvent = events.results[0];

    return (
      <PageLayout
        title={props.title}
        description={pageDescriptions.events}
        url={{ pathname: `/events${period ? `/${period}` : ''}` }}
        jsonLd={jsonLd}
        openGraphType="website"
        siteSection="whats-on"
        image={firstEvent?.promo?.image}
      >
        <SpacingSection>
          <PageHeader
            breadcrumbs={{ items: [] }}
            labels={undefined}
            title={props.title}
            ContentTypeInfo={
              pageDescriptions.events && (
                <PrismicHtmlBlock
                  html={[
                    {
                      type: 'paragraph',
                      text: pageDescriptions.events,
                      spans: [],
                    },
                  ]}
                />
              )
            }
            backgroundTexture={headerBackgroundLs}
            highlightHeading={true}
          />

          {convertedPaginatedResults.totalPages > 1 && (
            <ContaineredLayout gridSizes={gridSize12()}>
              <PaginationWrapper $verticalSpacing="l">
                <span>
                  {pluralize(convertedPaginatedResults.totalResults, 'result')}
                </span>

                <Pagination
                  totalPages={convertedPaginatedResults.totalPages}
                  ariaLabel="Results pagination"
                  isHiddenMobile
                />
              </PaginationWrapper>

              <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                <Divider />
              </Space>
            </ContaineredLayout>
          )}

          <Space $v={{ size: 'l', properties: ['margin-top'] }}>
            {convertedPaginatedResults.results.length > 0 ? (
              <CardGrid
                items={convertedPaginatedResults.results}
                itemsPerRow={3}
                isInPastListing={period === 'past'}
              />
            ) : (
              <ContaineredLayout gridSizes={gridSize12()}>
                <p>There are no results.</p>
              </ContaineredLayout>
            )}
          </Space>

          {convertedPaginatedResults.totalPages > 1 && (
            <ContaineredLayout gridSizes={gridSize12()}>
              <PaginationWrapper $verticalSpacing="l" $alignRight>
                <Pagination
                  totalPages={convertedPaginatedResults.totalPages}
                  ariaLabel="Results pagination"
                />
              </PaginationWrapper>
            </ContaineredLayout>
          )}

          {period === 'current-and-coming-up' && (
            <ContaineredLayout gridSizes={gridSize12()}>
              <Space $v={{ size: 'm', properties: ['margin-top'] }}>
                <MoreLink url="/events/past" name="View past events" />
              </Space>
            </ContaineredLayout>
          )}
        </SpacingSection>
      </PageLayout>
    );
  }
};

export default EventsPage;
