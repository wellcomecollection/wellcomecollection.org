// @flow
import { type NextLinkType } from '@weco/common/model/next-link-type';
// $FlowFixMe
import { parseCsv } from '@weco/common/utils/csv';
type Params = { [key: string]: any };
export type UrlParams = { [key: string]: string };
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

function stringToCsv(s: ?string): string[] {
  return s ? s.split(',') : [];
}

function maybeString(s: ?string): ?string {
  return s || null;
}

function defaultTo1(v: ?(string | number)): number {
  return v ? parseInt(v, 10) : 1;
}

function defaultToEmptyString(s: ?string): string {
  return s || '';
}

function quotedCsv(v: string | null) {
  return v ? parseCsv(v) : [];
}

type NextRoute<T> = {|
  fromQuery: (q: UrlParams) => T,
  toLink: (t: $Shape<T>) => NextLinkType,
  toQuery: (t: $Shape<T>) => UrlParams,
|};

// route: /works
export type WorksRouteProps = {|
  query: string,
  page: number,
  workType: string[],
  itemsLocationsLocationType: string[],
  itemsLocationsType: string[],
  sort: ?string,
  sortOrder: ?string,
  productionDatesFrom: ?string,
  productionDatesTo: ?string,
  imagesColor: ?string,
  search: ?string,
  source: ?string,
  languages: ?(string[]),
  subjectsLabel: ?(string[]),
  genresLabel: ?(string[]),
  contributorsAgentLabel: ?(string[]),
|};

export const WorksRoute: NextRoute<WorksRouteProps> = {
  fromQuery(q) {
    return {
      query: defaultToEmptyString(q.query),
      page: defaultTo1(q.page),
      workType: stringToCsv(q.workType),
      itemsLocationsLocationType: stringToCsv(
        q['items.locations.locationType']
      ),
      itemsLocationsType: stringToCsv(q['items.locations.type']),
      sort: maybeString(q.sort),
      sortOrder: maybeString(q.sortOrder),
      productionDatesFrom: maybeString(q['production.dates.from']),
      productionDatesTo: maybeString(q['production.dates.to']),
      imagesColor: maybeString(q['images.color']),
      search: maybeString(q.search),
      source: maybeString(q.source),
      languages: stringToCsv(q.languages),
      subjectsLabel: quotedCsv(q['subjects.label']),
      genresLabel: quotedCsv(q['genres.label']),
      contributorsAgentLabel: quotedCsv(q['contributors.agent.label']),
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
        query: WorksRoute.toQuery(paramsWithoutSource),
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
      'contributors.agent.label': params.contributorsAgentLabel,
    });
  },
};

// route: /works/{id}
export type WorkRouteProps = {|
  id: string,
|};

export const WorkRoute: NextRoute<WorkRouteProps> = {
  fromQuery(q) {
    return {
      id: defaultToEmptyString(q.id),
    };
  },

  toLink(params) {
    const { id } = params;
    return {
      href: {
        pathname: '/work',
        query: { id },
      },
      as: {
        pathname: `/works/${id}`,
        query: {},
      },
    };
  },

  toQuery(params) {
    return serialiseUrl({ id: params.id });
  },
};

// route: /works/{id}/items
// /works/{id}/items
export type ItemRouteProps = {|
  workId: string,
  langCode: string,
  canvas: number,
  sierraId: ?string,
  isOverview?: boolean,
  page: number,
  pageSize: number,
|};

export const ItemRoute: NextRoute<ItemRouteProps> = {
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
      workId: defaultToEmptyString(workId),
      langCode,
      sierraId: maybeString(sierraId),
      pageSize: pageSize ? parseInt(pageSize, 10) : 4,
      canvas: defaultTo1(canvas),
      isOverview: Boolean(isOverview),
      page: defaultTo1(page),
    };
  },
  toLink(params) {
    const { workId, ...as } = params;
    return {
      href: {
        pathname: `/item`,
        query: ItemRoute.toQuery(params),
      },
      as: {
        pathname: `/works/${workId}/items`,
        query: ItemRoute.toQuery(as),
      },
    };
  },
  toQuery(params) {
    return serialiseUrl(params);
  },
};

export type ImageRouteProps = {|
  id: string,
  workId: string,
  langCode: string,
|};

export const ImageRoute: NextRoute<ImageRouteProps> = {
  fromQuery(q) {
    const { workId, langCode = 'eng', id } = q;
    return {
      workId: defaultToEmptyString(workId),
      langCode,
      id: defaultToEmptyString(id),
    };
  },
  toLink(params) {
    const { workId, ...as } = params;
    return {
      href: {
        pathname: '/image',
        query: ImageRoute.toQuery(params),
      },
      as: {
        pathname: `/works/${workId}/images`,
        query: ImageRoute.toQuery(as),
      },
    };
  },
  toQuery(params) {
    return serialiseUrl(params);
  },
};

export const worksLink = (params: $Shape<WorksRouteProps>, source: string) =>
  WorksRoute.toLink({ ...params, source });
export const itemLink = ItemRoute.toLink;
export const imageLink = ImageRoute.toLink;
