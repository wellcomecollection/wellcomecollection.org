// @flow
import { type NextLinkType } from '@weco/common/model/next-link-type';
import { serialiseUrl } from './urls';

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

function defaultTo1(v: ?(string | number)): number {
  return v ? parseInt(v, 10) : 1;
}

function toIsoDate(s: string): ?string {
  try {
    return new Date(s).toISOString().split('T')[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}

// This is the object you get from ctx.query, at least a `{}`.
type RequestQuery = { [key: string]: string };

type NextRoute<T> = {|
  fromQuery: (q: RequestQuery) => T,
  link: (t: $Shape<T>) => NextLinkType,
  query: (t: $Shape<T>) => RequestQuery,
|};

// /works
export const WorksCodec: NextRoute<WorksParams> = {
  fromQuery(q) {
    return {
      query: q.query || '',
      page: q.page ? parseInt(q.page, 10) : null,
      workType: stringTocsv(q.workType),
      itemsLocationsLocationType: stringTocsv(
        q['items.locations.locationType']
      ),
      sort: q.sort,
      sortOrder: q.sortOrder,
      productionDatesFrom: q['production.dates.from'],
      productionDatesTo: q['production.dates.to'],
      search: q.search,
      source: q.source,
    };
  },

  link(params) {
    const pathname = '/works';

    return {
      href: {
        pathname,
        query: WorksCodec.query(params),
      },
      as: {
        pathname,
        query: WorksCodec.query({ ...params, source: null }),
      },
    };
  },

  query(params) {
    return serialiseUrl({
      query: params.query,
      page: params.page,
      workType: params.workType,
      'items.locations.locationType': params.itemsLocationsLocationType,
      sort: params.sort,
      sortOrder: params.sortOrder,
      'production.dates.from': params.productionDatesFrom,
      'production.dates.to': params.productionDatesTo,
      search: params.search,
      source: params.source,
    });
  },
};

// /work/{id}
export type WorkParams = {|
  id: string,
|};
export const WorkCodec: NextRoute<WorkParams> = {
  fromQuery(q) {
    const { id } = q;
    return { id };
  },
  link(params) {
    const { id } = params;
    return {
      href: {
        pathname: `/work`,
        query: WorkCodec.query({
          id,
        }),
      },
      as: {
        pathname: `/works/${id}`,
      },
    };
  },
  query(params) {
    const { id } = params;
    return { id };
  },
};

// /works/{id}/items
export type ItemParams = {|
  workId: string,
  langCode: string,
  canvas: number,
  sierraId: ?string,
  isOverview?: boolean,
  // This is used exclusively for
  page: number,
  pageSize: number,
|};

export const ItemCodec: NextRoute<ItemParams> = {
  fromQuery(q) {
    const {
      workId,
      langCode = 'eng',
      canvas,
      sierraId,
      isOverview,
      page,
      pageSize,
    } = q;
    return {
      workId,
      langCode,
      sierraId,
      pageSize: pageSize ? parseInt(pageSize, 10) : 4,
      canvas: defaultTo1(canvas),
      isOverview: Boolean(isOverview),
      page: defaultTo1(page),
    };
  },
  link(params) {
    const { workId, ...as } = params;
    return {
      href: {
        pathname: `/item`,
        query: ItemCodec.query(params),
      },
      as: {
        pathname: `/works/${params.workId}/items`,
        query: ItemCodec.query(as),
      },
    };
  },
  query(params) {
    return serialiseUrl(params);
  },
};

export const defaultWorkTypes = ['a', 'k', 'q', 'i', 'g'];
export const defaultItemsLocationLocationType = [
  'iiif-image',
  'iiif-presentation',
];

export const ApiWorksCodec = {
  // The difference between the two below is that if we don't get values from the
  // URL, we use defaults to filter out some work types and location types.
  fromWorksParams(params: WorksParams, overrides: $Shape<ApiWorksParams>) {
    const isImageSearch = params.search === 'images';
    return {
      query: params.query,
      page: defaultTo1(params.page),
      workType: params.workType,
      'items.locations.locationType': isImageSearch
        ? ['iiif-image']
        : params.itemsLocationsLocationType,
      sort: params.sort,
      sortOrder: params.sortOrder,
      'production.dates.from': params.productionDatesFrom
        ? toIsoDate(params.productionDatesFrom)
        : null,
      'production.dates.to': params.productionDatesTo
        ? toIsoDate(params.productionDatesTo)
        : null,
      ...overrides,
    };
  },

  fromWorksParamsWithDefaultFilters(
    params: WorksParams,
    overrides: $Shape<ApiWorksParams>
  ) {
    const isImageSearch = params.search === 'images';
    return {
      query: params.query,
      page: defaultTo1(params.page),
      workType: params.workType || defaultWorkTypes,
      'items.locations.locationType': isImageSearch
        ? ['iiif-image']
        : params.itemsLocationsLocationType || defaultItemsLocationLocationType,
      sort: params.sort,
      sortOrder: params.sortOrder,
      'production.dates.from': params.productionDatesFrom
        ? toIsoDate(params.productionDatesFrom)
        : null,
      'production.dates.to': params.productionDatesTo
        ? toIsoDate(params.productionDatesTo)
        : null,
      ...overrides,
    };
  },
};

// These are just for convenience as they're imported a lot
export const worksLink = WorksCodec.link;
export const workLink = WorkCodec.link;
export const itemLink = ItemCodec.link;
