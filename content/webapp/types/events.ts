import { Contributor } from './contributors';
import { isDatePast } from '@weco/common/utils/format-date';
import { GenericContentFields } from './generic-content-fields';
import { Format } from './format';
import { LabelField } from '@weco/common/model/label-field';
import { Place } from './places';
import { Season } from './seasons';
import { Label } from '@weco/common/model/labels';
import { HTMLString } from '@weco/common/services/prismic/types';

export type DateTimeRange = {
  startDateTime: Date;
  endDateTime: Date;
};

export type EventTime = {
  range: DateTimeRange;
  isFullyBooked: boolean;
};

type EventSeries = {
  id: string;
  title: string;
  description?: string;
};

// E.g. 'British sign language interpreted' | 'Audio described' | 'Speech-to-Text';
type InterpretationType = {
  id: string;
  title: string;
  description?: HTMLString;
  primaryDescription?: HTMLString;
};

export type Interpretation = {
  interpretationType: InterpretationType;
  isPrimary: boolean;
  extraInformation?: HTMLString;
};

export type Team = {
  id: string;
  title: string;
  email: string;
  phone: string;
  url: string;
};

export type Audience = {
  id: string;
  title: string;
  description?: HTMLString;
};

export type DateRange = {
  firstDate: Date;
  lastDate: Date;
  repeats: number;
};

export type EventSchedule = {
  event: Event;
  isNotLinked: boolean;
}[];

export type ThirdPartyBooking = {
  name?: string;
  url: string;
};

export type Event = GenericContentFields & {
  type: 'events',
  format?: Format;
  hasEarlyRegistration: boolean;
  ticketSalesStart?: Date;
  times: EventTime[];
  series: EventSeries[];
  seasons: Season[];
  locations: Place[];
  bookingEnquiryTeam?: Team;
  interpretations: Interpretation[];
  audiences: Audience[];
  policies: LabelField[];
  bookingInformation?: HTMLString;
  cost?: string;
  bookingType?: string;
  thirdPartyBooking?: ThirdPartyBooking;
  scheduleLength: number;
  schedule?: EventSchedule;
  eventbriteId?: string;
  isCompletelySoldOut?: boolean;
  isPast: boolean;
  isRelaxedPerformance: boolean;
  isOnline: boolean;
  availableOnline: boolean;
  primaryLabels: Label[];
  secondaryLabels: Label[];
  contributors: Contributor[];
};

export function isEventFullyBooked(event: Event): boolean {
  return (
    event.times.length > 0 &&
    event.times.every(({ isFullyBooked, range }) => {
      return isDatePast(range.endDateTime) || isFullyBooked;
    })
  );
}
