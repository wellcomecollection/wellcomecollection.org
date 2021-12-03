import {
  LinkField,
  RichTextField,
  TimestampField,
  PrismicDocument,
} from '@prismicio/types';
import {
  CommonPrismicData,
  WithFormat,
  WithParents,
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
    WithFormat &
    WithParents &
    CommonPrismicData,
  'articles'
>;
