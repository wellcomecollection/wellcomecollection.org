import * as prismic from '@prismicio/client';

import {
  EventsDocument as RawEventsDocument,
  VisualStoriesDocument as RawVisualStoriesDocument,
} from '@weco/common/prismicio-types';
import { fetchVisualStories } from '@weco/content/services/prismic/fetch/visual-stories';
import {
  audienceFetchLinks,
  cardFetchLinks,
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  eventFormatFetchLinks,
  eventPolicyFetchLinks,
  eventSeriesFetchLinks,
  eventsFetchLinks,
  exhibitionsFetchLinks,
  interpretationTypeFetchLinks,
  placesFetchLinks,
  seasonsFetchLinks,
  teamFetchLinks,
} from '@weco/content/services/prismic/types';
import { getEventFilters } from '@weco/content/services/prismic/types/filters';
import { EventBasic } from '@weco/content/types/events';

import { clientSideFetcher, fetcher, GetServerSidePropsPrismicClient } from '.';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...eventSeriesFetchLinks,
  ...exhibitionsFetchLinks,
  ...eventFormatFetchLinks,
  ...interpretationTypeFetchLinks,
  ...audienceFetchLinks,
  ...eventPolicyFetchLinks,
  ...placesFetchLinks,
  ...teamFetchLinks,
  ...seasonsFetchLinks,
  ...eventsFetchLinks,
  ...cardFetchLinks,
] as string[];

const eventsFetcher = fetcher<RawEventsDocument>('events', fetchLinks);

type FetchEventResult = {
  event?: RawEventsDocument;
  visualStories?: prismic.Query<RawVisualStoriesDocument>;
};
export async function fetchEvent(
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<FetchEventResult | undefined> {
  // #11240 once redirects are in place we should only fetch by uid
  const event =
    (await eventsFetcher.getByUid(client, id)) ||
    (await eventsFetcher.getById(client, id));

  if (!event) return;

  const visualStories = await fetchVisualStories(client, {
    filters: [prismic.filter.at('my.visual-stories.relatedDocument', event.id)],
  });

  return {
    event,
    visualStories,
  };
}

export const fetchEventScheduleItems = async (
  { client }: GetServerSidePropsPrismicClient,
  scheduleIds: string[]
): Promise<prismic.Query<RawEventsDocument>> => {
  return client.getByIDs(scheduleIds, {
    fetchLinks,
    pageSize: 40,
  });
};

type FetchEventsQueryParams = {
  filters?: string[];
  period?: 'current-and-coming-up' | 'past';
  isOnline?: boolean;
  availableOnline?: boolean;
  page?: number;
  pageSize?: number;
  orderings?: prismic.Ordering[];
};

const startField = 'my.events.times.startDateTime';
const endField = 'my.events.times.endDateTime';

const graphQuery = `{
  events {
    title
    isOnline
    availableOnline
    format {
      ... on event-formats {
        title
      }
    }
    interpretations {
      interpretationType {
        title
      }
    }
    times {
      startDateTime
      endDateTime
      isFullyBooked
      onlineIsFullyBooked
    }
    audiences {
      audience {
        title
      }
    }
    schedule {
      event {
        title
        times {
          startDateTime
          endDateTime
        }
      }
      isNotLinked
    }
    locations {
      location {
        title
      }
    }
    promo {
      ... on editorialImage {
        non-repeat {
          caption
          image
        }
      }
    }
    series {
      series {
        title
        promo {
          ... on editorialImage {
            non-repeat {
              caption
              image
            }
          }
        }
      }
    }
  }
}`.replace(/\n(\s+)/g, '\n');

export const fetchEvents = (
  client: GetServerSidePropsPrismicClient,
  {
    filters = [],
    period,
    isOnline,
    availableOnline,
    page,
    pageSize,
    orderings = [],
  }: FetchEventsQueryParams
): Promise<prismic.Query<RawEventsDocument>> => {
  const order = period === 'past' ? 'desc' : 'asc';
  const startTimeOrderings =
    order === 'desc'
      ? ([
          { field: 'my.events.times.startDateTime', direction: 'desc' },
        ] as prismic.Ordering[])
      : [];

  const dateRangeFilters = period
    ? getEventFilters({ period, startField, endField })
    : [];

  const onlineFilters = isOnline
    ? [prismic.filter.at('my.events.isOnline', true)]
    : [];

  const availableOnlineFilters = availableOnline
    ? [prismic.filter.at('my.events.availableOnline', true)]
    : [];

  return eventsFetcher.getByType(client, {
    filters: [
      ...dateRangeFilters,
      ...onlineFilters,
      ...availableOnlineFilters,
      ...filters,
    ],
    orderings: [...orderings, ...startTimeOrderings],
    page,
    pageSize,
    graphQuery,
  });
};

// See also: the API route /api/events, which returns the data used
// by this fetcher.
export const fetchEventsClientSide =
  clientSideFetcher<EventBasic>('events').getByTypeClientSide;
