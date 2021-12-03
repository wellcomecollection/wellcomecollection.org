import {
  LinkField,
  RichTextField,
  TimestampField,
  PrismicDocument,
} from '@prismicio/types';
import {
  articleFormatsFetchLinks,
  CommonPrismicFields,
  commonPrismicFieldsFetchLinks,
  seriesFetchLink,
  WithArticleFormat,
  WithExhibitionParents,
  WithSeasons,
  WithSeries,
} from './types';

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
    WithSeasons &
    WithArticleFormat &
    WithExhibitionParents &
    CommonPrismicFields,
  'articles' | 'webcomics'
>;

export const articlesFetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...articleFormatsFetchLinks,
  ...seriesFetchLink,
];
