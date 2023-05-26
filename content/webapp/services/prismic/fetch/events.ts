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
import { placesFetchLinks } from '../types/places';
import { backgroundTexturesFetchLink } from '../types/background-textures';

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
];

const eventsFetcher = fetcher<EventPrismicDocument>('events', fetchLinks);

export const fetchEvent = eventsFetcher.getById;

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

export const graphQuery = `{
  events {
    ...eventsFields
    format {
      ...formatFields
    }
    series {
      series {
        ...seriesFields
        contributors {
          ...contributorsFields
          role {
            ...roleFields
          }
          contributor {
            ... on people {
              ...peopleFields
            }
            ... on organisations {
              ...organisationsFields
            }
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
      }
    }
    interpretations {
      interpretationType {
        ...interpretationTypeFields
      }
    }
    policies {
      policy {
        ...policyFields
      }
    }
    audiences {
      audience {
        ...audienceFields
      }
    }
    contributors {
      ...contributorsFields
      role {
        ...roleFields
      }
      contributor {
        ... on people {
          ...peopleFields
        }
        ... on organisations {
          ...organisationsFields
        }
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
  }
}`;

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
): Promise<Query<EventPrismicDocument>> => {
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
