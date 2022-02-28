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
  articleFormatsFetchLinks,
  contributorFetchLinks,
  CommonPrismicFields,
  commonPrismicFieldsFetchLinks,
  FetchLinks,
  InferDataInterface,
  WithArticleFormat,
  WithExhibitionParents,
  WithSeasons,
  WithContributors,
} from '.';
import { EventPrismicDocument } from './events';

export type WithSeries = {
  series: GroupField<{
    series: RelationField<
      'series',
      'en-gb',
      InferDataInterface<SeriesPrismicDocument>
    >;
  }>;
};
export const seriesFetchLinks: FetchLinks<SeriesPrismicDocument> = [
  'series.title',
  'series.promo',
  'series.schedule',
];

export const eventsFetchLinks: FetchLinks<EventPrismicDocument> = [
  'events.audiences',
  'events.schedule',
  'events.interpretations',
  'events.series',
  'events.times',
  'events.locations',
];

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

export const articlesFetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...articleFormatsFetchLinks,
  ...contributorFetchLinks,
  ...seriesFetchLinks,
  ...eventsFetchLinks,
];
