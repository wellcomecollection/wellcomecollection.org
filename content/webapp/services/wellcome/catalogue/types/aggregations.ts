import {
  WellcomeAggregation,
  UnidentifiedBucketData,
} from '@weco/content/services/wellcome';

export type WorkAggregations = {
  workType: WellcomeAggregation;
  availabilities: WellcomeAggregation;
  languages?: WellcomeAggregation;
  'genres.label'?: WellcomeAggregation<UnidentifiedBucketData>;
  'subjects.label'?: WellcomeAggregation<UnidentifiedBucketData>;
  'contributors.agent.label'?: WellcomeAggregation<UnidentifiedBucketData>;
  type: 'Aggregations';
};

export type ImageAggregations = {
  license?: WellcomeAggregation;
  'source.genres.label'?: WellcomeAggregation;
  'source.subjects.label'?: WellcomeAggregation;
  'source.contributors.agent.label'?: WellcomeAggregation;
  type: 'Aggregations';
};

export type ConceptAggregations = null;
