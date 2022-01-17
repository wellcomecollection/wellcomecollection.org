// @flow
import type { UiEvent, EventTime } from '../../model/events';
import type {
  PrismicDocument,
  PaginatedResults,
  PrismicQueryOpts,
  PrismicApiSearchResponse,
} from './types';
import type { Team } from '../../model/team';
import Prismic from '@prismicio/client';
import moment from 'moment';
import { getDocument, getTypeByIds, getDocuments } from './api';
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
  eventPoliciesFields,
  seasonsFields,
} from './fetch-links';
import {
  parseTitle,
  parsePlace,
  parseFormat,
  asText,
  isDocumentLink,
  parseTimestamp,
  parseBoolean,
  parseGenericFields,
  parseLabelTypeList,
  parseSingleLevelGroup,
} from './parsers';
import { getPeriodPredicates } from './utils';
import { parseEventSeries } from './event-series';
// $FlowFixMe (tsx)
import { parseSeason } from './seasons';
import isEmptyObj from '../../utils/is-empty-object';
// $FlowFixMe
import { london } from '../../utils/format-date';
import { isPast } from '../../utils/dates';

const startField = 'my.events.times.startDateTime';
const endField = 'my.events.times.endDateTime';

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

function parseEventBookingType(eventDoc: PrismicDocument): ?string {
  return !isEmptyObj(eventDoc.data.eventbriteEvent)
    ? 'Ticketed'
    : isDocumentLink(eventDoc.data.bookingEnquiryTeam)
    ? 'Enquire to book'
    : isDocumentLink(eventDoc.data.place) && eventDoc.data.place.data.capacity
    ? 'First come, first served'
    : null;
}

function determineDateRange(times) {
  const startTimes = times
    .map(eventTime => {
      return london(eventTime.startDateTime);
    })
    .sort((a, b) => b.isBefore(a, 'day'));
  const endTimes = times
    .map(eventTime => {
      return london(eventTime.endDateTime);
    })
    .sort((a, b) => b.isBefore(a, 'day'));
  return {
    firstDate: startTimes[0],
    lastDate: endTimes[endTimes.length - 1],
    repeats: times.length,
  };
}

function determineDisplayTime(times: EventTime[]): EventTime {
  const upcomingDates = times.filter(t => {
    return london(t.range.startDateTime).isSameOrAfter(london(), 'day');
  });
  return upcomingDates.length > 0 ? upcomingDates[0] : times[0];
}

export function getLastEndTime(
  times: {
    startDateTime: string,
    endDateTime: string,
    isFullyBooked: ?boolean,
  }[]
) {
  return times
    .sort((x, y) => moment(y.endDateTime).unix() - moment(x.endDateTime).unix())
    .map(time => {
      return parseTimestamp(time.endDateTime);
    })[0];
}

export function parseEventDoc(
  document: PrismicDocument,
  scheduleDocs: ?PrismicApiSearchResponse
): UiEvent {
  const data = document.data;
  const scheduleLength = isDocumentLink(data.schedule.map(s => s.event)[0])
    ? data.schedule.length
    : 0;
  const genericFields = parseGenericFields(document);
  const eventSchedule =
    scheduleDocs && scheduleDocs.results
      ? scheduleDocs.results.map(doc => parseEventDoc(doc))
      : [];
  const interpretations = data.interpretations
    .map(interpretation =>
      isDocumentLink(interpretation.interpretationType)
        ? {
            interpretationType: {
              title: parseTitle(interpretation.interpretationType.data.title),
              abbreviation: asText(
                interpretation.interpretationType.data.abbreviation
              ),
              description: interpretation.interpretationType.data.description,
              primaryDescription:
                interpretation.interpretationType.data.primaryDescription,
            },
            isPrimary: Boolean(interpretation.isPrimary),
            extraInformation: interpretation.extraInformation,
          }
        : null
    )
    .filter(Boolean);

  const matchedId =
    data.eventbriteEvent && /\/e\/([0-9]+)/.exec(data.eventbriteEvent.url);
  const eventbriteId =
    data.eventbriteEvent && matchedId !== null ? matchedId[1] : '';

  const audiences = data.audiences
    .map(audience =>
      isDocumentLink(audience.audience)
        ? {
            title: asText(audience.audience.data.title),
            description: audience.audience.data.description,
          }
        : null
    )
    .filter(Boolean);

  const bookingEnquiryTeam =
    data.bookingEnquiryTeam &&
    data.bookingEnquiryTeam.data &&
    ({
      id: data.bookingEnquiryTeam.id,
      title: asText(data.bookingEnquiryTeam.data.title) || '',
      email: data.bookingEnquiryTeam.data.email,
      phone: data.bookingEnquiryTeam.data.phone,
      url: data.bookingEnquiryTeam.data.url,
    }: Team);

  const thirdPartyBooking = data.thirdPartyBookingName && {
    name: data.thirdPartyBookingName,
    url: data.thirdPartyBookingUrl.url,
  };

  const series = data.series
    .map(series =>
      isDocumentLink(series.series) ? parseEventSeries(series.series) : null
    )
    .filter(Boolean);

  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return parseSeason(season);
  });

  const times =
    (data.times &&
      data.times
        // Annoyingly prismic puts blanks in here
        .filter(frag => frag.startDateTime && frag.endDateTime)
        .map(frag => ({
          range: {
            startDateTime: parseTimestamp(frag.startDateTime),
            endDateTime: parseTimestamp(frag.endDateTime),
          },
          isFullyBooked: parseBoolean(frag.isFullyBooked),
        }))) ||
    [];

  const displayTime = determineDisplayTime(times);
  const lastEndTime = data.times && getLastEndTime(data.times);
  const isRelaxedPerformance = parseBoolean(data.isRelaxedPerformance);
  const isOnline = parseBoolean(data.isOnline);
  const availableOnline = parseBoolean(data.availableOnline);
  const schedule = eventSchedule.map((event, i) => {
    const scheduleItem = data.schedule[i];
    return {
      event,
      isNotLinked: parseBoolean(scheduleItem.isNotLinked),
    };
  });

  // We want to display the scheduleLength on EventPromos,
  // but don't want to make an extra API request to populate the schedule for every event in a list.
  // We therefore return the scheduleLength property.
  const event = {
    type: 'events',
    ...genericFields,
    place: isDocumentLink(data.place) ? parsePlace(data.place) : null,
    audiences,
    bookingEnquiryTeam,
    thirdPartyBooking: thirdPartyBooking,
    bookingInformation:
      data.bookingInformation && data.bookingInformation.length > 1
        ? data.bookingInformation
        : null,
    bookingType: parseEventBookingType(document),
    cost: data.cost,
    format: data.format && parseFormat(data.format),
    interpretations,
    policies: Array.isArray(data.policies)
      ? parseLabelTypeList(data.policies, 'policy')
      : [],
    hasEarlyRegistration: Boolean(data.hasEarlyRegistration),
    series,
    seasons,
    scheduleLength,
    schedule,
    backgroundTexture:
      data.backgroundTexture &&
      data.backgroundTexture.data &&
      data.backgroundTexture.data.image.url,
    eventbriteId,
    isCompletelySoldOut:
      data.times && data.times.filter(time => !time.isFullyBooked).length === 0,
    ticketSalesStart: data.ticketSalesStart,
    times: times,
    displayStart: (displayTime && displayTime.range.startDateTime) || null,
    displayEnd: (displayTime && displayTime.range.endDateTime) || null,
    dateRange: determineDateRange(data.times),
    isPast: lastEndTime ? isPast(lastEndTime) : true,
    isRelaxedPerformance,
    isOnline,
    availableOnline,
    prismicDocument: document,
  };

  const eventFormat = event.format
    ? [
        {
          text: event.format.title,
        },
      ]
    : [{ text: 'Event' }];
  const eventAudiences = event.audiences
    ? event.audiences.map(a => ({
        text: a.title,
      }))
    : [];
  const eventInterpretations = event.interpretations
    ? event.interpretations.map(i => ({
        text: i.interpretationType.title,
      }))
    : [];
  const relaxedPerformanceLabel = event.isRelaxedPerformance
    ? [
        {
          text: 'Relaxed',
        },
      ]
    : [];

  const labels = [
    ...eventFormat,
    ...eventAudiences,
    ...eventInterpretations,
    ...relaxedPerformanceLabel,
  ];

  const primaryLabels = [
    ...eventFormat,
    ...eventAudiences,
    ...relaxedPerformanceLabel,
  ];
  const secondaryLabels = [...eventInterpretations];

  return { ...event, labels, primaryLabels, secondaryLabels };
}

const fetchLinks = [
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
  eventPoliciesFields,
  seasonsFields,
];

type EventQueryProps = {|
  id: string,
|};

export async function getEvent(
  req: ?Request,
  { id }: EventQueryProps,
  memoizedPrismic: ?Object
): Promise<?UiEvent> {
  const document = await getDocument(
    req,
    id,
    {
      fetchLinks: fetchLinks,
    },
    memoizedPrismic
  );

  if (document && document.type === 'events') {
    const scheduleIds = document.data.schedule
      .map(({ event }) => event.id)
      .filter(Boolean);
    const eventScheduleDocs =
      scheduleIds.length > 0 &&
      (await getTypeByIds(req, ['events'], scheduleIds, {
        fetchLinks,
        pageSize: 40,
      }));
    const event = parseEventDoc(document, eventScheduleDocs || null);

    return event;
  }
}

type EventsQueryProps = {|
  predicates?: Prismic.Predicates[],
  period?: 'current-and-coming-up' | 'past',
  isOnline?: boolean,
  availableOnline?: boolean,
  ...PrismicQueryOpts,
|};

const isOnlinePredicate = Prismic.Predicates.at('my.events.isOnline', true);
const availableOnlinePredicate = Prismic.Predicates.at(
  'my.events.availableOnline',
  true
);
export async function getEvents(
  req: ?Request,
  {
    predicates = [],
    period,
    isOnline,
    availableOnline,
    ...opts
  }: EventsQueryProps,
  memoizedPrismic: ?Object
): Promise<PaginatedResults<UiEvent>> {
  const order = period === 'past' ? 'desc' : 'asc';
  const orderings = `[my.events.times.startDateTime${
    order === 'desc' ? ' desc' : ''
  }]`;
  const dateRangePredicates = period
    ? getPeriodPredicates(period, startField, endField)
    : [];

  // We only send the predicates over for true values as
  // events can either have `false` or `undefined`.
  const filterPredicates = [
    [isOnline, isOnlinePredicate],
    [availableOnline, availableOnlinePredicate],
  ]
    .filter(([condition, predicate]) => condition)
    .map(([condition, predicate]) => predicate);

  const paginatedResults = await getDocuments(
    req,
    [Prismic.Predicates.at('document.type', 'events')]
      .concat(predicates, dateRangePredicates, filterPredicates)
      .filter(Boolean),
    {
      orderings,
      page: opts.page,
      pageSize: opts.pageSize,
      graphQuery,
    },
    memoizedPrismic
  );
  const events = paginatedResults.results.map(doc => {
    return parseEventDoc(doc, null);
  });

  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: events,
  };
}
