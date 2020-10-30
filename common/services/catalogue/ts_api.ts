import { WorksRouteProps } from './routes';
import { ImagesRouteProps } from './ts_routes';

export type CatalogueImagesApiProps = {
  query: string | null;
  page: number | null;
  'locations.license': (string[]) | null;
  color: string | null;
};

function toIsoDateString(s: string | null): string | null {
  if (s) {
    try {
      return new Date(s).toISOString().split('T')[0];
    } catch (e) {
      return null;
    }
  }
  return null;
}

export type CatalogueWorksApiProps = {
  query: string | null;
  page: number | null;
  workType: (string[]) | null;
  'items.locations.locationType': (string[]) | null;
  'items.locations.accessConditions.status': ((
    | 'open'
    | 'open-with-advisory'
    | 'restricted'
    | 'closed'
    | 'licensed-resources'
    | 'unavailable'
    | 'permission-required'
    | '!open'
    | '!open-with-advisory'
    | '!restricted'
    | '!closed'
    | '!licensed-resources'
    | '!unavailable'
    | '!permission-required'
  )[]) | null;
  'items.locations.type': (string[]) | null;
  sort: string | null;
  sortOrder: string | null;
  'production.dates.from': string | null;
  'production.dates.to': string | null;
  _queryType: string | null;
  aggregations: (string[]) | null;
};

export type ImagesApiProps = {
  query: string | null;
  page: number | null;
  color: string | null;
}

export function worksRouteToApiUrl(
  worksRouteProps: WorksRouteProps,
  overrides: CatalogueWorksApiProps
): CatalogueWorksApiProps {
  return {
    query: worksRouteProps.query,
    page: worksRouteProps.page,
    workType: worksRouteProps.workType,
    'items.locations.locationType': worksRouteProps.itemsLocationsLocationType,
    'items.locations.type': worksRouteProps.itemsLocationsType,
    sort: worksRouteProps.sort,
    sortOrder: worksRouteProps.sortOrder,
    'production.dates.from': toIsoDateString(
      worksRouteProps.productionDatesFrom
    ),
    'production.dates.to': toIsoDateString(worksRouteProps.productionDatesTo),
    ...overrides,
  };
}

export function imagesRouteToApiUrl(
  imagesRouteProps: ImagesRouteProps
) {
  return {
    query: imagesRouteProps.query,
    page: imagesRouteProps.page,
    color: imagesRouteProps.color
  };
}

export const defaultWorkTypes = ['a', 'b', 'g', 'i', 'k', 'l', 'q'];

export function worksPropsToImagesProps(
  worksProps: CatalogueWorksApiProps
): CatalogueImagesApiProps {
  return {
    query: worksProps.query,
    page: worksProps.page,
    'locations.license': undefined,
    color: undefined,
  };
}
