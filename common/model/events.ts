import { isDatePast } from '../utils/format-date';
import { GenericContentFields } from './generic-content-fields';
import { Format } from './format';
import { BackgroundTexture } from './background-texture';
import { ImageType } from './image';
import { LabelField } from './label-field';
import { Place } from './places';
import { HTMLString } from '../services/prismic/types';

type DateTimeRange = {
  startDateTime: Date;
  endDateTime: Date;
};

export type EventTime = {
  range: DateTimeRange;
  isFullyBooked: boolean;
};

export type EventSeries = {
  id: string;
  title: string;
  description?: string;
};

export type UiEventSeries = EventSeries & {
  backgroundTexture?: BackgroundTexture;
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

// TODO instead of having displayStart and displayEnd on model, create helper functions that return the new data structure
export type UiEvent = Event & {
  type: 'events';
  displayStart: Date;
  displayEnd: Date;
  dateRange: {
    firstDate: Date;
    lastDate: Date;
    repeats: number;
  };
  backgroundTexture?: string;
};

export type EventSchedule = {
  event: UiEvent;
  isNotLinked: boolean;
}[];

export type Event = GenericContentFields & {
  format?: Format;
  hasEarlyRegistration: boolean;
  ticketSalesStart?: Date;
  times: EventTime[];
  series: EventSeries[];
  place?: Place;
  bookingEnquiryTeam?: Team;
  interpretations: Interpretation[];
  audiences: Audience[];
  policies: LabelField[];
  bookingInformation?: HTMLString;
  cost?: string;
  bookingType?: string;
  thirdPartyBooking?: {
    name?: string;
    url: string;
  };
  scheduleLength: number;
  schedule?: EventSchedule;
  eventbriteId?: string;
  isCompletelySoldOut?: boolean;
  isPast: boolean;
  isRelaxedPerformance: boolean;
};

export type EventPromo = {
  type?: string;
  id: string;
  title?: string;
  url: string;
  start?: Date;
  end?: Date;
  isMultiDate: boolean;
  isFullyBooked: boolean;
  hasNotFullyBookedTimes: boolean;
  description?: string;
  format?: Format;
  bookingType?: string;
  image?: ImageType;
  interpretations: Interpretation[];
  eventbriteId?: string;
  audience?: Audience;
  series: EventSeries[];
  schedule: Event[];
  dateString?: string;
  timeString?: string;
};

export function isEventFullyBooked(event: UiEvent): boolean {
  return (
    event.times.length > 0 &&
    event.times.every(({ isFullyBooked, range }) => {
      return isDatePast(range.endDateTime) || isFullyBooked;
    })
  );
}
