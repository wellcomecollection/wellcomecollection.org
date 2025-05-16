import * as prismic from '@prismicio/client';

import {
  EventPoliciesDocument as RawEventPoliciesDocument,
  EventsDocument as RawEventsDocument,
  EventsDocumentData as RawEventsDocumentData,
  EventSeriesDocument as RawEventSeriesDocument,
  PlacesDocument as RawPlacesDocument,
  SeasonsDocument as RawSeasonsDocument,
  TeamsDocument as RawTeamsDocument,
} from '@weco/common/prismicio-types';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import {
  InferDataInterface,
  isFilledLinkToDocumentWithData,
  isFilledLinkToWebField,
} from '@weco/common/services/prismic/types';
import {
  getDatesBetween,
  isPast,
  isSameDay,
  maxDate,
  minDate,
} from '@weco/common/utils/dates';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { LabelField } from '@weco/content/model/label-field';
import { ContentApiTimeField } from '@weco/content/services/wellcome/content/types/api';
import {
  Audience,
  DateTimeRange,
  Event,
  EventBasic,
  EventTime,
  Interpretation,
  Team,
  ThirdPartyBooking,
} from '@weco/content/types/events';
import isEmptyObj from '@weco/content/utils/is-empty-object';

import {
  asText,
  asTitle,
  transformFormat,
  transformGenericFields,
  transformLabelType,
  transformSingleLevelGroup,
} from '.';
import { transformContributors } from './contributors';
import { transformVideoEmbed } from './embeds';
import {
  transformEventSeries,
  transformEventSeriesToEventSeriesBasic,
} from './event-series';
import { noAltTextBecausePromo } from './images';
import { transformPlace } from './places';
import { transformSeason } from './seasons';

function transformEventBookingType(
  eventDoc: RawEventsDocument
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
    ? maxDate(times.map(({ range: { endDateTime } }) => endDateTime))
    : undefined;
}

export function transformEventPolicyLabels(
  fragment: prismic.GroupField<{
    policy: prismic.ContentRelationshipField<
      'event-policy',
      'en-gb',
      InferDataInterface<RawEventPoliciesDocument>
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

export function getEventbriteId(url: string): string | undefined {
  const match = /\/e\/(.+)/.exec(url);
  const fullId = match?.[1];

  // Replace other parameters with ours, or just make sure ours is added
  if (fullId) {
    const hasExistingParams = fullId.indexOf('?') > 0;

    return `${
      hasExistingParams ? fullId.slice(0, fullId.indexOf('?')) : fullId
    }?aff=WCWebsitelink`;
  }
}

function transformBookingEnquiryTeam(
  team: prismic.ContentRelationshipField<
    'teams',
    'en-gb',
    InferDataInterface<RawTeamsDocument>
  >
): Team | undefined {
  return isFilledLinkToDocumentWithData(team)
    ? {
        id: team.id,
        title: asText(team.data?.title) || '',
        email: team.data!.email!,
        phone: team.data!.phone!,
        url: team.data!.url!,
      }
    : undefined;
}

function transformThirdPartyBooking(
  thirdPartyUrl: prismic.LinkField,
  thirdPartyName: prismic.KeyTextField
): ThirdPartyBooking | undefined {
  return isFilledLinkToWebField(thirdPartyUrl)
    ? {
        name: thirdPartyName || undefined,
        url: thirdPartyUrl.url,
      }
    : undefined;
}

export function transformEventTimes(
  id: string,
  times: RawEventsDocumentData['times'] | ContentApiTimeField[]
): EventTime[] {
  return times
    .map(
      ({ startDateTime, endDateTime, isFullyBooked, onlineIsFullyBooked }) => {
        const range = {
          startDateTime: transformTimestamp(startDateTime),
          endDateTime: transformTimestamp(endDateTime),
        };

        if (
          range.startDateTime &&
          range.endDateTime &&
          range.startDateTime > range.endDateTime
        ) {
          console.warn(
            `Start time for event ${id} is after the end time; this is probably a bug in Prismic`
          );
        }

        return isNotUndefined(range.startDateTime) &&
          isNotUndefined(range.endDateTime)
          ? {
              range: range as DateTimeRange,
              isFullyBooked:
                // isFullyBooked in the Content API is an object containing inVenue and online
                // Therefore this accounts either Content API ("yes"|null) or Prismic provenance.
                // "null" being an object we need to guard against that too.
                isFullyBooked !== null && typeof isFullyBooked === 'object'
                  ? { ...isFullyBooked }
                  : {
                      inVenue: isFullyBooked,
                      online: onlineIsFullyBooked,
                    },
            }
          : undefined;
      }
    )
    .filter(isNotUndefined);
}

export function transformEvent(
  document: RawEventsDocument,
  scheduleQuery?: prismic.Query<RawEventsDocument>
): Event {
  const data = document.data;
  const genericFields = transformGenericFields(document);

  const bslLeafletVideo =
    data.bslLeafletVideo && transformVideoEmbed(data.bslLeafletVideo);

  const eventSchedule =
    scheduleQuery && scheduleQuery.results
      ? scheduleQuery.results.map(doc => transformEvent(doc))
      : [];
  const interpretations: Interpretation[] = data.interpretations
    .map(interpretation =>
      prismic.isFilled.link(interpretation.interpretationType)
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

  const eventbriteId = data.eventbriteEvent?.embed_url
    ? getEventbriteId(data.eventbriteEvent.embed_url)
    : undefined;

  const audiences: Audience[] = data.audiences
    .map(audience =>
      prismic.isFilled.link(audience.audience)
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

  const bookingEnquiryTeam = transformBookingEnquiryTeam(
    data.bookingEnquiryTeam
  );

  const thirdPartyBooking = transformThirdPartyBooking(
    data.thirdPartyBookingUrl,
    data.thirdPartyBookingName
  );
  const series = transformSingleLevelGroup(data.series, 'series')
    .map(series => transformEventSeries(series as RawEventSeriesDocument))
    .map(transformEventSeriesToEventSeriesBasic);

  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(
    season => transformSeason(season as RawSeasonsDocument)
  );

  const times: EventTime[] = transformEventTimes(document.id, data.times || []);

  const lastEndTime = getLastEndTime(times);
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
    location => transformPlace(location as RawPlacesDocument)
  );

  const contributors = transformContributors(document);
  const format = transformFormat(document);

  const formatLabel = format ? format.title : 'Event';
  const audiencesLabels = audiences.map(a => a.title);
  const interpretationsLabels = interpretations.map(
    i => i.interpretationType.title
  );

  const labels = [
    formatLabel,
    ...audiencesLabels,
    ...interpretationsLabels,
  ].map(text => ({ text }));

  const primaryLabels = [formatLabel, ...audiencesLabels].map(text => ({
    text,
  }));

  const secondaryLabels = [...interpretationsLabels].map(text => ({ text }));

  const onlineBookingEnquiryTeam = transformBookingEnquiryTeam(
    data.onlineBookingEnquiryTeam
  );

  const onlineEventbriteId = data.onlineEventbriteEvent?.embed_url
    ? getEventbriteId(data.onlineEventbriteEvent.embed_url)
    : undefined;

  const onlineThirdPartyBooking = transformThirdPartyBooking(
    data.onlineThirdPartyBookingUrl,
    data.onlineThirdPartyBookingName
  );

  const hasInVenueBooking =
    eventbriteId || thirdPartyBooking || bookingEnquiryTeam;
  const hasOnlineBooking =
    onlineEventbriteId || onlineThirdPartyBooking || onlineBookingEnquiryTeam;

  return {
    type: 'events',
    uid: document.uid,
    ...genericFields,
    locations,
    audiences,
    bookingEnquiryTeam,
    bslLeafletVideo,
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
    hasEarlyRegistration: data.hasEarlyRegistration === 'yes',
    series,
    seasons,
    contributors,
    schedule,
    eventbriteId,
    isCompletelySoldOut:
      times.filter((time: EventTime) => {
        const onlyInVenueAndItsFullyBooked =
          !hasOnlineBooking && hasInVenueBooking && time.isFullyBooked.inVenue;
        const onlyOnlineAndItsFullyBooked =
          !hasInVenueBooking && hasOnlineBooking && time.isFullyBooked.online;
        const bothInVenueAndOnlineAndFullyBooked =
          hasInVenueBooking &&
          time.isFullyBooked.inVenue &&
          hasOnlineBooking &&
          time.isFullyBooked.online;
        return !(
          onlyInVenueAndItsFullyBooked ||
          onlyOnlineAndItsFullyBooked ||
          bothInVenueAndOnlineAndFullyBooked
        );
      }).length === 0,
    onlineSoldOut:
      times.filter((time: EventTime) => {
        return !time.isFullyBooked.online;
      }).length === 0,
    inVenueSoldOut:
      times.filter((time: EventTime) => {
        return !time.isFullyBooked.inVenue;
      }).length === 0,
    ticketSalesStart: transformTimestamp(data.ticketSalesStart),
    times,
    isPast: lastEndTime ? isPast(lastEndTime) : true,
    isOnline,
    availableOnline,
    labels,
    primaryLabels,
    secondaryLabels,
    onlineTicketSalesStart: transformTimestamp(data.ticketSalesStart),
    onlineBookingEnquiryTeam,
    onlineEventbriteId,
    onlineThirdPartyBooking,
    onlineBookingInformation:
      data.onlineBookingInformation?.length > 1
        ? data.onlineBookingInformation
        : undefined,
    onlinePolicies: Array.isArray(data.onlinePolicies)
      ? transformEventPolicyLabels(data.onlinePolicies, 'policy')
      : [],
    onlineHasEarlyRegistration: Boolean(data.hasEarlyRegistration),
    onlineCost: data.onlineCost || undefined,
  };
}

/** Get the event times for an EventBasic.
 *
 * This may be different to the times for the Event, because we use this field
 * to manage how cards appear.
 */
export function transformEventBasicTimes(
  summaryTimes: EventTime[],
  document: RawEventsDocument
): EventTime[] {
  // When the content team want to represent an event that repeats on multiple days
  // (e.g. the Lights Up events that accompanied In Plain Sight), they create
  // one parent event with all the event information, then individual events which
  // are linked to it in the schedule field.  The `times` field on the parent event
  // is a summary of the series.
  //
  // These individual events contain ticket booking information, details of times,
  // and so on.
  //
  //                               +---> Event @ 1 January
  //      parent event             |
  //      times = 1 Jan – 3 Mar ---+---> Event @ 2 February
  //                               |
  //                               +---> Event @ 3 March
  //
  // In this case, we want the event cards on the What's On page to show the dates
  // of the individual events.
  //
  // But they also use this approach for festival-like events, where there are multiple
  // events happening over the same weekend (e.g. A Moon with a View).
  //
  //                               +---> Saturday event @ 12 – 2
  //      parent event             |
  //      times = Sat – Sun     ---+---> Saturday event @ 2 – 4
  //                               |
  //                               +---> Sunday event @ 3 – 5
  //
  // In this case, we want the event cards on the What's On page to show the summary.
  //
  // So we use the following rules:
  //
  //    1.  If an event has no schedule, the card uses the 'times' on the event
  //    2.  If an event has a schedule, but the schedule items are all on a continuous block
  //        of days (e.g. Fri/Sat/Sun), the card uses the summary 'times' on the event
  //    3.  If an event has a schedule and the schedule items are scattered around,
  //        the cards use the individual item times.
  //
  // These rules are likely incomplete, but they're directionally correct and fix a
  // timely issue with the "Lights Up" event that spans multiple months.
  //
  const scheduleTimes = document.data.schedule.flatMap(s =>
    isFilledLinkToDocumentWithData(s.event)
      ? transformEventTimes(s.event.id, s.event.data.times || [])
      : []
  );

  // Case 1: if the event has no schedule, use the 'times' on the event
  if (scheduleTimes.length === 0) {
    return summaryTimes;
  }

  // Now work out the span of the scheduled items.
  //
  // e.g. if the schedule is
  //
  //      item1 = { start: Sat @ 2pm, end: Sat @ 4pm }
  //      item2 = { start: Sat @ 4pm, end: Sat @ 6pm }
  //      item3 = { start: Sun @ 3pm, end: Sun @ 5pm }
  //
  // then `scheduleStart` is Sat @ 2pm and `scheduleEnd` is Sun @ 5pm.
  const scheduleStart = minDate(scheduleTimes.map(s => s.range.startDateTime));
  const scheduleEnd = maxDate(scheduleTimes.map(s => s.range.endDateTime));

  // Then we work out how many days there are between the beginning and
  // end of the schedule, and we check if something happens every day.
  //
  // This tells us if the scheduled items are a continuous block.
  const daysInScheduleRange = getDatesBetween({
    startDate: scheduleStart,
    endDate: scheduleEnd,
  });

  const everyDayHasSomething = daysInScheduleRange.every(d =>
    scheduleTimes.some(
      s =>
        isSameDay(d, s.range.startDateTime) || isSameDay(d, s.range.endDateTime)
    )
  );

  return everyDayHasSomething ? summaryTimes : scheduleTimes;
}

/** Create a basic version of events suitable for JSON-LD and promos.
 *
 * Note: unlike our other types, this transforms the Prismic document directly,
 * because EventBasic isn't a strict subset of Event.
 */
export function transformEventBasic(document: RawEventsDocument): EventBasic {
  const event = transformEvent(document);

  const {
    type,
    promo,
    image,
    id,
    uid,
    times,
    isPast,
    labels,
    primaryLabels,
    secondaryLabels,
    title,
    isOnline,
    locations,
    availableOnline,
    series,
    cost,
  } = event;

  return {
    type,
    promo: promo && {
      ...promo,
      image: promo.image && {
        ...promo.image,
        ...noAltTextBecausePromo,
        tasl: undefined,
      },
    },
    image,
    id,
    uid,
    times: transformEventBasicTimes(times, document),
    isPast,
    labels,
    primaryLabels,
    secondaryLabels,
    title,
    isOnline,
    locations: locations.map(({ title }) => ({ title })),
    availableOnline,
    series,
    cost,
  };
}

export const getScheduleIds = (eventDocument: RawEventsDocument): string[] => {
  return eventDocument.data.schedule
    .map(linkField =>
      prismic.isFilled.link(linkField.event) ? linkField.event.id : undefined
    )
    .filter(isNotUndefined);
};
