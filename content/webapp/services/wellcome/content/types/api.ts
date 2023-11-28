import { ArticleFormatId } from '@weco/content/data/content-format-ids';
import * as prismic from '@prismicio/client';
import { WellcomeAggregation, WellcomeResultList } from '../../index';
import { ContentApiImage } from '.';

export type ContentApiProps = {
  query?: string;
  page?: number;
  sort?: string;
  sortOrder?: string;
  aggregations?: string[];
};

// Articles
export type ArticleFormat = {
  type: 'ArticleFormat';
  id: ArticleFormatId;
  label: string;
};

export type Article = {
  type: 'Article';
  id: string;
  title: string;
  publicationDate: string;
  contributors: Contributor[];
  format: ArticleFormat;
  image?: prismic.EmptyImageFieldImage | prismic.FilledImageFieldImage; // TODO change to ContentApiImage
  caption?: string;
};

// Event Documents
export type EventDocumentFormat = {
  type: 'EventFormat';
  id: string;
  label: string;
};

export type EventDocumentLocation = {
  type: 'EventLocation';
  id: string;
  label?: string;
};

export type EventDocumentInterpretation = {
  type: 'EventInterpretation';
  id: string;
  label?: string;
};

export type EventDocument = {
  type: 'Event';
  id: string;
  title: string;
  image?: ContentApiImage;
  times: { startDateTime?: Date; endDateTime?: Date }[];
  format: EventDocumentFormat;
  locations: EventDocumentLocation[];
  interpretations: EventDocumentInterpretation[];
};

// Contributors (e.g. author, photographer)
type BasicContributorInformation = {
  id: string;
  label?: string;
};

type Contributor = {
  type: 'Contributor';
  contributor?: BasicContributorInformation & {
    type: 'Person' | 'Organisation';
  };
  role?: BasicContributorInformation & {
    type: 'EditorialContributorRole';
  };
};

type BasicAggregations = {
  format: WellcomeAggregation;
  type: 'Aggregations';
};

export type ArticleAggregations = BasicAggregations & {
  'contributors.contributor': WellcomeAggregation;
};

export type ResultType = Article | EventDocument;

export type ContentResultsList<Result extends ResultType> = WellcomeResultList<
  Result,
  Result extends Article ? ArticleAggregations : null
>;
