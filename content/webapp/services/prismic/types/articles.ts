import {
  LinkField,
  RichTextField,
  TimestampField,
  PrismicDocument,
  GroupField,
  RelationField,
} from '@prismicio/types';
import { SeriesPrismicDocument } from './series';
import {
  CommonPrismicFields,
  WithArticleFormat,
  WithExhibitionParents,
  WithSeasons,
  WithContributors,
} from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';

type WithSeries = {
  series: GroupField<{
    series: RelationField<
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
