// @flow
import type { UiEvent, EventTime } from '../../model/events';
import type {
  PrismicDocument,
  PaginatedResults,
  PrismicQueryOpts,
  PrismicApiSearchResponse,
} from './types';
import type { Team } from '../../model/team';
import Prismic from 'prismic-javascript';
import sortBy from 'lodash.sortby';
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
} from './parsers';
import { getPeriodPredicates } from './utils';
import { parseEventSeries } from './event-series';
import isEmptyObj from '../../utils/is-empty-object';
import { london, formatDayDate } from '../../utils/format-date';
import { getNextWeekendDateRange, isPast } from '../../utils/dates';

const startField = 'my.events.times.startDateTime';
const endField = 'my.events.times.endDateTime';

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
  const lastEndTime =
    data.times &&
    data.times
      .sort(
        (x, y) => moment(x.endDateTime).unix() - moment(y.endDateTime).unix()
      )
      .map(time => {
        return parseTimestamp(time.endDateTime);
      })
      .find((date, i) => i === times.length - 1);
  const isRelaxedPerformance = parseBoolean(data.isRelaxedPerformance);

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
  };

  const eventFormat = event.format
    ? [
        {
          url: null,
          text: event.format.title,
        },
      ]
    : [{ url: null, text: 'Event' }];
  const eventAudiences = event.audiences
    ? event.audiences.map(a => ({
        url: null,
        text: a.title,
      }))
    : [];
  const eventInterpretations = event.interpretations
    ? event.interpretations.map(i => ({
        url: null,
        text: i.interpretationType.title,
      }))
    : [];
  const relaxedPerformanceLabel = event.isRelaxedPerformance
    ? [
        {
          url: null,
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

  return { ...event, labels };
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
];

type EventQueryProps = {|
  id: string,
|};

export async function getEvent(
  req: ?Request,
  { id }: EventQueryProps
): Promise<?UiEvent> {
  const document = await getDocument(req, id, {
    fetchLinks: fetchLinks,
  });

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
  ...PrismicQueryOpts,
|};

export async function getEvents(
  req: ?Request,
  { predicates = [], period, ...opts }: EventsQueryProps
): Promise<PaginatedResults<UiEvent>> {
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
  const orderings = `[my.events.times.startDateTime${
    order === 'desc' ? ' desc' : ''
  }]`;
  const dateRangePredicates = period
    ? getPeriodPredicates(period, startField, endField)
    : [];
  const paginatedResults = await getDocuments(
    req,
    [Prismic.Predicates.at('document.type', 'events')].concat(
      predicates,
      dateRangePredicates
    ),
    {
      orderings,
      page: opts.page,
      pageSize: opts.pageSize,
      graphQuery,
    }
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

function getNextDateInFuture(event: UiEvent): ?EventTime {
  const now = london();
  const futureTimes = event.times.filter(time => {
    const end = london(time.range.endDateTime);
    return end.isSameOrAfter(now, 'day');
  });

  if (futureTimes.length === 0) {
    return null;
  } else {
    return futureTimes.reduce((closestStartingDate, time) => {
      const start = london(time.range.startDateTime);
      if (start.isBefore(closestStartingDate.range.startDateTime)) {
        return time;
      } else {
        return closestStartingDate;
      }
    });
  }
}

function filterEventsByTimeRange(events, start, end) {
  return events.filter(event => {
    return event.times.find(time => {
      const eventStart = london(time.range.startDateTime);
      const eventEnd = london(time.range.endDateTime);
      return (
        eventStart.isBetween(start, end) ||
        eventEnd.isBetween(start, end) ||
        (eventStart.isSameOrBefore(start) && eventEnd.isSameOrAfter(end))
      );
    });
  });
}

export function filterEventsForNext7Days(events: UiEvent[]): UiEvent[] {
  const startOfToday = london().startOf('day');
  const endOfNext7Days = startOfToday
    .clone()
    .add(7, 'day')
    .endOf('day');
  return filterEventsByTimeRange(events, startOfToday, endOfNext7Days);
}

export function filterEventsForToday(events: UiEvent[]): UiEvent[] {
  const startOfToday = london().startOf('day');
  const endOfToday = london().endOf('day');
  return filterEventsByTimeRange(events, startOfToday, endOfToday);
}

export function filterEventsForWeekend(events: UiEvent[]): UiEvent[] {
  const { start, end } = getNextWeekendDateRange(new Date());
  return filterEventsByTimeRange(events, london(start), london(end));
}

export function orderEventsByNextAvailableDate(events: UiEvent[]): UiEvent[] {
  const reorderedEvents = sortBy(
    [...events].filter(getNextDateInFuture),
    getNextDateInFuture
  );

  return reorderedEvents;
}

// TODO: Make this way less forEachy and mutationy 0_0
// TODO: Type this up properly
const GroupByFormat = {
  day: 'dddd',
  month: 'MMMM',
};
type GroupDatesBy = $Keys<typeof GroupByFormat>;
type EventsGroup = {|
  label: string,
  start: Date,
  end: Date,
  events: UiEvent[],
|};

export function groupEventsBy(
  events: UiEvent[],
  groupBy: GroupDatesBy
): EventsGroup[] {
  // Get the full range of all the events
  const range = events
    .map(({ times }) =>
      times.map(time => ({
        start: time.range.startDateTime,
        end: time.range.endDateTime,
      }))
    )
    .reduce((acc, ranges) => acc.concat(ranges))
    .reduce((acc, range) => {
      return {
        start: range.start < acc.start ? range.start : acc.start,
        end: range.end > acc.end ? range.end : acc.end,
      };
    });

  // Convert the range into an array of labeled event groups
  const ranges = getRanges(
    {
      start: london(range.start).startOf(groupBy),
      end: london(range.end).endOf(groupBy),
    },
    groupBy
  ).map(range => ({
    label: range.label,
    start: range.start.toDate(),
    end: range.end.toDate(),
    events: [],
  }));

  // See which events should go into which event group
  events.forEach(event => {
    const times = event.times
      .filter(time => time.range && time.range.startDateTime)
      .map(time => ({
        start: time.range.startDateTime,
        end: time.range.endDateTime,
      }));

    ranges.forEach(range => {
      const isInRange = times.find(time => {
        if (
          (time.start >= range.start && time.start <= range.end) ||
          (time.end >= range.start && time.end <= range.end)
        ) {
          return true;
        }
      });
      const newEvents = isInRange ? range.events.concat([event]) : range.events;
      range.events = newEvents;
    });
  }, {});

  // Remove times from event that fall outside the range of the current event group it is in
  const rangesWithFilteredTimes = ranges.map(range => {
    const start = range.start;
    const end = range.end;
    const events = range.events.map(event => {
      const timesInRange = event.times.filter(time => {
        return (
          time.range.startDateTime >= start && time.range.endDateTime <= end
        );
      });

      return {
        ...event,
        times: timesInRange,
      };
    });

    return {
      ...range,
      events,
    };
  });

  return rangesWithFilteredTimes;
}

// TODO: maybe use a Map?
function getRanges({ start, end }, groupBy: GroupDatesBy, acc = []) {
  if (start.isBefore(end, groupBy) || start.isSame(end, groupBy)) {
    const newStart = start.clone().add(1, groupBy);
    const newAcc = acc.concat([
      {
        label: formatDayDate(start),
        start: start.clone().startOf(groupBy),
        end: start.clone().endOf(groupBy),
      },
    ]);
    return getRanges({ start: newStart, end }, groupBy, newAcc);
  } else {
    return acc;
  }
}
