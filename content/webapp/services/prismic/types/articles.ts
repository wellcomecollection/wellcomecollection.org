import {
  LinkField,
  RichTextField,
  TimestampField,
  PrismicDocument,
  GroupField,
  ContentRelationshipField,
} from '@prismicio/client';
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
  series: GroupField<{
    series: ContentRelationshipField<
      'series',
      'en-gb',
      InferDataInterface<SeriesPrismicDocument>
    >;
  }>;
};

export type ArticlePrismicDocument = PrismicDocument<
  {
    publishDate: TimestampField;
    outroResearchItem: LinkField;
    outroResearchLinkText: RichTextField;
    outroReadItem: LinkField;
    outroReadLinkText: RichTextField;
    outroVisitItem: LinkField;
    outroVisitLinkText: RichTextField;
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
