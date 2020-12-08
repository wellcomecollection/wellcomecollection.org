import { LinkProps } from '../../model/link-props';
import { ParsedUrlQuery } from 'querystring';

type Params = Record<
  string,
  number | string[] | string | null | undefined | boolean
>;

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
// We shouldn't be inheriting anything from WorksRouteProps,
// but we do for ease of use for now.
export type ImagesRouteProps = WorksRouteProps & {
  query: string;
  page: number;
  source: string | null;
  locationsLicense: string[] | null;
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

  // [1] These should not be here, but we need a good
  // old tidy up of the props in this file
  color: string | null;
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
    // [1] wrong below this line
    color: null,
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
        stringQ['items.locations.locationType']
      ),
      itemsLocationsType: stringToCsv(stringQ['items.locations.type']),
      sort: maybeString(stringQ.sort),
      sortOrder: maybeString(stringQ.sortOrder),
      productionDatesFrom: maybeString(stringQ['production.dates.from']),
      productionDatesTo: maybeString(stringQ['production.dates.to']),
      imagesColor: maybeString(stringQ['images.color']),
      search: maybeString(stringQ.search),
      source: maybeString(stringQ.source),
      // [1] Wrong below this line
      color: null,
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
      locationsLicense: stringToCsv(stringQ.locationsLicense),
      color: defaultToEmptyString(stringQ.color),
      source: defaultToEmptyString(stringQ.source),

      // This should be removed
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
  },

  toLink(params) {
    const pathname = '/images';

    return {
      href: {
        pathname,
        query: {
          ...ImagesRoute.toQuery(params),
          source: params.source,
        },
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

export const imagesLink = (
  params: ImagesRouteProps,
  source: string
): LinkProps => ImagesRoute.toLink({ ...params, source });
export const worksLink = (params: WorksRouteProps, source: string): LinkProps =>
  WorksRoute.toLink({ ...params, source });

// route: /works/{id}/items
// /works/{id}/items
export type ItemRouteProps = {
  workId: string;
  langCode: string;
  canvas: number;
  sierraId?: string;
  isOverview?: boolean;
  page: number;
  pageSize: number;
};

export const ItemRoute: NextRoute<ItemRouteProps> = {
  fromQuery(q) {
    const {
      workId,
      langCode,
      canvas,
      sierraId,
      isOverview,
      page,
      pageSize,
    } = qAsStrings(q);

    return {
      workId: defaultToEmptyString(workId),
      langCode: langCode || 'eng',
      canvas: defaultTo1(canvas),
      sierraId: maybeString(sierraId) || undefined,
      isOverview: Boolean(isOverview),
      pageSize: pageSize ? parseInt(pageSize, 10) : 4,
      page: defaultTo1(page),
    };
  },

  toLink(params) {
    return {
      href: {
        pathname: `/item`,
        query: ItemRoute.toQuery(params),
      },
      as: {
        pathname: `/works/${params.workId}/items`,
        query: ItemRoute.toQuery(params),
      },
    };
  },

  toQuery(params) {
    return serialiseUrl(params);
  },
};
