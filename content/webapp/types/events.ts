import { Contributor } from './contributors';
import { GenericContentFields } from './generic-content-fields';
import { Format } from './format';
import { LabelField } from '@weco/content/model/label-field';
import { Place, PlaceBasic } from './places';
import { Season } from './seasons';
import { Label } from '@weco/common/model/labels';
import { ImagePromo } from './image-promo';
import * as prismic from '@prismicio/client';
import { EventSeriesBasic } from './event-series';
import { ImageType } from '@weco/common/model/image';

export type DateTimeRange = {
  startDateTime: Date;
  endDateTime: Date;
};

export type IsFullyBooked = {
  inVenue: boolean;
  online: boolean;
};

export type EventTime = {
  range: DateTimeRange;
  isFullyBooked: IsFullyBooked;
};

// E.g. 'British sign language interpreted' | 'Audio described' | 'Speech-to-Text';
export type InterpretationType = {
  id: string;
  title: string;
  description?: prismic.RichTextField;
  primaryDescription?: prismic.RichTextField;
};

export type Interpretation = {
  interpretationType: InterpretationType;
  isPrimary: boolean;
  extraInformation?: prismic.RichTextField;
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
  description?: prismic.RichTextField;
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

export type HasTimeRanges = {
  times: { range: DateTimeRange }[];
};

export type HasTimes = {
  times: EventTime[];
};

export type EventBasic = HasTimes & {
  // this is a mix of props from GenericContentFields and Event
  // and is only what is required to render EventPromos and json-ld
  type: 'events';
  id: string;
  title: string;
  promo?: ImagePromo | undefined;
  image?: ImageType;
  isPast: boolean;
  labels: Label[];
  primaryLabels: Label[];
  secondaryLabels: Label[];
  isOnline: boolean;
  locations: PlaceBasic[];
  availableOnline: boolean;
  series: EventSeriesBasic[];
  cost?: string;
};

export type Event = GenericContentFields & {
  type: 'events';
  format?: Format;
  hasEarlyRegistration: boolean;
  ticketSalesStart?: Date;
  times: EventTime[];
  series: EventSeriesBasic[];
  seasons: Season[];
  locations: Place[];
  bookingEnquiryTeam?: Team;
  interpretations: Interpretation[];
  audiences: Audience[];
  policies: LabelField[];
  bookingInformation?: prismic.RichTextField;
  cost?: string;
  bookingType?: string;
  thirdPartyBooking?: ThirdPartyBooking;
  schedule?: EventSchedule;
  eventbriteId?: string;
  isCompletelySoldOut?: boolean;
  onlineSoldOut?: boolean;
  inVenueSoldOut?: boolean;
  isPast: boolean;
  isRelaxedPerformance: boolean;
  isOnline: boolean;
  availableOnline: boolean;
  primaryLabels: Label[];
  secondaryLabels: Label[];
  contributors: Contributor[];
  onlineTicketSalesStart?: Date;
  onlineBookingEnquiryTeam?: Team;
  onlineEventbriteId?: string;
  onlineThirdPartyBooking?: ThirdPartyBooking;
  onlineBookingInformation?: prismic.RichTextField;
  onlinePolicies: LabelField[];
  onlineHasEarlyRegistration: boolean;
  onlineCost?: string;
};
