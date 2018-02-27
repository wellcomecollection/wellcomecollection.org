// @flow
import type {HTMLString, ImagePromo} from './content-blocks';
import type {Person} from './people';
import type {Picture} from '../model/picture';

type DateTimeRange = {|
  startDateTime: Date,
  endDateTime: Date
|}

export type EventTime = {|
  range: DateTimeRange,
  isFullyBooked: boolean
|}

type ContributorRole = {|
  id: string,
  title: string
|}

export type Contributor = {|
  role: ContributorRole,
  person: Person
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

type Geolocation = {|
  latitude: number,
  longitude: number
|}

export type Place = {|
  id: string,
  title: string,
  geolocation: ?Geolocation,
  level: number,
  capacity: ?number
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
  identifiers: Array<Identifier>,
  title: ?string,
  format: ?EventFormat,
  isDropIn: boolean,
  times: Array<EventTime>,
  description: ?HTMLString,
  series: Array<EventSeries>,
  place: ?Place,
  bookingEnquiryTeam: ?Team,
  contributors: Array<Contributor>,
  promo: ?ImagePromo,
  interpretations: Array<Interpretation>,
  audiences: Array<Audience>,
  bookingInformation: ?HTMLString,
  cost: string,
  // TODO:
  // this is programmatic and doesn't come from Prismic and can't be edited directly
  // it's more convenient that having to work it out.
  // not sure if it should be in the model, a question for Silver
  bookingType: ?string
|}

export type EventPromo = {|
  id: string,
  title: ?string,
  url: string,
  start: ?DateTimeRange,
  end: ?DateTimeRange,
  isFullyBooked: boolean,
  description: ?HTMLString,
  format: ?EventFormat,
  bookingType: ?string,
  image: ?Picture,
  interpretations: Array<Interpretation>,
  eventbriteId?: ?string,
  // These are used for when we have a human written string for the dates.
  // Shouldn't really happen, but we have manually added promos at the moment.
  // Hence the nullable key - easier than implementing schedules for 1 event.
  dateString?: ?string,
  timeString?: ?string
|}

export const eventExample = ({
  id: 'WXmdTioAAJWWjZdH',
  identifiers: [{
    identifierScheme: 'eventbrite-id',
    value: '40144900478'
  }],
  title: 'Haitian Vodou Ritual',
  format: {
    id: 'QYCcAACcAoiJS',
    title: 'British sign language tour',
    shortName: 'BSL Tour',
    description: 'This tour is designed for British Sign Language users.\n' +
      'For more information please email us at\n' +
      '<a href="mailto:access@wellcomecollection.org">access@wellcomecollection.org</a>\n' +
      'or call 020 7611 222'
  },
  isDropIn: true,
  times: [
    {
      isFullyBooked: false,
      range: {
        startDateTime: new Date('2017-12-01T19:45:00+0000'),
        endDateTime: new Date('2017-12-01T20:25:00+0000')
      }
    },
    {
      isFullyBooked: false,
      range: {
        startDateTime: new Date('2017-12-01T20:45:00+0000'),
        endDateTime: new Date('2017-12-01T21:00:00+0000')
      }
    }
  ],
  description: 'A rare chance to experience ' +
    'this beautiful, ecstatic, intense ' +
    'Caribbean dance form. Join ' +
    'Vodou dance teacher and ' +
    'practitioner ' +
    '<a href="https://wellcomecollection.org/people/WhvmIykAACgAlDHh">Zsuzsa Parrag</a> ' +
    'to learn some of the basic ritual ' +
    'steps that can create feelings of ' +
    'altered states of perception. With ' +
    'live drumming by ' +
    '<a href="https://wellcomecollection.org/people/WhvmIykAACgAlDHh">Randy Lester</a>' +
    '.',
  interpretations: [{
    isPrimary: true,
    interpretationType: {
      id: 'WcLABisAACx_BDQV',
      title: 'British sign language interpreted',
      description: 'This event is BSL sign language interpreted',
      primaryDescription: 'This event is designed BSL speakers'
    }
  }],
  audiences: [{
    id: 'WfyK-yoAANudfrY31',
    title: 'Researchers',
    description: null
  }],
  series: [
    {
      id: 'WfyK-yoAANuggY31',
      title: 'Your reality is Broken',
      description: 'Perception is fundamental to who we are and ' +
        'how we experience life. But how much can ' +
        'we actually trust our senses? A scientific, ' +
        'philosophical and creative approach to this ' +
        'question will invite you on a journey into your ' +
        'inner and outer experiences of the world.'
    },
    {
      id: 'WcPx8ygAAH4Q9WgN',
      title: 'Friday night spectacular',
      description: 'Focusing on a theme or topic, we fill ' +
        'the building with artists, scientists, performers, ' +
        'writers, speakers and enthusiasts, and invite you to ' +
        'delve into a subject in all its many aspects. With ' +
        'the bar and restaurant open all night, it’s a great ' +
        'place for meeting with friends, looking at your favourite ' +
        'ideas in spectrum of different ways, or just learning ' +
        'something new on a Friday night.'
    }
  ],
  place: {
    id: 'WdTMsycAAL20UYr1',
    title: 'Williams Lounge',
    level: -1,
    geolocation: {
      latitude: 51.52585053479689,
      longitude: -0.13394683599472046
    },
    capacity: 150
  },
  bookingEnquiryTeam: {
    id: 'WcK-SisAAC1_BCxg',
    title: 'Access events',
    email: 'access@wellcomecollection.org',
    phone: '020 7611 2222',
    url: 'https://wellcomecollection.org/visit-us/accessibility'
  },
  contributors: [
    {
      role: {
        id: 'WfGj3SoAAK9XUZ6W',
        title: 'Organiser'
      },
      person: {
        id: 'WdOiZScAAF6cTGe2',
        name: 'Zsuzsa Parrag',
        image: null,
        description: null,
        twitterHandle: null
      }
    },
    {
      role: {
        id: 'WdTMsycAAL20UYr1',
        title: 'Performer'
      },
      person: {
        id: 'WgnIhCEAAKVbzrI7',
        name: 'Randy Lester',
        image: null,
        description: null,
        twitterHandle: null
      }
    }
  ],
  promo: {
    caption: 'This event will blow you to smithereens',
    image: {
      type: 'picture',
      contentUrl: 'https://picture.com/picture.jpg',
      width: 100,
      height: 100
    }
  },
  bookingInformation: '<p>Group size of 15-30 students, accompanied by staff at a ratio of 1:10. Each date is available for booking by one school group. Bookings must be made by a lead teacher.</p>',
  bookingType: 'Drop in',
  cost: '20'
}: Event);
