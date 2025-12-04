// ItemsLocationsAccessConditionsStatus is unused at the moment as it was very difficult to make it work with the
// existing encoding/decoding structure. However, it is defined here for future use, and to allow type checking
// when defining API parameters in other parts of the codebase.
const allowedStatuses = [
  'open',
  'open-with-advisory',
  'restricted',
  'closed',
  'licensed-resources',
  'unavailable',
  'permission-required',
  '!open',
  '!open-with-advisory',
  '!restricted',
  '!closed',
  '!licensed-resources',
  '!unavailable',
  '!permission-required',
] as const;
export type ItemsLocationsAccessConditionsStatus =
  (typeof allowedStatuses)[number];

export type CatalogueWorksApiProps = {
  query?: string;
  page?: number;
  workType?: string[];
  'items.locations.locationType'?: string[];
  'items.locations.accessConditions.status'?: string[];
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
