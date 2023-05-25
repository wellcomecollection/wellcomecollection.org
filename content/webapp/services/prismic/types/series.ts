// Annoyingly this file and type is called series, but it is only used for articles
import {
  GroupField,
  RichTextField,
  TimestampField,
  PrismicDocument,
  SelectField,
} from '@prismicio/client';
import {
  CommonPrismicFields,
  FetchLinks,
  WithContributors,
  WithSeasons,
} from '.';

const typeEnum = 'series';

export type SeriesPrismicDocument = PrismicDocument<
  {
    color: SelectField<
      'accent.blue' | 'accent.salmon' | 'accent.green' | 'accent.purple'
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

export const seriesFetchLinks: FetchLinks<SeriesPrismicDocument> = [
  'series.title',
  'series.promo',
  'series.schedule',
  'series.color',
];
