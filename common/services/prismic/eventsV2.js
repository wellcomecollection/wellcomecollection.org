
// @flow
import Prismic from 'prismic-javascript';
import {getDocument, getTypeByIds, getDocuments} from './api';
import {parseEventDoc} from './events';
import {
  eventAccessOptionsFields,
  teamsFields,
  eventFormatsFields,
  placesFields,
  interpretationTypesFields,
  audiencesFields,
  eventSeriesFields,
  organisationsFields,
  peopleFields,
  contributorsFields,
  eventPoliciesFields
} from './fetch-links';
import {london} from '../../utils/format-date';
import {getPeriodPredicates} from './utils';
import type {UiEvent, EventTime} from '../../model/events';

import type {
  PaginatedResults,
  PrismicQueryOpts
} from './types';
import type {Period} from '../../model/periods';

const startField = 'my.events.times.startDateTime';
const endField = 'my.events.times.endDateTime';

const fetchLinks = [].concat(
  eventAccessOptionsFields,
  teamsFields,
  eventFormatsFields,
  placesFields,
  interpretationTypesFields,
  audiencesFields,
  eventSeriesFields,
  organisationsFields,
  peopleFields,
  contributorsFields,
  eventSeriesFields,
  eventPoliciesFields
);

type EventQueryProps = {|
  id: string
|}

export async function getEvent(req: ?Request, {id}: EventQueryProps): Promise<?UiEvent> {
  const document = await getDocument(req, id, {
    fetchLinks: fetchLinks
  });

  if (document && document.type === 'events') {
    const scheduleIds = document.data.schedule.map(({event}) => event.id).filter(Boolean);
    const eventScheduleDocs = scheduleIds.length > 0 && await getTypeByIds(req, ['events'], scheduleIds, {fetchLinks});
    const event = parseEventDoc(document, eventScheduleDocs || null);

    return event;
  }
}

type EventsQueryProps = {|
  predicates?: Prismic.Predicates[],
  period?: 'current-and-coming-up' | 'past',
  ...PrismicQueryOpts
|}

export async function getEvents(req: ?Request,  {
  predicates = [],
  period,
  ...opts
}: EventsQueryProps): Promise<PaginatedResults<UiEvent>> {
  const graphQuery = `{
    events {
      ...eventsFields
      format {
        ...formatFields
      }
      place {
        ...placeFields
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

  const order = period === 'past' ? 'desc' : 'asc';
  const orderings = `[my.events.times.startDateTime${order === 'desc' ? ' desc' : ''}]`;
  const dateRangePredicates = period ? getPeriodPredicates(
    period,
    startField,
    endField
  ) : [];
  const paginatedResults = await getDocuments(req, [
    Prismic.Predicates.at('document.type', 'events')
  ].concat(predicates, dateRangePredicates), {
    orderings,
    page: opts.page,
    pageSize: opts.pageSize,
    graphQuery
  });

  const events = paginatedResults.results.map(doc => {
    return parseEventDoc(doc, null);
  });

  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: events
  };
}

function getNextDateInFuture(event: UiEvent): EventTime {
  const now = london();
  return event.times.filter(time => {
    const end = london(time.range.endDateTime);
    return end.isAfter(now, 'day');
  }).reduce((closestStartingDate, time) => {
    const start = london(time.range.startDateTime);
    if (
      start.isBefore(closestStartingDate.range.startDateTime)
    ) {
      return time;
    } else {
      return closestStartingDate;
    }
  });
}

export function orderEventsByNextAvailableDate(events: UiEvent[]): UiEvent[] {
  const reorderedEvents = events.sort((a, b) => {
    const aNextDate = getNextDateInFuture(a);
    const bNextDate = getNextDateInFuture(a);

    return london(aNextDate.range.startDateTime)
      .isBefore(bNextDate.range.startDateTime) ? -1  : 1;
  });
  return reorderedEvents;
}
