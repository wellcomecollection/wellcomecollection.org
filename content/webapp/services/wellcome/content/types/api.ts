import { ArticleFormatId } from '@weco/content/data/content-format-ids';
import * as prismic from '@prismicio/client';
import {
  WellcomeAggregation,
  WellcomeResultList,
} from '@weco/content/services/wellcome';
import { CustomPrismicFilledImage } from '@weco/common/services/prismic/types';

export type ContentApiTimeField = {
  startDateTime?: Date;
  endDateTime?: Date;
};

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
  image?: prismic.EmptyImageFieldImage | CustomPrismicFilledImage;
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
  image?: prismic.EmptyImageFieldImage | CustomPrismicFilledImage;
  times: ContentApiTimeField[];
  format: EventDocumentFormat;
  locations: EventDocumentLocation[];
  interpretations: EventDocumentInterpretation[];
  isAvailableOnline: boolean;
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
