// Annoyingly this file and type is called series, but it is only used for articles
import {
  GroupField,
  RichTextField,
  TimestampField,
  PrismicDocument,
  SelectField,
} from '@prismicio/types';
import {
  CommonPrismicFields,
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  seasonsFetchLinks,
  WithContributors,
  WithSeasons,
} from './types';

const typeEnum = 'series';

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
