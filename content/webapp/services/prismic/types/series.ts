// Annoyingly this file and type is called series, but it is only used for articles
import {
  GroupField,
  RichTextField,
  TimestampField,
  PrismicDocument,
  SelectField,
  RelationField,
} from '@prismicio/types';
import {
  CommonPrismicFields,
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  seasonsFetchLinks,
  WithContributors,
  WithSeasons,
} from '.';

const typeEnum = 'series';

export type FeaturedSerialPrismicDocument = PrismicDocument<{
  serial: RelationField<'serial', 'en-gb'>;
}>;

export type SeriesPrismicDocument = PrismicDocument<
  {
    color: SelectField<'teal' | 'red' | 'green' | 'purple'>;
    schedule: GroupField<{
      title: RichTextField;
      publishDate: TimestampField;
    }>;
  } & WithContributors &
    WithSeasons &
    CommonPrismicFields,
  typeof typeEnum
>;

export const seriesFetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...seasonsFetchLinks,
];
