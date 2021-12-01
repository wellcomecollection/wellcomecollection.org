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
  CommonPrismicData,
  InferDataInterface,
  WithContributors,
  WithParents,
  WithSeasons,
  WithSeries,
} from './types';

const typeEnum = 'events';

type EventFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'event-formats'
>;

export type EventPrismicDocument = PrismicDocument<
  {
    format: RelationField<
      'event-formats',
      'en-gb',
      InferDataInterface<EventFormat>
    >;
    place: RelationField<'place'>;
    isOnline: BooleanField;
    availableOnline: BooleanField;
    times: GroupField<{
      startDateTime: TimestampField;
      endDateTime: TimestampField;
      isFullyBooked: BooleanField;
    }>;
    isRelaxedPerformance: SelectField<'yes'>;
    interpretations: GroupField<{
      interpretationType: RelationField<'interpretation-types'>;
      isPrimary: SelectField<'yes'>;
      extraInformation: RichTextField;
    }>;
    audiences: GroupField<{
      audience: RelationField<'audiences'>;
    }>;
    ticketSalesStart: TimestampField;
    bookingEnquiryTeam: RelationField<'teams'>;
    eventbriteEvent: EmbedField;
    thirdPartyBookingName: KeyTextField;
    thirdPartyBookingUrl: LinkField;
    bookingInformation: RichTextField;
    policies: GroupField<{
      policy: RelationField<'event-policy'>;
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
    backgroundTexture: RelationField<'background-textures'>;
  } & WithContributors &
    WithSeries &
    WithParents &
    WithSeasons &
    CommonPrismicData,
  typeof typeEnum
>;
