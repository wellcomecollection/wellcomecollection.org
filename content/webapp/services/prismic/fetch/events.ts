import { clientSideFetcher, fetcher, GetServerSidePropsPrismicClient } from '.';
import {
  audienceFetchLinks,
  eventFormatFetchLinks,
  eventPolicyFetchLinks,
  EventPrismicDocument,
  eventsFetchLinks,
  interpretationTypeFetchLinks,
  teamFetchLinks,
} from '../types/events';
import { getEventFilters } from '../types/filters';
import * as prismic from '@prismicio/client';
import { EventBasic } from '../../../types/events';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  eventSeriesFetchLinks,
  exhibitionsFetchLinks,
  seasonsFetchLinks,
} from '../types';
import { cardFetchLinks } from '../types/card';
import { placesFetchLinks } from '../types/places';
import { backgroundTexturesFetchLink } from '../types/background-textures';
import { fetchVisualStories } from './visual-stories';
import { VisualStoryDocument } from '../types/visual-stories';

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
  ...backgroundTexturesFetchLink,
  ...seasonsFetchLinks,
  ...eventsFetchLinks,
  ...cardFetchLinks,
];

const eventsFetcher = fetcher<EventPrismicDocument>('events', fetchLinks);

type FetchEventResult = {
  event?: EventPrismicDocument;
  visualStories: prismic.Query<VisualStoryDocument>;
};
export async function fetchEvent(
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<FetchEventResult> {
  const eventPromise = eventsFetcher.getById(client, id);
  const visualStoriesQueryPromise = fetchVisualStories(client, {
    filters: [prismic.filter.at('my.visual-stories.relatedDocument', id)],
  });
  const [event, visualStories] = await Promise.all([
    eventPromise,
    visualStoriesQueryPromise,
  ]);

  return {
    event,
    visualStories,
  };
}

export const fetchEventScheduleItems = async (
  { client }: GetServerSidePropsPrismicClient,
  scheduleIds: string[]
): Promise<prismic.Query<EventPrismicDocument>> => {
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
  orderings?: (prismic.Ordering | string)[];
};

const startField = 'my.events.times.startDateTime';
const endField = 'my.events.times.endDateTime';

const graphQuery = `{
  events {
    title
    isOnline
    availableOnline
    isRelaxedPerformance
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
): Promise<prismic.Query<EventPrismicDocument>> => {
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
