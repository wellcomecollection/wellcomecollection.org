import {
  GroupField,
  TimestampField,
  PrismicDocument,
  RelationField,
  RichTextField,
  SelectField,
  BooleanField,
  EmbedField,
  KeyTextField,
  LinkField,
} from '@prismicio/types';
import {
  BackgroundTexturesDocument,
  backgroundTexturesFetchLink,
} from './background-textures';
import { PlacePrismicDocument, placesFetchLink } from './places';
import {
  CommonPrismicFields,
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  eventSeriesFetchLink,
  exhibitionsFetchLinks,
  FetchLinks,
  InferDataInterface,
  WithContributors,
  WithEventSeries,
  WithExhibitionParents,
  WithSeasons,
} from './types';

const typeEnum = 'events';

type EventFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'event-formats'
>;
const eventFormatFetchLink: FetchLinks<EventFormat> = [
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
const interpretationTypeFetchLink: FetchLinks<InterpretationType> = [
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
const audienceFetchLinks: FetchLinks<Audience> = [
  'audiences.title',
  'audiences.description',
];

type EventPolicy = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'event-policies'
>;
const eventPoliciyFetchLink: FetchLinks<EventPolicy> = [
  'event-policies.title',
  'event-policies.description',
];

type Team = PrismicDocument<
  {
    title: RichTextField;
    subtitle: RichTextField;
    email: KeyTextField;
    phone: KeyTextField;
    url: KeyTextField;
  },
  'teams'
>;
const teamFetchLinks: FetchLinks<Team> = [
  'teams.title',
  'teams.subtitle',
  'teams.email',
  'teams.phone',
  'teams.url',
];

export type EventPrismicDocument = PrismicDocument<
  {
    format: RelationField<
      'event-formats',
      'en-gb',
      InferDataInterface<EventFormat>
    >;
    place: RelationField<
      'place',
      'en-gb',
      InferDataInterface<PlacePrismicDocument>
    >;
    isOnline: BooleanField;
    availableOnline: BooleanField;
    times: GroupField<{
      startDateTime: TimestampField;
      endDateTime: TimestampField;
      isFullyBooked: BooleanField;
    }>;
    isRelaxedPerformance: SelectField<'yes'>;
    interpretations: GroupField<{
      interpretationType: RelationField<
        'interpretation-types',
        'en-gb',
        InferDataInterface<InterpretationType>
      >;
      isPrimary: SelectField<'yes'>;
      extraInformation: RichTextField;
    }>;
    audiences: GroupField<{
      audience: RelationField<
        'audiences',
        'en-gb',
        InferDataInterface<Audience>
      >;
    }>;
    ticketSalesStart: TimestampField;
    bookingEnquiryTeam: RelationField<
      'teams',
      'en-gb',
      InferDataInterface<Team>
    >;
    eventbriteEvent: EmbedField;
    thirdPartyBookingName: KeyTextField;
    thirdPartyBookingUrl: LinkField;
    bookingInformation: RichTextField;
    policies: GroupField<{
      policy: RelationField<
        'event-policy',
        'en-gb',
        InferDataInterface<EventPolicy>
      >;
    }>;
    hasEarlyRegistration: SelectField<'yes'>;
    cost: KeyTextField;
    schedule: GroupField<{
      event: RelationField<
        'events',
        'en-gb',
        InferDataInterface<EventPrismicDocument>
      >;
      isNotLinked: SelectField<'yes'>;
    }>;
    backgroundTexture: RelationField<
      'background-textures',
      'en-gb',
      InferDataInterface<BackgroundTexturesDocument>
    >;
  } & WithContributors &
    WithEventSeries &
    WithExhibitionParents &
    WithSeasons &
    CommonPrismicFields,
  typeof typeEnum
>;
export const eventsFetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...eventSeriesFetchLink,
  ...exhibitionsFetchLinks,
  ...eventFormatFetchLink,
  ...interpretationTypeFetchLink,
  ...audienceFetchLinks,
  ...eventPoliciyFetchLink,
  ...placesFetchLink,
  ...teamFetchLinks,
  ...backgroundTexturesFetchLink,
];
