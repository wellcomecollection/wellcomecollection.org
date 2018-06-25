// @flow
import type {HTMLString, ImagePromo} from './content-blocks';
import type {BackgroundTexture} from './background-texture';
import type {Contributor} from './contributors';
import type {Image} from './image';
import type {Place} from './place';

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
  description: ?string,
  primaryDescription: ?string
|}

type Interpretation = {|
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

type IdentifierScheme = 'eventbrite-id';

type Identifier = {|
  identifierScheme: IdentifierScheme,
  value: string
|}

export type Audience = {|
  id: string,
  title: string,
  description: ?string
|}

export type Event = {|
  id: string,
  identifiers: Identifier[],
  title: string,
  format: ?EventFormat,
  isDropIn: boolean,
  times: EventTime[],
  description: ?HTMLString,
  series: EventSeries[],
  place: ?Place,
  bookingEnquiryTeam: ?Team,
  contributors: Contributor[],
  promo: ?ImagePromo,
  interpretations: Interpretation[],
  audiences: Audience[],
  bookingInformation: ?HTMLString,
  cost: ?string,
  // TODO:
  // this is programmatic and doesn't come from Prismic and can't be edited directly
  // it's more convenient than having to work it out
  // not sure if it should be in the model, a question for Silver
  bookingType: ?string,
  schedule?: Event[],
  eventbriteId?: string,
  isCompletelySoldOut?: boolean,
  body: any[]
|}

export type EventPromo = {|
  id: string,
  title: ?string,
  url: string,
  start: ?Date,
  end: ?Date,
  isFullyBooked: boolean,
  hasNotFullyBookedTimes: boolean,
  description: ?HTMLString,
  format: ?EventFormat,
  bookingType: ?string,
  image: ?Image,
  interpretations: Interpretation[],
  eventbriteId?: ?string,
  audience?: Audience,
  series: EventSeries[],
  schedule: Event[],
  // These are used for when we have a human written string for the dates.
  // Shouldn't really happen, but we have manually added promos at the moment.
  // Hence the nullable key - easier than implementing schedules for 1 event.
  dateString?: ?string,
  timeString?: ?string
|}
