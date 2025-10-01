type ItemsLocationsAccessConditionsStatus =
  | 'open'
  | 'open-with-advisory'
  | 'restricted'
  | 'closed'
  | 'licensed-resources'
  | 'unavailable'
  | 'permission-required'
  | '!open'
  | '!open-with-advisory'
  | '!restricted'
  | '!closed'
  | '!licensed-resources'
  | '!unavailable'
  | '!permission-required';

export type CatalogueWorksApiProps = {
  query?: string;
  page?: number;
  workType?: string[];
  'items.locations.locationType'?: string[];
  'items.locations.accessConditions.status'?: ItemsLocationsAccessConditionsStatus;
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
  aggregations?: string[];
};

export type CatalogueImagesApiProps = {
  query?: string;
  page?: number;
  'locations.license'?: string[];
  'source.genres.label'?: string[];
  'production.dates.from'?: string;
  'production.dates.to'?: string;
  'source.genres.concepts'?: string[];
  'source.subjects.label'?: string[];
  'source.contributors.agent.label'?: string[];
  color?: string;
  aggregations?: string[];
};

export type CatalogueConceptsApiProps = {
  query?: string;
  page?: number;
  id?: string;
};
