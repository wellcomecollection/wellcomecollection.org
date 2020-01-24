// @flow

// /works
export type WorksParams = {|
  query: ?string,
  page: ?number,
  workType: ?(string[]),
  itemsLocationsLocationType: ?(string[]),
  sort: ?string,
  sortOrder: ?string,
  productionDatesFrom: ?string,
  productionDatesTo: ?string,
  search: ?string,
  source: ?string,
|};

export type ApiWorksParams = {|
  query: ?string,
  page: ?number,
  workType: ?(string[]),
  'items.locations.locationType': ?(string[]),
  sort: ?string,
  sortOrder: ?string,
  'production.dates.from': ?string,
  'production.dates.to': ?string,
  aggregations: ?(string[]),
  _queryType: ?string,
|};

// We extend from ApiSearchParams as this will be more robust for reporting
// as we open up the `workType`s.

// This way we are tracking exactly what people are seeing.
export type TrackWorksParams = {|
  ...ApiWorksParams,
  source: ?string,
|};

function stringTocsv(s: ?string): ?(string[]) {
  return s ? s.split(',') : null;
}

// This is the object you get from ctx.query, at least a `{}`.
type UrlQuery = { [key: string]: string };

export function worksParamsFromQuery(q: UrlQuery): WorksParams {
  return {
    query: q.query,
    page: q.page ? parseInt(q.page, 10) : null,
    workType: stringTocsv(q.workType),
    itemsLocationsLocationType: stringTocsv(q.workType),
    sort: q.sort,
    sortOrder: q.sortOrder,
    productionDatesFrom: q['production.dates.from'],
    productionDatesTo: q['production.dates.from'],
    search: q.search,
    source: q.source,
  };
}

// The difference between the two below is that if we don't get values from the
// URL, we use defaults to filter out some work types and location types.
export function apiWorksParams(
  p: WorksParams,
  overrides: $Shape<ApiWorksParams>
): ApiWorksParams {
  return {
    query: p.query,
    page: p.page,
    workType: p.workType || ['a', 'k', 'q', 'i', 'g'],
    'items.locations.locationType': p.workType || [
      'iiif-image',
      'iiif-presentation',
    ],
    sort: p.sort,
    sortOrder: p.sortOrder,
    'production.dates.from': p.productionDatesFrom,
    'production.dates.to': p.productionDatesTo,
    ...overrides,
  };
}

export function unfilteredApiWorksParams(
  p: WorksParams,
  overrides: $Shape<ApiWorksParams>
): ApiWorksParams {
  return {
    query: p.query,
    page: p.page,
    workType: p.workType,
    'items.locations.locationType': p.workType,
    sort: p.sort,
    sortOrder: p.sortOrder,
    'production.dates.from': p.productionDatesFrom,
    'production.dates.to': p.productionDatesTo,
    ...overrides,
  };
}

// /work/{id}
export type WorkParams = {|
  ...WorksParams,
  id: string,
|};

// /works/{id}/items
export type ItemParams = {|
  ...WorksParams,
  workId: string,
  langCode: string,
  canvas: number,
  sierraId: ?string,
  page: ?number,
  isOverview?: boolean,
|};

export const defaultWorkTypes = ['a', 'k', 'q', 'i', 'g'];
export const defaultItemsLocationLocationType = ['a', 'k', 'q', 'i', 'g'];
