import {
  Audience,
  DateTimeRange,
  EventTime,
  Event,
  EventBasic,
  Interpretation,
  Team,
  ThirdPartyBooking,
} from '../../../types/events';
import {
  EventPrismicDocument,
  EventPolicy as EventPolicyPrismicDocument,
} from '../types/events';
import { isNotUndefined } from '@weco/common/utils/array';
import { GroupField, Query, RelationField } from '@prismicio/types';
import { isPast } from '@weco/common/utils/dates';
import {
  asText,
  asTitle,
  transformFormat,
  transformGenericFields,
  transformLabelType,
  transformSingleLevelGroup,
  transformTimestamp,
} from '.';
import { transformSeason } from './seasons';
import { transformEventSeries } from './event-series';
import { transformPlace } from './places';
import isEmptyObj from '@weco/common/utils/is-empty-object';
import { LabelField } from '@weco/common/model/label-field';
import {
  isFilledLinkToDocumentWithData,
  isFilledLinkToWebField,
} from '../types';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import { SeasonPrismicDocument } from '../types/seasons';
import { EventSeriesPrismicDocument } from '../types/event-series';
import { PlacePrismicDocument } from '../types/places';
import { transformContributors } from './contributors';
import * as prismicH from '@prismicio/helpers';

function transformEventBookingType(
  eventDoc: EventPrismicDocument
): string | undefined {
  return !isEmptyObj(eventDoc.data.eventbriteEvent)
    ? 'Ticketed'
    : isFilledLinkToDocumentWithData(eventDoc.data.bookingEnquiryTeam)
    ? 'Enquire to book'
    : eventDoc.data.locations &&
      isNotUndefined(eventDoc.data.locations[0]) &&
      isFilledLinkToDocumentWithData(eventDoc.data.locations[0].location) &&
      eventDoc.data.locations[0].location.data.capacity
    ? 'First come, first served'
    : undefined;
}

export function getLastEndTime(times: EventTime[]): Date | undefined {
  return times.length > 0
    ? times
        .map(({ range: { endDateTime } }) => endDateTime)
        .reduce((a, b) => (a.valueOf() > b.valueOf() ? a : b))
    : undefined;
}

export function transformEventPolicyLabels(
  fragment: GroupField<{
    policy: RelationField<
      'event-policy',
      'en-gb',
      InferDataInterface<EventPolicyPrismicDocument>
    >;
  }>,
  labelKey: string
): LabelField[] {
  return fragment
    .map(label => label[labelKey])
    .filter(Boolean)
    .filter(label => label.isBroken === false)
    .filter(label => isFilledLinkToDocumentWithData(label))
    .map(label => transformLabelType(label));
}

export function transformEvent(
  document: EventPrismicDocument,
  scheduleQuery?: Query<EventPrismicDocument>
): Event {
  const data = document.data;
  const scheduleLength = isFilledLinkToDocumentWithData(
    data.schedule.map(s => s.event)[0]
  )
    ? data.schedule.length
    : 0;
  const genericFields = transformGenericFields(document);
  const eventSchedule =
    scheduleQuery && scheduleQuery.results
      ? scheduleQuery.results.map(doc => transformEvent(doc))
      : [];
  const interpretations: Interpretation[] = data.interpretations
    .map(interpretation =>
      prismicH.isFilled.link(interpretation.interpretationType)
        ? {
            interpretationType: {
              id: interpretation.interpretationType.id,
              title: asTitle(
                interpretation.interpretationType.data?.title || []
              ),
              abbreviation: interpretation.interpretationType.data?.abbreviation
                ? asText(interpretation.interpretationType.data?.abbreviation)
                : undefined,
              description: interpretation.interpretationType.data?.description,
              primaryDescription:
                interpretation.interpretationType.data?.primaryDescription,
            },
            isPrimary: Boolean(interpretation.isPrimary),
            extraInformation: interpretation.extraInformation,
          }
        : undefined
    )
    .filter(isNotUndefined);

  const matchedId =
    data.eventbriteEvent && data.eventbriteEvent.embed_url
      ? /\/e\/([0-9]+)/.exec(data.eventbriteEvent.embed_url)
      : null;
  const eventbriteId =
    data.eventbriteEvent && matchedId !== null ? matchedId[1] : '';

  const audiences: Audience[] = data.audiences
    .map(audience =>
      prismicH.isFilled.link(audience.audience)
        ? {
            id: audience.audience.id,
            title: audience.audience.data?.title
              ? asTitle(audience.audience.data?.title)
              : '',
            description: audience.audience.data?.description,
          }
        : undefined
    )
    .filter(isNotUndefined);

  const bookingEnquiryTeam: Team | undefined = isFilledLinkToDocumentWithData(
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

  const thirdPartyBooking: ThirdPartyBooking | undefined =
    isFilledLinkToWebField(data.thirdPartyBookingUrl)
      ? {
          name: data.thirdPartyBookingName || undefined,
          url: data.thirdPartyBookingUrl.url!,
        }
      : undefined;

  const series = transformSingleLevelGroup(data.series, 'series').map(series =>
    transformEventSeries(series as EventSeriesPrismicDocument)
  );

  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(
    season => transformSeason(season as SeasonPrismicDocument)
  );

  const times: EventTime[] = (data.times || [])
    .map(({ startDateTime, endDateTime, isFullyBooked }) => {
      const range = {
        startDateTime: transformTimestamp(startDateTime),
        endDateTime: transformTimestamp(endDateTime),
      };

      return isNotUndefined(range.startDateTime) &&
        isNotUndefined(range.endDateTime)
        ? {
            range: range as DateTimeRange,
            isFullyBooked,
          }
        : undefined;
    })
    .filter(isNotUndefined);

  const lastEndTime = getLastEndTime(times);
  const isRelaxedPerformance = data.isRelaxedPerformance === 'yes';
  const isOnline = data.isOnline;
  const availableOnline = data.availableOnline;
  const schedule = eventSchedule.map((event, i) => {
    const scheduleItem = data.schedule[i];
    return {
      event,
      isNotLinked: scheduleItem.isNotLinked === 'yes',
    };
  });

  const locations = transformSingleLevelGroup(data.locations, 'location').map(
    location => transformPlace(location as PlacePrismicDocument)
  );

  const contributors = transformContributors(document);
  const format = transformFormat(document);

  const formatLabel = format ? format.title : 'Event';
  const audiencesLabels = audiences.map(a => a.title);
  const interpretationsLabels = interpretations.map(
    i => i.interpretationType.title
  );
  const relaxedPerformanceLabel = isRelaxedPerformance ? ['Relaxed'] : [];

  const labels = [
    formatLabel,
    ...audiencesLabels,
    ...interpretationsLabels,
    ...relaxedPerformanceLabel,
  ].map(text => ({ text }));

  const primaryLabels = [
    formatLabel,
    ...audiencesLabels,
    ...relaxedPerformanceLabel,
  ].map(text => ({ text }));

  const secondaryLabels = [...interpretationsLabels].map(text => ({ text }));

  // We want to display the scheduleLength on EventPromos,
  // but don't want to make an extra API request to populate the schedule for every event in a list.
  // We therefore return the scheduleLength property.
  return {
    type: 'events',
    ...genericFields,
    locations,
    audiences,
    bookingEnquiryTeam,
    thirdPartyBooking,
    bookingInformation:
      data.bookingInformation && data.bookingInformation.length > 1
        ? data.bookingInformation
        : undefined,
    bookingType: transformEventBookingType(document),
    cost: data.cost || undefined,
    format,
    interpretations,
    policies: Array.isArray(data.policies)
      ? transformEventPolicyLabels(data.policies, 'policy')
      : [],
    hasEarlyRegistration: Boolean(data.hasEarlyRegistration),
    series,
    seasons,
    contributors,
    scheduleLength,
    schedule,
    eventbriteId,
    isCompletelySoldOut:
      data.times &&
      data.times.filter((time: EventTime) => !time.isFullyBooked).length === 0,
    ticketSalesStart: transformTimestamp(data.ticketSalesStart),
    times,
    isPast: lastEndTime ? isPast(lastEndTime) : true,
    isRelaxedPerformance,
    isOnline,
    availableOnline,
    labels,
    primaryLabels,
    secondaryLabels,
  };
}

export function transformEventToEventBasic(event: Event): EventBasic {
  // returns what is required to render EventPromos and event JSON-LD
  return (({
    type,
    promo,
    id,
    times,
    image,
    isPast,
    promoImage,
    primaryLabels,
    title,
    isOnline,
    locations,
    availableOnline,
    scheduleLength,
    series,
    secondaryLabels,
    promoText,
    cost,
    contributors,
  }) => ({
    type,
    promo,
    id,
    times,
    image,
    isPast,
    promoImage,
    primaryLabels,
    title,
    isOnline,
    locations,
    availableOnline,
    scheduleLength,
    series,
    secondaryLabels,
    promoText,
    cost,
    contributors,
  }))(event);
}

export const getScheduleIds = (
  eventDocument: EventPrismicDocument
): string[] => {
  return eventDocument.data.schedule
    .map(linkField =>
      prismicH.isFilled.link(linkField.event) ? linkField.event.id : undefined
    )
    .filter(isNotUndefined);
};

function isEvent(event: Event | EventBasic): event is Event {
  return (event as Event).audiences !== undefined;
}

// When events are serialised as JSON then re-parsed, the times will be
// strings instead of JavaScript Date types.
//
// Convert them back to the right types.
export function fixEventDatesInJson(eventJson: Event): Event;
export function fixEventDatesInJson(eventJson: EventBasic): EventBasic;
export function fixEventDatesInJson(
  jsonEvent: Event | EventBasic
): Event | EventBasic {
  const times = jsonEvent.times.map(time => {
    return {
      ...time,
      range: {
        startDateTime: new Date(time.range.startDateTime),
        endDateTime: new Date(time.range.endDateTime),
      },
    };
  });

  if (isEvent(jsonEvent)) {
    const schedule = jsonEvent.schedule?.map(item => ({
      ...item,
      event: fixEventDatesInJson(item.event),
    }));

    return {
      ...jsonEvent,
      times,
      schedule,
    };
  } else {
    return {
      ...jsonEvent,
      times,
    };
  }
}
