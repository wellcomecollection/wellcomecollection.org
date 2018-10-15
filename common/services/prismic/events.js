// @flow
import Prismic from 'prismic-javascript';
import {getDocument, getTypeByIds, getDocuments} from './api';
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
import {
  parseTitle,
  parsePlace,
  asText,
  asHtml,
  isDocumentLink,
  parseTimestamp,
  parseBoolean,
  parseGenericFields,
  parseLabelTypeList
} from './parsers';
import {parseEventSeries} from './event-series';
import isEmptyObj from '../../utils/is-empty-object';
import {london, formatDayDate} from '../../utils/format-date';
import {isPast} from '../../utils/dates';
import {getPeriodPredicates} from './utils';
import type {UiEvent, EventFormat, EventTime} from '../../model/events';
import type {Team} from '../../model/team';
import type {
  PrismicDocument,
  PrismicApiSearchResponse,
  PaginatedResults,
  PrismicQueryOpts
} from './types';
import type {Period} from '../../model/periods';

const startField = 'my.events.times.startDateTime';
const endField = 'my.events.times.endDateTime';

function parseEventFormat(frag: Object): ?EventFormat {
  return isDocumentLink(frag) ? {
    id: frag.id,
    title: parseTitle(frag.data.title),
    shortName: asText(frag.data.shortName),
    description: asHtml(frag.data.description)
  } : null;
}

function parseEventBookingType(eventDoc: PrismicDocument): ?string {
  return !isEmptyObj(eventDoc.data.eventbriteEvent) ? 'Ticketed'
    : isDocumentLink(eventDoc.data.bookingEnquiryTeam) ? 'Enquire to book'
      : isDocumentLink(eventDoc.data.place) && eventDoc.data.place.data.capacity  ? 'First come, first served'
        : null;
}

function determineDateRange(times) {
  const startTimes = times.map((eventTime) => {
    return london(eventTime.startDateTime);
  })
    .sort((a, b) => b.isBefore(a, 'day'));
  const endTimes = times.map((eventTime) => {
    return london(eventTime.endDateTime);
  })
    .sort((a, b) => b.isBefore(a, 'day'));
  return {
    firstDate: startTimes[0],
    lastDate: endTimes[endTimes.length - 1],
    repeats: times.length
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
  const genericFields = parseGenericFields(document);
  const eventSchedule = scheduleDocs && scheduleDocs.results ? scheduleDocs.results.map(doc => parseEventDoc(doc)) : [];
  const interpretations = document.data.interpretations.map(interpretation => isDocumentLink(interpretation.interpretationType) ? ({
    interpretationType: {
      title: parseTitle(interpretation.interpretationType.data.title),
      abbreviation: asText(interpretation.interpretationType.data.abbreviation),
      description: interpretation.interpretationType.data.description,
      primaryDescription: interpretation.interpretationType.data.primaryDescription
    },
    isPrimary: Boolean(interpretation.isPrimary)
  }) : null).filter(Boolean);

  const matchedId = /\/e\/([0-9]+)/.exec(document.data.eventbriteEvent.url);
  const eventbriteId = (document.data.eventbriteEvent && matchedId !== null) ? matchedId[1] : '';

  const audiences = document.data.audiences.map(audience => isDocumentLink(audience.audience) ? ({
    title: asText(audience.audience.data.title),
    description: audience.audience.data.description
  }) : null).filter(Boolean);

  const bookingEnquiryTeam = document.data.bookingEnquiryTeam.data && ({
    id: document.data.bookingEnquiryTeam.id,
    title: asText(document.data.bookingEnquiryTeam.data.title) || '',
    email: document.data.bookingEnquiryTeam.data.email,
    phone: document.data.bookingEnquiryTeam.data.phone,
    url: document.data.bookingEnquiryTeam.data.url
  }: Team);

  const series = document.data.series.map(
    series => isDocumentLink(series.series)
      ? parseEventSeries(series.series)
      : null).filter(Boolean);

  const times = data.times && data.times
    // Annoyingly prismic puts blanks in here
    .filter(frag => frag.startDateTime && frag.endDateTime)
    .map(frag => ({
      range: {
        startDateTime: parseTimestamp(frag.startDateTime),
        endDateTime: parseTimestamp(frag.endDateTime)
      },
      isFullyBooked: parseBoolean(frag.isFullyBooked)
    })) || [];

  const displayTime = determineDisplayTime(times);
  const lastEndTime = times.map(time => time.range.endDateTime).find((date, i) => i === times.length - 1);
  const isRelaxedPerformance = parseBoolean(data.isRelaxedPerformance);

  const schedule = eventSchedule.map((event, i) => {
    const scheduleItem = document.data.schedule[i];
    return {
      event,
      isNotLinked: parseBoolean(scheduleItem.isNotLinked)
    };
  });

  const event = {
    type: 'events',
    ...genericFields,
    place: isDocumentLink(data.place) ? parsePlace(data.place) : null,
    audiences,
    bookingEnquiryTeam,
    bookingInformation: document.data.bookingInformation.length > 1 ? document.data.bookingInformation : null,
    bookingType: parseEventBookingType(document),
    cost: document.data.cost,
    format: document.data.format && parseEventFormat(document.data.format),
    interpretations,
    policies: Array.isArray(data.policies) ? parseLabelTypeList(data.policies, 'policy') : [],
    isDropIn: Boolean(document.data.isDropIn),
    series,
    schedule,
    backgroundTexture: document.data.backgroundTexture.data && document.data.backgroundTexture.data.image.url,
    eventbriteId,
    isCompletelySoldOut: data.times && data.times.filter(time => !time.isFullyBooked).length === 0,
    ticketSalesStart: data.ticketSalesStart,
    times: times,
    displayStart: displayTime.range.startDateTime || null,
    displayEnd: displayTime.range.endDateTime || null,
    dateRange: determineDateRange(data.times),
    isPast: lastEndTime ? isPast(lastEndTime) : true,
    isRelaxedPerformance
  };

  const eventFormat = event.format ? [{
    url: null,
    text: event.format.title
  }] : [{ url: null, text: 'Event' }];
  const eventAudiences = event.audiences ? event.audiences.map(a => ({
    url: null,
    text: a.title
  })) : [];
  const eventInterpretations = event.interpretations ? event.interpretations.map(i => ({
    url: null,
    text: i.interpretationType.title
  })) : [];
  const relaxedPerformanceLabel = event.isRelaxedPerformance ? [{
    url: null,
    text: 'Relaxed performance'
  }] : [];

  const labels = [
    ...eventFormat,
    ...eventAudiences,
    ...eventInterpretations,
    ...relaxedPerformanceLabel
  ];

  return {...event, labels};
}

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
  period?: Period,
  order: 'asc' | 'desc',
  ...PrismicQueryOpts
|}

export async function getEvents(req: ?Request,  {
  predicates = [],
  order = 'asc',
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

  const eventsOrderedByDisplayDate = [...events].sort((a, b) => {
    return a.displayStart - b.displayStart;
  });

  // Prismic uses the first date in times to determine past events,
  // so we need to remove the ones that still have more dates in the future
  const eventsWithoutIncorrectPast = events.filter(event => {
    const hasFutureDates = event.times.find(time => london(time.range.startDateTime).isSameOrAfter(london(), 'day'));
    return !hasFutureDates;
  });

  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: order === 'desc' ? eventsWithoutIncorrectPast : eventsOrderedByDisplayDate
  };
}

// TODO: Make this way less forEachy and mutationy 0_0
// TODO: Type this up properly
const groupByFormat = {
  day: 'dddd',
  month: 'MMMM'
};
type GroupDatesBy = $Keys<typeof groupByFormat>
type EventsGroup = {|
  label: string,
  start: Date,
  end: Date,
  events: UiEvent[]
|}

export function groupEventsBy(events: UiEvent[], groupBy: GroupDatesBy): EventsGroup[] {
  // Get the full range of all the events
  const range = events.map(({times}) => times.map(time => ({
    start: time.range.startDateTime,
    end: time.range.endDateTime
  }))).reduce((acc, ranges) => acc.concat(ranges)).reduce((acc, range) => {
    return {
      start: range.start < acc.start ? range.start : acc.start,
      end: range.end > acc.end ? range.end : acc.end
    };
  });

  // Convert the range into an array of labeled event groups
  const ranges = getRanges({
    start: london(range.start).startOf(groupBy),
    end: london(range.end).endOf(groupBy)
  }, groupBy).map(range => ({
    label: range.label,
    start: range.start.toDate(),
    end: range.end.toDate(),
    events: []
  }));

  // See which events should go into which event group
  events.forEach(event => {
    const times = event.times
      .filter(time => time.range && time.range.startDateTime)
      .map(time => ({
        start: time.range.startDateTime,
        end: time.range.endDateTime
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
  const rangesWithFilteredTimes = ranges.map((range) => {
    const start = range.start;
    const end = range.end;
    const events = range.events.map((event) => {
      const timesInRange = event.times.filter((time) => {
        return (time.range.startDateTime >= start && time.range.endDateTime <= end);
      });

      return {
        ...event,
        times: timesInRange
      };
    });

    return {
      ...range,
      events
    };
  });

  return rangesWithFilteredTimes;
}

// TODO: maybe use a Map?
function getRanges({start, end}, groupBy: GroupDatesBy, acc = []) {
  if (start.isBefore(end, groupBy) || start.isSame(end, groupBy)) {
    const newStart = start.clone().add(1, groupBy);
    const newAcc = acc.concat([{
      label: formatDayDate(start),
      start: start.clone().startOf(groupBy),
      end: start.clone().endOf(groupBy)
    }]);
    return getRanges({start: newStart, end}, groupBy, newAcc);
  } else {
    return acc;
  }
}
