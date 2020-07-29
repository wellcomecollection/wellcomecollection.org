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

export type CatalogueWorksApiProps = {|
  query: ?string,
  page: ?number,
  workType: ?(string[]),
  'items.locations.locationType': ?(string[]),
  'items.locations.accessConditions.status': ?((
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
  )[]),
  sort: ?string,
  sortOrder: ?string,
  'production.dates.from': ?string,
  'production.dates.to': ?string,
  _queryType: ?string,
  aggregations: ?(string[]),
|};

export type CatalogueImagesApiProps = {|
  query: ?string,
  page: ?number,
  'locations.license': ?(string[]),
|};

export function worksRouteToApiUrl(
  worksRouteProps: WorksRouteProps,
  overrides: $Shape<CatalogueWorksApiProps>,
  useTestDefaultWorkTypes?: boolean
): CatalogueWorksApiProps {
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

export const defaultWorkTypes = ['a', 'b', 'g', 'i', 'k', 'l', 'q'];
export const testDefaultWorkTypes = [
  'a',
  'b',
  'g',
  'i',
  'k',
  'l',
  'q',
  'archive-collection',
];

export const defaultItemsLocationsLocationType = [
  'iiif-image',
  'iiif-presentation',
];
export const defaultAccessConditions = [
  '!open-with-advisory',
  '!restricted',
  '!closed',
];
export function worksRouteToApiUrlWithDefaults(
  worksRouteProps: WorksRouteProps,
  overrides: $Shape<CatalogueWorksApiProps>,
  useTestDefaultWorkTypes?: boolean
): CatalogueWorksApiProps {
  return {
    query: worksRouteProps.query,
    page: worksRouteProps.page,
    workType:
      worksRouteProps.workType.length > 0
        ? worksRouteProps.workType
        : useTestDefaultWorkTypes
        ? testDefaultWorkTypes
        : defaultWorkTypes,
    'items.locations.locationType':
      worksRouteProps.itemsLocationsLocationType.length > 0
        ? worksRouteProps.itemsLocationsLocationType
        : defaultItemsLocationsLocationType,
    'items.locations.accessConditions.status': defaultAccessConditions,
    sort: worksRouteProps.sort,
    sortOrder: worksRouteProps.sortOrder,
    'production.dates.from': toIsoDateString(
      worksRouteProps.productionDatesFrom
    ),
    'production.dates.to': toIsoDateString(worksRouteProps.productionDatesTo),
    ...overrides,
  };
}

// TODO: construct images endpoint params independently rather than extracting from works
export function worksPropsToImagesProps(
  worksProps: CatalogueWorksApiProps
): CatalogueImagesApiProps {
  return {
    query: worksProps.query,
    page: worksProps.page,
    'locations.license': undefined,
  };
}
