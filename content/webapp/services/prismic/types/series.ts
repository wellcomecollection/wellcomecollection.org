// Annoyingly this file and type is called series, but it is only used for articles
import * as prismic from '@prismicio/client';
import {
  CommonPrismicFields,
  FetchLinks,
  WithContributors,
  WithSeasons,
} from '.';

const typeEnum = 'series';

export type SeriesPrismicDocument = prismic.PrismicDocument<
  {
    color: prismic.SelectField<
      'accent.blue' | 'accent.salmon' | 'accent.green' | 'accent.purple'
    >;
    schedule: prismic.GroupField<{
      title: prismic.RichTextField;
      publishDate: prismic.TimestampField;
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
