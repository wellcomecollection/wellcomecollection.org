import { Team } from '@weco/common/model/events';
import { Event } from '../../../types/events';
import { EventPrismicDocument } from '../types/events';
import { link } from './vendored-helpers';
import { isNotUndefined } from '@weco/common/utils/array';
import { Query } from '@prismicio/types';
import {
  asText,
  isDocumentLink,
  parseBoolean,
  parseFormat,
  parseLabelTypeList,
  parsePlace,
  parseSingleLevelGroup,
  parseTimestamp,
  parseTitle,
} from '@weco/common/services/prismic/parsers';
import { parseSeason } from '@weco/common/services/prismic/seasons';
import {
  determineDateRange,
  determineDisplayTime,
  getLastEndTime,
  parseEventBookingType,
} from '@weco/common/services/prismic/events';
import { parseEventSeries } from '@weco/common/services/prismic/event-series';
import { isPast } from '@weco/common/utils/dates';
import { transformGenericFields } from '.';

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
  const interpretations = data.interpretations
    .map(interpretation =>
      link(interpretation.interpretationType)
        ? {
            interpretationType: {
              title: parseTitle(interpretation.interpretationType.data?.title),
              abbreviation: asText(
                interpretation.interpretationType.data?.abbreviation
              ),
              description: interpretation.interpretationType.data?.description,
              primaryDescription:
                interpretation.interpretationType.data?.primaryDescription,
            },
            isPrimary: Boolean(interpretation.isPrimary),
            extraInformation: interpretation.extraInformation,
          }
        : null
    )
    .filter(Boolean);

  const matchedId =
    data.eventbriteEvent && data.eventbriteEvent.url
      ? /\/e\/([0-9]+)/.exec(data.eventbriteEvent.url)
      : null;
  const eventbriteId =
    data.eventbriteEvent && matchedId !== null ? matchedId[1] : '';

  const audiences = data.audiences
    .map(audience =>
      link(audience.audience)
        ? {
            title: asText(audience.audience.data?.title),
            description: audience.audience.data?.description,
          }
        : null
    )
    .filter(Boolean);

  const bookingEnquiryTeam: Team | undefined = link(data.bookingEnquiryTeam)
    ? {
        id: data.bookingEnquiryTeam.id,
        title: asText(data.bookingEnquiryTeam.data?.title) || '',
        email: data.bookingEnquiryTeam.data!.email!,
        phone: data.bookingEnquiryTeam.data!.phone!,
        url: data.bookingEnquiryTeam.data!.url!,
      }
    : undefined;

  const thirdPartyBooking = {
    name: data.thirdPartyBookingName,
    url: data.thirdPartyBookingUrl,
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
      link(data.backgroundTexture) &&
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

export const getScheduleIds = (
  eventDocument: EventPrismicDocument
): string[] => {
  return eventDocument.data.schedule
    .map(linkField => (link(linkField.event) ? linkField.event.id : undefined))
    .filter(isNotUndefined);
};
