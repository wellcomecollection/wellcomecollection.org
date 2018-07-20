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
  contributorsFields
} from './fetch-links';
import {
  parseTitle,
  parseDescription,
  parsePlace,
  asText,
  asHtml,
  isDocumentLink,
  parseTimestamp,
  parseBoolean,
  parseGenericFields
} from './parsers';
import {parseEventSeries} from './event-series';
import isEmptyObj from '../../utils/is-empty-object';
import {london} from '../../utils/format-date';
import type {UiEvent, EventFormat} from '../../model/events';
import type {Team} from '../../model/team';
import type {PrismicDocument, PrismicApiSearchResponse, PaginatedResults} from './types';

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

function determineUpcomingDate(times) {
  const todaysDate = london();
  const eventArray = times.map((eventTime) => {
    return london(eventTime.startDateTime);
  })
    .sort((a, b) => b.isBefore(a, 'day'));
  const futureDates = eventArray.filter((date) => !date.isBefore(todaysDate));
  return futureDates[0] ? futureDates[0].toDate()
    : eventArray[0] ? eventArray[0].toDate()
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

export function parseEventDoc(
  document: PrismicDocument,
  scheduleDocs: ?PrismicApiSearchResponse,
  selectedDate: ?string
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

  const upcomingDate = determineUpcomingDate(data.times);
  return {
    type: 'events',
    ...genericFields,
    description: asText(data.description),
    place: isDocumentLink(data.place) ? parsePlace(data.place) : null,
    audiences,
    bookingEnquiryTeam,
    bookingInformation: document.data.bookingInformation,
    bookingType: parseEventBookingType(document),
    cost: document.data.cost,
    format: document.data.format && parseEventFormat(document.data.format),
    interpretations,
    isDropIn: Boolean(document.data.isDropIn),
    series,
    schedule: eventSchedule,
    backgroundTexture: document.data.backgroundTexture.data && document.data.backgroundTexture.data.image.url,
    eventbriteId,
    isCompletelySoldOut: data.times && data.times.filter(time => !time.isFullyBooked).length === 0,
    times: data.times && data.times.map(frag => ({
      range: {
        startDateTime: parseTimestamp(frag.startDateTime),
        endDateTime: parseTimestamp(frag.endDateTime)
      },
      isFullyBooked: parseBoolean(frag.isFullyBooked)
    })),
    // TODO: (event migration)
    body: data.description ? [{
      type: 'text',
      weight: 'default',
      value: parseDescription(data.description)
    }] : [],
    upcomingDate: upcomingDate ? london(upcomingDate).toDate() : null,
    selectedDate: selectedDate ? london(selectedDate).toDate() : null,
    dateRange: determineDateRange(data.times)
  };
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
  eventSeriesFields
);

type EventQueryProps = {|
  id: string,
  selectedDate: string
|}
export async function getEvent(req: Request, {
  id,
  selectedDate
}: EventQueryProps): Promise<?UiEvent> {
  const document = await getDocument(req, id, {
    fetchLinks: fetchLinks
  });

  if (document && document.type === 'events') {
    const scheduleIds = document.data.schedule.map(event => event.event.id).filter(Boolean);
    const eventScheduleDocs = scheduleIds.length > 0 && await getTypeByIds(req, ['events'], scheduleIds, {fetchLinks});
    const event = parseEventDoc(document, eventScheduleDocs || null, selectedDate || null);

    return event;
  }
}

type EventsQueryProps = {|
  seriesId: string
|}
export async function getEvents(req: Request,  {
  seriesId
}: EventsQueryProps): Promise<?PaginatedResults<UiEvent>> {
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
  const orderings = '[my.events.times.startDateTime]';
  const predicates = [
    Prismic.Predicates.at('document.type', 'events'),
    seriesId ? Prismic.Predicates.at('my.events.series.series', seriesId) : null
  ].filter(Boolean);

  const paginatedResults = await getDocuments(req, predicates, {
    orderings,
    graphQuery
  });

  const events = paginatedResults.results.map(doc => {
    return parseEventDoc(doc, null, null);
  });

  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: events
  };
}

type EventSeriesProps = {| id: string |}
export async function getEventSeries(req: Request, {
  id
}: EventSeriesProps) {
  const events = await getEvents(req, {
    seriesId: id
  });

  if (events && events.results.length > 0) {
    const series = events.results[0].series.find(series => series.id === id);
    return {
      series,
      events: events.results
    };
  }
}
