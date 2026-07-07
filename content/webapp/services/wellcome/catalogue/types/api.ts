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
  // Optional override for selecting a specific Elastic cluster. Expected
  // values:
  // - 'openai' and 'elser', for semantic-search prototype experiments
  // - 'new-pipeline', for previewing the new catalogue pipeline
  // This is intentionally optional and experimental; production callers
  // should omit this.
  elasticCluster?: 'openai' | 'elser' | 'new-pipeline';
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
  // Optional override for selecting a specific Elastic cluster. Expected
  // values:
  // - 'openai' and 'elser', for semantic-search prototype experiments
  // - 'new-pipeline', for previewing the new catalogue pipeline
  // This is intentionally optional and experimental; production callers
  // should omit this.
  elasticCluster?: 'openai' | 'elser' | 'new-pipeline';
};

export type CatalogueConceptsApiProps = {
  query?: string;
  page?: number;
  id?: string;
};
