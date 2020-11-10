import { LinkProps } from 'next/link';
import { ParsedUrlQuery } from 'querystring';

type Params = {
  [key: string]: any;
};

export type UrlParams = {
  [key: string]: string;
};

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

function stringToCsv(s: string | null): string[] {
  return s ? s.split(',') : [];
}

function maybeString(s: string | null): string | null {
  return s || null;
}

function defaultTo1(v: string | number | null): number {
  return v ? parseInt(`${v}`, 10) : 1;
}

function defaultToEmptyString(s: string | null): string {
  return s || '';
}

function qAsStrings(q: ParsedUrlQuery): { [key: string]: string | null } {
  return Object.entries(q).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      return {
        ...acc,
        [key]: value.join(','),
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});
}

type NextRoute<T> = {
  fromQuery: (q: ParsedUrlQuery) => T;
  toLink: (t: T) => LinkProps;
  toQuery: (t: T) => UrlParams;
};

// route: /images
export type ImagesRouteProps = {
  query: string;
  page: number;
  source: string | null;
  locationsLicense: string | null;
  color: string | null;
};

// route: /works
export type WorksRouteProps = {
  query: string;
  page: number;
  source: string | null;
  workType: string[];
  itemsLocationsLocationType: string[];
  itemsLocationsType: string[];
  sort: string | null;
  sortOrder: string | null;
  productionDatesFrom: string | null;
  productionDatesTo: string | null;
  imagesColor: string | null;
  search: string | null;
};

export function imagesRoutePropsToWorksRouteProps(
  imagesRouteProps: ImagesRouteProps
): WorksRouteProps {
  return {
    query: imagesRouteProps.query,
    page: imagesRouteProps.page,
    source: null,
    workType: [],
    itemsLocationsLocationType: [],
    itemsLocationsType: [],
    sort: null,
    sortOrder: null,
    productionDatesFrom: null,
    productionDatesTo: null,
    imagesColor: null,
    search: null,
  };
}

export const WorksRoute: NextRoute<WorksRouteProps> = {
  fromQuery(q) {
    const stringQ = qAsStrings(q);
    return {
      query: defaultToEmptyString(stringQ.query),
      page: defaultTo1(stringQ.page),
      workType: stringToCsv(stringQ.workType),
      itemsLocationsLocationType: stringToCsv(
        qAsStrings['items.locations.locationType']
      ),
      itemsLocationsType: stringToCsv(qAsStrings['items.locations.type']),
      sort: maybeString(stringQ.sort),
      sortOrder: maybeString(stringQ.sortOrder),
      productionDatesFrom: maybeString(qAsStrings['production.dates.from']),
      productionDatesTo: maybeString(qAsStrings['production.dates.to']),
      imagesColor: maybeString(qAsStrings['images.color']),
      search: maybeString(stringQ.search),
      source: maybeString(stringQ.source),
    };
  },

  toLink(params) {
    const pathname = '/works';
    const { source, ...paramsWithoutSource } = params;

    return {
      href: {
        pathname,
        query: WorksRoute.toQuery(params),
      },
      as: {
        pathname,
        query: WorksRoute.toQuery({
          ...paramsWithoutSource,
          source: null,
        }),
      },
    };
  },

  toQuery(params) {
    return serialiseUrl({
      query: params.query,
      page: params.page,
      workType: params.workType,
      'items.locations.locationType': params.itemsLocationsLocationType,
      'items.locations.type': params.itemsLocationsType,
      sort: params.sort,
      sortOrder: params.sortOrder,
      'production.dates.from': params.productionDatesFrom,
      'production.dates.to': params.productionDatesTo,
      'images.color': params.imagesColor,
      search: params.search,
      source: params.source,
    });
  },
};

export const ImagesRoute: NextRoute<ImagesRouteProps> = {
  fromQuery(q) {
    const stringQ = qAsStrings(q);
    return {
      query: defaultToEmptyString(stringQ.query),
      page: defaultTo1(stringQ.page),
      locationsLicense: defaultToEmptyString(stringQ.locationsLicense),
      color: defaultToEmptyString(stringQ.color),
      source: defaultToEmptyString(stringQ.source),
    };
  },

  toLink(params) {
    const pathname = '/images';

    return {
      href: {
        pathname,
        query: ImagesRoute.toQuery(params),
      },
      as: {
        pathname,
        query: ImagesRoute.toQuery(params),
      },
    };
  },

  toQuery(params) {
    return serialiseUrl({
      query: params.query,
      page: params.page,
      'locations.license': params.locationsLicense,
      color: params.color,
    });
  },
};

export const imagesLink = (params: ImagesRouteProps, source: string) =>
  ImagesRoute.toLink({ ...params, source });
export const worksLink = (params: WorksRouteProps, source: string) =>
  WorksRoute.toLink({ ...params, source });
