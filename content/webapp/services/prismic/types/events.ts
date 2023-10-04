import * as prismic from '@prismicio/client';
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

export type EventFormat = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    description: prismic.RichTextField;
  },
  'event-formats'
>;
export const eventFormatFetchLinks: FetchLinks<EventFormat> = [
  'event-formats.title',
  'event-formats.description',
];

type InterpretationType = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    abbreviation: prismic.RichTextField;
    description: prismic.RichTextField;
    primaryDescription: prismic.RichTextField;
  },
  'interpretation-types'
>;
export const interpretationTypeFetchLinks: FetchLinks<InterpretationType> = [
  'interpretation-types.title',
  'interpretation-types.abbreviation',
  'interpretation-types.description',
  'interpretation-types.primaryDescription',
];

type Audience = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    description: prismic.RichTextField;
  },
  'audiences'
>;
export const audienceFetchLinks: FetchLinks<Audience> = [
  'audiences.title',
  'audiences.description',
];

export type EventPolicy = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    description: prismic.RichTextField;
  },
  'event-policies'
>;
export const eventPolicyFetchLinks: FetchLinks<EventPolicy> = [
  'event-policies.title',
  'event-policies.description',
];

export type Team = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    subtitle: prismic.RichTextField;
    email: prismic.KeyTextField;
    phone: prismic.KeyTextField;
    url: prismic.KeyTextField;
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
  format: prismic.ContentRelationshipField<
    'event-formats',
    'en-gb',
    InferDataInterface<EventFormat>
  >;
};

export type EventTimePrismicDocument = {
  startDateTime: prismic.TimestampField;
  endDateTime: prismic.TimestampField;
  isFullyBooked: prismic.BooleanField;
  onlineIsFullyBooked: prismic.BooleanField;
};

export type EventPrismicDocument = prismic.PrismicDocument<
  {
    locations: prismic.GroupField<{
      location: prismic.ContentRelationshipField<
        'place',
        'en-gb',
        InferDataInterface<PlacePrismicDocument>
      >;
    }>;
    isOnline: prismic.BooleanField;
    availableOnline: prismic.BooleanField;
    times: prismic.GroupField<EventTimePrismicDocument>;
    isRelaxedPerformance: prismic.SelectField<'yes'>;
    interpretations: prismic.GroupField<{
      interpretationType: prismic.ContentRelationshipField<
        'interpretation-types',
        'en-gb',
        InferDataInterface<InterpretationType>
      >;
      isPrimary: prismic.SelectField<'yes'>;
      extraInformation: prismic.RichTextField;
    }>;
    audiences: prismic.GroupField<{
      audience: prismic.ContentRelationshipField<
        'audiences',
        'en-gb',
        InferDataInterface<Audience>
      >;
    }>;
    ticketSalesStart: prismic.TimestampField;
    bookingEnquiryTeam: prismic.ContentRelationshipField<
      'teams',
      'en-gb',
      InferDataInterface<Team>
    >;
    eventbriteEvent: prismic.EmbedField;
    thirdPartyBookingName: prismic.KeyTextField;
    thirdPartyBookingUrl: prismic.LinkField;
    bookingInformation: prismic.RichTextField;
    policies: prismic.GroupField<{
      policy: prismic.ContentRelationshipField<
        'event-policy',
        'en-gb',
        InferDataInterface<EventPolicy>
      >;
    }>;
    hasEarlyRegistration: prismic.SelectField<'yes'>;
    cost: prismic.KeyTextField;
    schedule: prismic.GroupField<{
      event: prismic.ContentRelationshipField<
        'events',
        'en-gb',
        // We know this is an EventPrismicDocument, but the type checker gets
        // unhappy about the circular reference:
        //
        //    'event' is referenced directly or indirectly in its own type annotation.
        //
        // TODO: Find a better way to do this which doesn't upset the type checker.
        /* eslint-disable @typescript-eslint/no-explicit-any */
        InferDataInterface<any>
        /* eslint-enable @typescript-eslint/no-explicit-any */
      >;
      isNotLinked: prismic.SelectField<'yes'>;
    }>;
    backgroundTexture: prismic.ContentRelationshipField<
      'background-textures',
      'en-gb',
      InferDataInterface<BackgroundTexturesDocument>
    >;
    onlineTicketSalesStart: prismic.TimestampField;
    onlineBookingEnquiryTeam: prismic.ContentRelationshipField<
      'teams',
      'en-gb',
      InferDataInterface<Team>
    >;
    onlineEventbriteEvent: prismic.EmbedField;
    onlineThirdPartyBookingName: prismic.KeyTextField;
    onlineThirdPartyBookingUrl: prismic.LinkField;
    onlineBookingInformation: prismic.RichTextField;
    onlinePolicies: prismic.GroupField<{
      policy: prismic.ContentRelationshipField<
        'event-policy',
        'en-gb',
        InferDataInterface<EventPolicy>
      >;
    }>;
    onlineHasEarlyRegistration: prismic.SelectField<'yes'>;
    onlineCost: prismic.KeyTextField;
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
