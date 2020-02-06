// @flow
import { type WorksRouteProps } from './routes';

function toIsoDateString(s: ?string): ?string {
  if (s) {
    try {
      return new Date(s).toISOString().split('T')[0];
    } catch (e) {
      return null;
    }
  }
  return null;
}

export type CatalogueApiProps = {|
  query: ?string,
  page: ?number,
  workType: ?(string[]),
  'items.locations.locationType': ?(string[]),
  sort: ?string,
  sortOrder: ?string,
  'production.dates.from': ?string,
  'production.dates.to': ?string,
  _queryType: ?string,
  aggregations: ?(string[]),
|};

export type TrackingProps = {|
  ...CatalogueApiProps,
  source: string,
|};

export function worksRouteToApiUrl(
  worksRouteProps: WorksRouteProps,
  overrides: $Shape<CatalogueApiProps>
): CatalogueApiProps {
  return {
    query: worksRouteProps.query,
    page: worksRouteProps.page,
    workType: worksRouteProps.workType,
    'items.locations.locationType': worksRouteProps.itemsLocationsLocationType,
    sort: worksRouteProps.sort,
    sortOrder: worksRouteProps.sortOrder,
    'production.dates.from': toIsoDateString(
      worksRouteProps.productionDatesFrom
    ),
    'production.dates.to': toIsoDateString(worksRouteProps.productionDatesTo),
    ...overrides,
  };
}

export const defaultWorkTypes = ['a', 'g', 'i', 'k', 'l', 'q'];
export const defaultItemsLocationsLocationType = [
  'iiif-image',
  'iiif-presentation',
];
export function worksRouteToApiUrlWithDefaults(
  worksRouteProps: WorksRouteProps,
  overrides: $Shape<CatalogueApiProps>
): CatalogueApiProps {
  return {
    query: worksRouteProps.query,
    page: worksRouteProps.page,
    workType:
      worksRouteProps.workType.length > 0
        ? worksRouteProps.workType
        : defaultWorkTypes,
    'items.locations.locationType':
      worksRouteProps.itemsLocationsLocationType.length > 0
        ? worksRouteProps.itemsLocationsLocationType
        : defaultItemsLocationsLocationType,
    sort: worksRouteProps.sort,
    sortOrder: worksRouteProps.sortOrder,
    'production.dates.from': toIsoDateString(
      worksRouteProps.productionDatesFrom
    ),
    'production.dates.to': toIsoDateString(worksRouteProps.productionDatesTo),
    ...overrides,
  };
}
