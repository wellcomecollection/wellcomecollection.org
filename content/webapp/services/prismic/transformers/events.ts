import {
  Audience,
  EventTime,
  Interpretation,
  Team,
  ThirdPartyBooking,
} from '@weco/common/model/events';
import { Event } from '../../../types/events';
import { EventPrismicDocument } from '../types/events';
import { link } from './vendored-helpers';
import { isNotUndefined } from '@weco/common/utils/array';
import { Query } from '@prismicio/types';
import {
  asText,
  parseBoolean,
  parseFormat,
  parseLabelTypeList,
  parseSingleLevelGroup,
  parseTimestamp,
  parseTitle,
} from '@weco/common/services/prismic/parsers';
import { determineDateRange } from '@weco/common/services/prismic/events';
import { isPast } from '@weco/common/utils/dates';
import { isDocumentLink, transformGenericFields } from '.';
import { HTMLString } from '@weco/common/services/prismic/types';
import { transformSeason } from './seasons';
import { transformEventSeries } from './event-series';
import { transformPlace } from './places';
import isEmptyObj from '@weco/common/utils/is-empty-object';
import { london } from '@weco/common/utils/format-date';
import moment from 'moment';

function transformEventBookingType(
  eventDoc: EventPrismicDocument
): string | undefined {
  return !isEmptyObj(eventDoc.data.eventbriteEvent)
    ? 'Ticketed'
    : isDocumentLink(eventDoc.data.bookingEnquiryTeam)
    ? 'Enquire to book'
    : isDocumentLink(eventDoc.data.place) && eventDoc.data.place.data?.capacity
    ? 'First come, first served'
    : undefined;
}

function determineDisplayTime(times: EventTime[]): EventTime {
  const upcomingDates = times.filter(t => {
    return london(t.range.startDateTime).isSameOrAfter(london(), 'day');
  });
  return upcomingDates.length > 0 ? upcomingDates[0] : times[0];
}

export function getLastEndTime(
  times: {
    startDateTime: string | null;
    endDateTime: string | null;
    isFullyBooked: boolean | null;
  }[]
) {
  return times
    .sort((x, y) => moment(y.endDateTime).unix() - moment(x.endDateTime).unix())
    .map(time => parseTimestamp(time.endDateTime))[0];
}

export function transformEvent(
  document: EventPrismicDocument,
  scheduleQuery?: Query<EventPrismicDocument>
): Event {
  const data = document.data;
  const scheduleLength = isDocumentLink(data.schedule.map(s => s.event)[0])
    ? data.schedule.length
    : 0;
  const genericFields = transformGenericFields(document);
  const eventSchedule =
    scheduleQuery && scheduleQuery.results
      ? scheduleQuery.results.map(doc => transformEvent(doc))
      : [];
  const interpretations: Interpretation[] = data.interpretations
    .map(interpretation =>
      link(interpretation.interpretationType)
        ? {
            interpretationType: {
              id: interpretation.interpretationType.id,
              title: parseTitle(interpretation.interpretationType.data?.title),
              abbreviation: asText(
                interpretation.interpretationType.data?.abbreviation
              ),
              description: interpretation.interpretationType.data
                ?.description as HTMLString,
              primaryDescription: interpretation.interpretationType.data
                ?.primaryDescription as HTMLString,
            },
            isPrimary: Boolean(interpretation.isPrimary),
            extraInformation: interpretation.extraInformation as HTMLString,
          }
        : undefined
    )
    .filter(isNotUndefined);

  const matchedId =
    data.eventbriteEvent && data.eventbriteEvent.url
      ? /\/e\/([0-9]+)/.exec(data.eventbriteEvent.url)
      : null;
  const eventbriteId =
    data.eventbriteEvent && matchedId !== null ? matchedId[1] : '';

  const audiences: Audience[] = data.audiences
    .map(audience =>
      link(audience.audience)
        ? {
            id: audience.audience.id,
            title: asText(audience.audience.data?.title),
            description: audience.audience.data?.description as
              | HTMLString
              | undefined,
          }
        : undefined
    )
    .filter(isNotUndefined);

  const bookingEnquiryTeam: Team | undefined = isDocumentLink(
    data.bookingEnquiryTeam
  )
    ? {
        id: data.bookingEnquiryTeam.id,
        title: asText(data.bookingEnquiryTeam.data?.title) || '',
        email: data.bookingEnquiryTeam.data!.email!,
        phone: data.bookingEnquiryTeam.data!.phone!,
        url: data.bookingEnquiryTeam.data!.url!,
      }
    : undefined;

  const thirdPartyBooking: ThirdPartyBooking | undefined = isDocumentLink(
    data.thirdPartyBookingUrl
  )
    ? {
        name: data.thirdPartyBookingName || undefined,
        url: data.thirdPartyBookingUrl.url!,
      }
    : undefined;

  const series = parseSingleLevelGroup(data.series, 'series').map(series => {
    return transformEventSeries(series);
  });

  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return transformSeason(season);
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

  const locations = parseSingleLevelGroup(data.locations, 'location').map(
    location => transformPlace(location)
  );

  const place = parseSingleLevelGroup(data, 'place').map(place =>
    transformPlace(place)
  );

  // We want to display the scheduleLength on EventPromos,
  // but don't want to make an extra API request to populate the schedule for every event in a list.
  // We therefore return the scheduleLength property.
  const event = {
    ...genericFields,
    place,
    locations,
    audiences,
    bookingEnquiryTeam,
    thirdPartyBooking: thirdPartyBooking,
    bookingInformation:
      data.bookingInformation && data.bookingInformation.length > 1
        ? (data.bookingInformation as HTMLString)
        : undefined,
    bookingType: transformEventBookingType(document),
    cost: data.cost || undefined,
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
      link(data.backgroundTexture) && data.backgroundTexture.data?.image.url
        ? data.backgroundTexture.data.image.url
        : undefined,
    eventbriteId,
    isCompletelySoldOut:
      data.times && data.times.filter(time => !time.isFullyBooked).length === 0,
    ticketSalesStart: parseTimestamp(data.ticketSalesStart),
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

  return { ...event, type: 'events', labels, primaryLabels, secondaryLabels };
}

export const getScheduleIds = (
  eventDocument: EventPrismicDocument
): string[] => {
  return eventDocument.data.schedule
    .map(linkField => (link(linkField.event) ? linkField.event.id : undefined))
    .filter(isNotUndefined);
};
