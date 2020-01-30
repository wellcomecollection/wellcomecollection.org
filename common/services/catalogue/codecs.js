// @flow
import { type NextLinkType } from '@weco/common/model/next-link-type';

type Params = { [key: string]: any };
type UrlParams = { [key: string]: string };
export function serialiseUrl(params: Params): UrlParams {
  return Object.keys(params).reduce((acc, key) => {
    const val = params[key];

    // We use this function as next represents arrays in JS
    // as arrays in the URLs, unsurprisingly, and the csv
    // is our own bespoke syntax.

    // worksType = ['a', 'b', 'c']
    // URL spec: workType=a&workType=b&workType=c
    // weco: workType=a,b,c
    if (Array.isArray(val)) {
      if (val.length === 0) {
        return {
          ...acc,
        };
      } else {
        return {
          ...acc,
          [key]: val.join(','),
        };
      }
    }

    // any empty values, we don't add
    if (val === null || val === undefined || val === '') {
      return { ...acc };
    }

    // As all our services default to `page: null` to `page: 1` so we remove it
    if (key === 'page' && val === 1) {
      return { ...acc };
    }

    return {
      ...acc,
      [key]: val.toString(),
    };
  }, {});
}

function stringTocsv(s: ?string): string[] {
  return s ? s.split(',') : [];
}

function maybeString(s: ?string): ?string {
  return s || null;
}

function defaultTo1(v: ?(string | number)): number {
  return v ? parseInt(v, 10) : 1;
}

type NextRoute<T> = {|
  fromQuery: (q: UrlParams) => T,
  toLink: (t: $Shape<T>) => NextLinkType,
  toQuery: (t: $Shape<T>) => UrlParams,
|};

// /works
export type WorksRouteProps = {|
  query: string,
  page: number,
  workType: string[],
  itemsLocationsLocationType: string[],
  sort: ?string,
  sortOrder: ?string,
  productionDatesFrom: ?string,
  productionDatesTo: ?string,
  search: ?string,
  source: ?string,
|};

// /works
export const WorksRoute: NextRoute<WorksRouteProps> = {
  fromQuery(q) {
    return {
      query: q.query || '',
      page: defaultTo1(q.page),
      workType: stringTocsv(q.workType),
      itemsLocationsLocationType: stringTocsv(
        q['items.locations.locationType']
      ),
      sort: maybeString(q.sort),
      sortOrder: maybeString(q.sortOrder),
      productionDatesFrom: maybeString(q['production.dates.from']),
      productionDatesTo: maybeString(q['production.dates.to']),
      search: maybeString(q.search),
      source: maybeString(q.source),
    };
  },

  toLink(params) {
    const pathname = '/works';

    return {
      href: {
        pathname,
        query: WorksRoute.toQuery(params),
      },
      as: {
        pathname,
        query: WorksRoute.toQuery({ ...params, source: null }),
      },
    };
  },

  toQuery(params) {
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
