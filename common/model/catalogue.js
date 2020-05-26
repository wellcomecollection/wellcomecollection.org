// @flow
export type Work = {
  type: 'Work',
  ...Object,
};

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

export type CatalogueResultsList<Result = Work> = {
  type: 'ResultList',
  totalResults: number,
  results: Result[],
  pageSize: number,
  prevPage: ?string,
  nextPage: ?string,
  aggregations: ?{|
    workType: CatalogueAggregation,
  |},
};

export type CatalogueApiRedirect = {
  type: 'Redirect',
  status: number,
  redirectToId: string,
};
