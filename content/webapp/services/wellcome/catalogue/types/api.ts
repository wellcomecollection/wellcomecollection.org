import { CataloguePipelineOptionId } from '@weco/toggles';

// Optional override for selecting a specific Elastic cluster.
// 'openai' and 'elser' are for semantic-search prototype experiments; the
// remaining values are the cataloguePipeline mode toggle options, derived
// from the toggle definition so they can't drift out of sync with it.
// This is intentionally optional and experimental; production callers
// should omit it.
export type ElasticCluster = 'openai' | 'elser' | CataloguePipelineOptionId;

export type CatalogueWorksApiProps = {
  query?: string;
  page?: number;
  workType?: string[];
  'items.locations.locationType'?: string[];
  'items.locations.accessConditions.status'?: string[];
  'items.locations.createdDate.to'?: string;
  'items.locations.createdDate.from'?: string;
  availabilities?: string[];
  sort?: string;
  sortOrder?: string;
  'partOf.title'?: string;
  'production.dates.from'?: string;
  'production.dates.to'?: string;
  'genres.label'?: string[];
  'genres.concepts'?: string[];
  'subjects.label'?: string[];
  subjects?: string[];
  'contributors.agent.label'?: string[];
  languages?: string[];
  identifiers?: string[];
  aggregations?: string[];
  elasticCluster?: ElasticCluster;
};

export type CatalogueImagesApiProps = {
  query?: string;
  page?: number;
  'locations.license'?: string[];
  'source.genres.label'?: string[];
  'production.dates.from'?: string;
  'production.dates.to'?: string;
  'source.genres.concepts'?: string[];
  'source.subjects'?: string[];
  'source.subjects.label'?: string[];
  'source.contributors.agent.label'?: string[];
  color?: string;
  aggregations?: string[];
  elasticCluster?: ElasticCluster;
};

export type CatalogueConceptsApiProps = {
  query?: string;
  page?: number;
  id?: string;
};
