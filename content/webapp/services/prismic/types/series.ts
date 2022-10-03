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
} from '.';

const typeEnum = 'series';

// TODO map legacy colours in Prismic to use new one
// So we can clean this up eventually
export type SeriesPrismicDocument = PrismicDocument<
  {
    color: SelectField<
      | 'accent.blue'
      | 'accent.salmon'
      | 'accent.green'
      | 'accent.purple'
      | 'red'
      | 'green'
      | 'teal'
      | 'purple'
      | 'orange'
      | 'turquoise'
    >;
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
