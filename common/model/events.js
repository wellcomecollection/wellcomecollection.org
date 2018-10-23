// @flow
import {isDatePast} from '../utils/format-date';
import type {GenericContentFields} from './generic-content-fields';
import type {HTMLString} from './content-blocks';
import type {BackgroundTexture} from './background-texture';
import type {ImageType} from './image';
import type {LabelField} from './label-field';
import type {Place} from './places';
import type {HTMLString as PrismicHTMLString} from '../services/prismic/types';

type DateTimeRange = {|
  startDateTime: Date,
  endDateTime: Date
|}

export type EventTime = {|
  range: DateTimeRange,
  isFullyBooked: boolean
|}

// e.g. 'Tour' | 'Youth event' | 'Workshop' | 'Discussion' | 'Walking tour';
export type EventFormat = {|
  id: string,
  title: string,
  shortName: ?string,
  description: ?string
|}

export type EventSeries = {|
  id: string,
  title: string,
  description: ?HTMLString
|}

export type UiEventSeries = {|
  ...EventSeries,
  backgroundTexture: ?BackgroundTexture
|}

// E.g. 'British sign language interpreted' | 'Audio described' | 'Speech-to-Text';
type InterpretationType = {|
  id: string,
  title: string,
  description: ?PrismicHTMLString,
  primaryDescription: ?PrismicHTMLString
|}

export type Interpretation = {|
  interpretationType: InterpretationType,
  isPrimary: boolean
|}

export type Team = {|
  id: string,
  title: string,
  email: string,
  phone: string,
  url: string
|}

export type Audience = {|
  id: string,
  title: string,
  description: ?string
|}

/* eslint-disable no-use-before-define */
// TODO instead of having displayStart and displayEnd on model, create helper functions that return the new data structure
export type UiEvent = {|
  ...Event,
  type: 'events',
  displayStart: Date,
  displayEnd: Date,
  dateRange: {
    firstDate: Date,
    lastDate: Date,
    repeats: number
  },
  backgroundTexture?: string
|}

export type EventSchedule = {|
  event: UiEvent,
  isNotLinked: boolean
|}[]

export type Event = {|
  ...GenericContentFields,
  format: ?EventFormat,
  hasEarlyRegistration: boolean,
  ticketSalesStart: ?Date,
  times: EventTime[],
  series: EventSeries[],
  place: ?Place,
  bookingEnquiryTeam: ?Team,
  interpretations: Interpretation[],
  audiences: Audience[],
  policies: LabelField[],
  bookingInformation: ?PrismicHTMLString,
  cost: ?string,
  // TODO:
  // this is programmatic and doesn't come from Prismic and can't be edited directly
  // it's more convenient than having to work it out
  // not sure if it should be in the model, a question for Silver
  bookingType: ?string,
  schedule?: EventSchedule,
  eventbriteId?: string,
  isCompletelySoldOut?: boolean,

  // This is for convenience, but we use it so often, it seems worth while
  isPast: boolean,
  isRelaxedPerformance: boolean
|}
/* eslint-enable no-use-before-define */

export type EventPromo = {|
  type?: ?string,
  id: string,
  title: ?string,
  url: string,
  start: ?Date,
  end: ?Date,
  isMultiDate: boolean,
  isFullyBooked: boolean,
  hasNotFullyBookedTimes: boolean,
  description: ?HTMLString,
  format: ?EventFormat,
  bookingType: ?string,
  image: ?ImageType,
  interpretations: Interpretation[],
  eventbriteId?: ?string,
  audience?: ?Audience,
  series: EventSeries[],
  schedule: Event[],
  // These are used for when we have a human written string for the dates.
  // Shouldn't really happen, but we have manually added promos at the moment.
  // Hence the nullable key - easier than implementing schedules for 1 event.
  dateString?: ?string,
  timeString?: ?string
|}

export function isEventFullyBooked(event: UiEvent): boolean {
  return event.times.length > 0 && event.times
    .every(({isFullyBooked, range}) => {
      return isDatePast(range.endDateTime) || isFullyBooked;
    });
}
