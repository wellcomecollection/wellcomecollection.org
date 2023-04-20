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
import { Query } from '@prismicio/types';
import { getPeriodPredicates } from '../types/predicates';
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
): Promise<Query<EventPrismicDocument>> => {
  return client.getByIDs(scheduleIds, {
    fetchLinks,
    pageSize: 40,
  });
};

type FetchEventsQueryParams = {
  predicates?: string[];
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
    predicates = [],
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

  const dateRangePredicates = period
    ? getPeriodPredicates({ period, startField, endField })
    : [];

  // NOTE: Ideally we'd use the Prismic DSL to construct these predicates rather
  // than dropping in raw strings, but they interfere with the type checker.
  //
  // The current version of the Prismic libraries require the second argument of
  // the 'at()' predicate to be a `string | number | (string | number)[]`, but they
  // need to be booleans.
  //
  // TODO: When we upgrade the Prismic client libraries, convert these to the DSL.
  //
  const onlinePredicates = isOnline ? ['[at(my.events.isOnline, true)]'] : [];

  const availableOnlinePredicates = availableOnline
    ? ['[at(my.events.availableOnline, true)]']
    : [];

  return eventsFetcher.getByType(client, {
    predicates: [
      ...dateRangePredicates,
      ...onlinePredicates,
      ...availableOnlinePredicates,
      ...predicates,
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