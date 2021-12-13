import { WorksRouteProps } from './routes';

function toIsoDateString(s: string | undefined): string | undefined {
  if (s) {
    try {
      return new Date(s).toISOString().split('T')[0];
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
}

export type CatalogueWorksApiProps = {
  query?: string;
  page?: number;
  workType?: string[];
  'items.locations.locationType'?: string[];
  'items.locations.accessConditions.status'?: (
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
  )[];
  availabilities?: string[];
  sort?: string;
  sortOrder?: string;
  'production.dates.from'?: string;
  'production.dates.to'?: string;
  _queryType?: string;
  aggregations?: string[];
};

export type CatalogueImagesApiProps = {
  query?: string;
  page?: number;
  'locations.license'?: string[];
  'source.genres.label'?: string[];
  'source.contributors.agent.label'?: string[];
  color?: string;
};

export function worksRouteToApiUrl(
  worksRouteProps: WorksRouteProps,
  overrides: CatalogueWorksApiProps
): CatalogueWorksApiProps {
  return {
    query: worksRouteProps.query,
    page: worksRouteProps.page,
    workType: worksRouteProps.workType,
    'items.locations.locationType': worksRouteProps.itemsLocationsLocationType,
    availabilities: worksRouteProps.availabilities,
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
    'source.genres.label': undefined,
    'source.contributors.agent.label': undefined,
    color: undefined,
  };
}
