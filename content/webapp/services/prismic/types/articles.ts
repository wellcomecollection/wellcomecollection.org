import * as prismic from '@prismicio/client';
import { SeriesPrismicDocument } from './series';
import {
  CommonPrismicFields,
  WithArticleFormat,
  WithExhibitionParents,
  WithSeasons,
  WithContributors,
  FetchLinks,
} from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';

type WithSeries = {
  series: prismic.GroupField<{
    series: prismic.ContentRelationshipField<
      'series',
      'en-gb',
      InferDataInterface<SeriesPrismicDocument>
    >;
  }>;
};

export type ArticlePrismicDocument = prismic.PrismicDocument<
  {
    publishDate: prismic.TimestampField;
  } & WithSeries &
    WithContributors &
    WithSeasons &
    WithArticleFormat &
    WithExhibitionParents &
    CommonPrismicFields,
  'articles' | 'webcomics'
>;

export const articlesFetchLinks: FetchLinks<ArticlePrismicDocument> = [
  'articles.title',
];
