// @flow
export type Work = {
  type: 'Work',
  ...Object,
};

// type Work = {|
//   referenceNumber?: string,
//   id: string,
//   title: string,
//   alternativeTitles: string[],
//   type: 'Work',
//   partOf?: [],
//   parts?: [],
//   precededBy?: [],
//   succeededBy?: [],
// |};

export type Image = {
  type: 'Image',
  id: string,
  locations: Array<{
    url: string,
    ...Object,
  }>,
  source: {
    id: string,
    type: string,
  },
  visuallySimilar?: Image[],
};

export type CatalogueApiError = {|
  errorType: string,
  httpStatus: number,
  label: string,
  description: string,
  type: 'Error',
|};

export type CatalogueAggregationBucket = {|
  count: number,
  data: {|
    id: string,
    label: string,
    type: string,
  |},
  type: 'AggregationBucket',
|};

export type CatalogueAggregation = {|
  buckets: CatalogueAggregationBucket[],
|};

export type CatalogueAggregations = {|
  workType: CatalogueAggregation,
  locationType: CatalogueAggregation,
|};

export type CatalogueResultsList<Result = Work> = {
  type: 'ResultList',
  totalResults: number,
  results: Result[],
  pageSize: number,
  prevPage: ?string,
  nextPage: ?string,
  aggregations: ?CatalogueAggregations,
};

export type CatalogueApiRedirect = {
  type: 'Redirect',
  status: number,
  redirectToId: string,
};

export type CatalogueApiNotFound = {
  type: 'NotFound',
  status: 404,
};
