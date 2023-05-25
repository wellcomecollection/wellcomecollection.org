import {
  GroupField,
  TimestampField,
  PrismicDocument,
  ContentRelationshipField,
  RichTextField,
  SelectField,
  BooleanField,
  EmbedField,
  KeyTextField,
  LinkField,
} from '@prismicio/client';
import { BackgroundTexturesDocument } from './background-textures';
import { PlacePrismicDocument } from './places';
import {
  CommonPrismicFields,
  FetchLinks,
  WithContributors,
  WithEventSeries,
  WithExhibitionParents,
  WithSeasons,
} from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';

const typeEnum = 'events';

export type EventFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'event-formats'
>;
export const eventFormatFetchLinks: FetchLinks<EventFormat> = [
  'event-formats.title',
  'event-formats.description',
];

type InterpretationType = PrismicDocument<
  {
    title: RichTextField;
    abbreviation: RichTextField;
    description: RichTextField;
    primaryDescription: RichTextField;
  },
  'interpretation-types'
>;
export const interpretationTypeFetchLinks: FetchLinks<InterpretationType> = [
  'interpretation-types.title',
  'interpretation-types.abbreviation',
  'interpretation-types.description',
  'interpretation-types.primaryDescription',
];

type Audience = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'audiences'
>;
export const audienceFetchLinks: FetchLinks<Audience> = [
  'audiences.title',
  'audiences.description',
];

export type EventPolicy = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'event-policies'
>;
export const eventPolicyFetchLinks: FetchLinks<EventPolicy> = [
  'event-policies.title',
  'event-policies.description',
];

export type Team = PrismicDocument<
  {
    title: RichTextField;
    subtitle: RichTextField;
    email: KeyTextField;
    phone: KeyTextField;
    url: KeyTextField;
  },
  'teams'
>;
export const teamFetchLinks: FetchLinks<Team> = [
  'teams.title',
  'teams.subtitle',
  'teams.email',
  'teams.phone',
  'teams.url',
];

export type WithEventFormat = {
  format: ContentRelationshipField<
    'event-formats',
    'en-gb',
    InferDataInterface<EventFormat>
  >;
};

export type EventTimePrismicDocument = {
  startDateTime: TimestampField;
  endDateTime: TimestampField;
  isFullyBooked: BooleanField;
  onlineIsFullyBooked: BooleanField;
};

export type EventPrismicDocument = PrismicDocument<
  {
    locations: GroupField<{
      location: ContentRelationshipField<
        'place',
        'en-gb',
        InferDataInterface<PlacePrismicDocument>
      >;
    }>;
    isOnline: BooleanField;
    availableOnline: BooleanField;
    times: GroupField<EventTimePrismicDocument>;
    isRelaxedPerformance: SelectField<'yes'>;
    interpretations: GroupField<{
      interpretationType: ContentRelationshipField<
        'interpretation-types',
        'en-gb',
        InferDataInterface<InterpretationType>
      >;
      isPrimary: SelectField<'yes'>;
      extraInformation: RichTextField;
    }>;
    audiences: GroupField<{
      audience: ContentRelationshipField<
        'audiences',
        'en-gb',
        InferDataInterface<Audience>
      >;
    }>;
    ticketSalesStart: TimestampField;
    bookingEnquiryTeam: ContentRelationshipField<
      'teams',
      'en-gb',
      InferDataInterface<Team>
    >;
    eventbriteEvent: EmbedField;
    thirdPartyBookingName: KeyTextField;
    thirdPartyBookingUrl: LinkField;
    bookingInformation: RichTextField;
    policies: GroupField<{
      policy: ContentRelationshipField<
        'event-policy',
        'en-gb',
        InferDataInterface<EventPolicy>
      >;
    }>;
    hasEarlyRegistration: SelectField<'yes'>;
    cost: KeyTextField;
    schedule: GroupField<{
      event: ContentRelationshipField<
        'events',
        'en-gb',
        // We know this is an EventPrismicDocument, but the type checker gets
        // unhappy about the circular reference:
        //
        //    'event' is referenced directly or indirectly in its own type annotation.
        //
        // TODO: Find a better way to do this which doesn't upset the type checker.
        InferDataInterface<any>
      >;
      isNotLinked: SelectField<'yes'>;
    }>;
    backgroundTexture: ContentRelationshipField<
      'background-textures',
      'en-gb',
      InferDataInterface<BackgroundTexturesDocument>
    >;
    onlineTicketSalesStart: TimestampField;
    onlineBookingEnquiryTeam: ContentRelationshipField<
      'teams',
      'en-gb',
      InferDataInterface<Team>
    >;
    onlineEventbriteEvent: EmbedField;
    onlineThirdPartyBookingName: KeyTextField;
    onlineThirdPartyBookingUrl: LinkField;
    onlineBookingInformation: RichTextField;
    onlinePolicies: GroupField<{
      policy: ContentRelationshipField<
        'event-policy',
        'en-gb',
        InferDataInterface<EventPolicy>
      >;
    }>;
    onlineHasEarlyRegistration: SelectField<'yes'>;
    onlineCost: KeyTextField;
  } & WithContributors &
    WithEventSeries &
    WithExhibitionParents &
    WithEventFormat &
    WithSeasons &
    CommonPrismicFields,
  typeof typeEnum
>;

export const eventsFetchLinks: FetchLinks<EventPrismicDocument> = [
  'events.title',
  'events.audiences',
  'events.schedule',
  'events.interpretations',
  'events.series',
  'events.times',
  'events.locations',
];
