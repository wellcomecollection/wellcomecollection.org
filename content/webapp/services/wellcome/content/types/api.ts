import { ArticleFormatId } from '@weco/content/data/content-format-ids';
import { Image } from '@weco/content/services/prismic/types';
import {
  BooleanBucketData,
  WellcomeAggregation,
  WellcomeResultList,
} from '@weco/content/services/wellcome';

export type ContentApiTimeField = {
  startDateTime?: Date;
  endDateTime?: Date;
  isFullyBooked: {
    inVenue: boolean;
    online: boolean;
  };
};

export type ContentApiProps = {
  query?: string;
  page?: number;
  sort?: string;
  sortOrder?: string;
  aggregations?: string[];
};

type ContentApiImage = Image & { type: 'PrismicImage' };

export type Series = {
  id: string;
  title?: string;
  contributors?: string[];
}[];

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
  image?: ContentApiImage;
  caption?: string;
};

// Event Documents
export type EventDocumentFormat = {
  type: 'EventFormat';
  id: string;
  label: string;
};

type OnlineAttendance = {
  id: 'online';
  label: 'Online';
};
type BuildingAttendance = {
  id: 'in-our-building';
  label: 'In our building';
};
export type EventDocumentPlace = {
  type: 'EventPlace';
  id: string;
  label?: string;
};
export type EventDocumentLocations = {
  isOnline: boolean;
  places?: EventDocumentPlace[];
  attendance: ((BuildingAttendance | OnlineAttendance) & {
    type: 'EventAttendance';
  })[];
  type: 'EventLocations';
};

export type EventDocumentInterpretation = {
  type: 'EventInterpretation';
  id: string;
  label?: string;
};

export type EventDocumentAudience = {
  type: 'EventAudience';
  id: string;
  label: string;
};

export type EventDocument = {
  type: 'Event';
  id: string;
  title: string;
  image?: ContentApiImage;
  times: ContentApiTimeField[];
  audiences: EventDocumentAudience[];
  series: Series;
  format: EventDocumentFormat;
  interpretations: EventDocumentInterpretation[];
  locations: EventDocumentLocations;
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

// Aggregrations
type BasicAggregations = {
  type: 'Aggregations';
  format: WellcomeAggregation;
};

export type ArticleAggregations = BasicAggregations & {
  'contributors.contributor': WellcomeAggregation;
};

export type EventAggregations = BasicAggregations & {
  audience: WellcomeAggregation;
  interpretation: WellcomeAggregation;
  location: WellcomeAggregation;
  isAvailableOnline: WellcomeAggregation<BooleanBucketData>;
};

// Results
export type ResultType = Article | EventDocument;

export type ContentResultsList<Result extends ResultType> = WellcomeResultList<
  Result,
  Result extends Article ? ArticleAggregations : EventAggregations
>;
