// @flow
export type Work = {
  type: 'Work',
  ...Object,
};

export type CatalogueApiError = {|
  errorType: string,
  httpStatus: number,
  label: string,
  description: string,
  type: 'Error',
|};

export type CatalogueResultsList = {
  type: 'ResultList',
  totalResults: number,
  results: Work[],
  pageSize: number,
  prevPage: ?string,
  nextPage: ?string,
};

export type CatalogueAggregationBucket = {
  count: number,
  data: {
    id: string,
    label: string,
    type: string,
  },
  type: 'AggregationBucket',
};

export type CatalogueApiRedirect = {
  type: 'Redirect',
  status: number,
  redirectToId: string,
};
