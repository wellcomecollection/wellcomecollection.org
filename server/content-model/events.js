// @flow
import type {HTMLString, ImagePromo} from './content-blocks';
import type {Person} from './people';

export type DateTimeRange = {|
  startDateTime: Date;
  endDateTime: Date;
|}

type ContributorRole = {|
  id: string;
  title: string;
|}

export type Contributor = {|
  role: ContributorRole; // TODO: Should this just be a free text string?
  person: Person;
|}

// e.g. 'BSL interpreted tour' | 'Youth event' | 'Audio described tour' |
// 'Speech-to-text transcribed tour' | 'Workshop' | 'Discussion' | 'Walking tour';
export type EventFormat = {|
  id: string;
  title: string;
  description: string;
|}

export type EventSeries = {|
  id: string;
  title: string;
  description: ?HTMLString;
  contributors: Array<Contributor>;
|}

// E.g. 'British sign language interpreted' | 'Audio described' | 'Speech-to-Text';
type EventAccessOption = {|
  id: string;
  title: string;
  shortName: ?string;
|}

export type EventBookingEnquiryTeam = {|
  id: string;
  title: string;
  email: string;
  phone: string;
  url: string;
|}

type Geolocation = {|
  latitude: number;
  longitude: number;
|}

export type EventLocation = {|
  id: string;
  title: string;
  geolocation: ?Geolocation;
  level: number;
  capacity: ?number;
|}

type IdentifierScheme = 'eventbrite-id';

type Identifier = {|
  identifierScheme: IdentifierScheme;
  value: string;
|}

export type Event = {|
  id: string;
  identifiers: Array<Identifier>;
  title: ?string;
  format: ?EventFormat;
  isDropIn: boolean,
  times: Array<DateTimeRange>;
  description: ?HTMLString;
  accessOptions: Array<EventAccessOption>;
  series: Array<EventSeries>;
  location: ?EventLocation;
  bookingEnquiryTeam: ?EventBookingEnquiryTeam;
  contributors: Array<Contributor>;
  promo: ?ImagePromo;
|}

// TODO: this will need more as the promo gets fleshed out
export type EventPromo = {|
  id: string;
  title: ?string;
  start: DateTimeRange;
  end: DateTimeRange;
  description: ?HTMLString;
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
    title: 'Dance Workshop',
    description: 'This event will make you dance till you drop.'
  },
  isDropIn: true,
  times: [
    {
      startDateTime: new Date('2017-12-01T19:45:00+0000'),
      endDateTime: new Date('2017-12-01T20:25:00+0000')
    },
    {
      startDateTime: new Date('2017-12-01T20:45:00+0000'),
      endDateTime: new Date('2017-12-01T21:00:00+0000')
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
  accessOptions: [
    {
      id: 'WcLABisAACx_BDQV',
      title: 'British sign language interpreted',
      shortName: 'BSL Tour'
    }
  ],
  series: [
    {
      id: 'WfyK-yoAANuggY31',
      title: 'Your reality is Broken',
      description: 'Perception is fundamental to who we are and ' +
        'how we experience life. But how much can ' +
        'we actually trust our senses? A scientific, ' +
        'philosophical and creative approach to this ' +
        'question will invite you on a journey into your ' +
        'inner and outer experiences of the world.',
      contributors: []
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
        'something new on a Friday night.',
      contributors: []
    }
  ],
  location: {
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
  }
}: Event);
