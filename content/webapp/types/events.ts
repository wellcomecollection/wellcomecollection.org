import { Contributor } from './contributors';
import { GenericContentFields } from './generic-content-fields';
import { Format } from './format';
import { LabelField } from '@weco/common/model/label-field';
import { Place } from './places';
import { Season } from './seasons';
import { Label } from '@weco/common/model/labels';
import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import * as prismicT from '@prismicio/types';
import { isDayPast } from '@weco/common/utils/dates';

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
export type InterpretationType = {
  id: string;
  title: string;
  description?: prismicT.RichTextField;
  primaryDescription?: prismicT.RichTextField;
};

export type Interpretation = {
  interpretationType: InterpretationType;
  isPrimary: boolean;
  extraInformation?: prismicT.RichTextField;
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
  description?: prismicT.RichTextField;
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

export type EventBasic = {
  // this is a mix of props from GenericContentFields and Event
  // and is only what is required to render EventPromos and json-ld
  type: 'events';
  id: string;
  title: string;
  promo?: ImagePromo | undefined;
  times: EventTime[];
  isPast: boolean;
  primaryLabels: Label[];
  secondaryLabels: Label[];
  image?: ImageType;
  isOnline: boolean;
  locations: Place[];
  availableOnline: boolean;
  scheduleLength: number;
  series: EventSeries[];
  cost?: string;
  contributors: Contributor[];
};

export type Event = GenericContentFields & {
  type: 'events';
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
  bookingInformation?: prismicT.RichTextField;
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

export function isEventFullyBooked(event: Event | EventBasic): boolean {
  return (
    event.times.length > 0 &&
    event.times.every(({ isFullyBooked, range }) => {
      return isDayPast(range.endDateTime) || isFullyBooked;
    })
  );
}
