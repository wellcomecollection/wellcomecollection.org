export type Query = {
  query?: string;
  sortOrder?: string;
  sort?: string;
  page?: string;
  searchIn?: string; // TODO: Remove this property when semantic search toggles are removed semanticSearchComparison and semanticSearchPrototype
};
