import { quoteVal } from '../../utils/csv';
import { WorksProps } from '../../views/components/WorksLink/WorksLink';
import { ImagesRouteProps } from './ts_routes';

export type CatalogueImagesApiProps = {
  query: string | null;
  page: number | null;
  'locations.license': string[] | null;
  color: string | null;
};

function toIsoDateString(s: string): string {
  try {
    return new Date(s).toISOString().split('T')[0];
  } catch (e) {
    return s;
  }
}

type ItemsLocationsAccessConditionsStatus =
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
  | '!permission-required';

export type CatalogueWorksApiProps = {
  query?: string;
  page?: number;
  workType?: string[];
  'items.locations.locationType'?: string[];
  'items.locations.accessConditions.status'?: ItemsLocationsAccessConditionsStatus;
  'items.locations.type'?: string[];
  sort?: string;
  sortOrder?: string;
  'production.dates.from'?: string;
  'production.dates.to'?: string;
  'genres.label'?: string[];
  'subjects.label'?: string[];
  'contributors.agent.label'?: string[];
  languages?: string[];
  _queryType?: string;
  aggregations?: string[];
};

export function worksRouteToApiUrl(
  worksProps: WorksProps,
  overrides: Partial<CatalogueWorksApiProps>
): CatalogueWorksApiProps {
  return {
    query: worksProps.query,
    page: worksProps.page,
    workType: worksProps.workType,
    'items.locations.locationType': worksProps.itemsLocationsLocationType,
    'items.locations.type': worksProps.itemsLocationsType,
    sort: worksProps.sort,
    sortOrder: worksProps.sortOrder,
    'production.dates.from': worksProps.productionDatesFrom
      ? toIsoDateString(worksProps.productionDatesFrom)
      : undefined,
    'production.dates.to': worksProps.productionDatesTo
      ? toIsoDateString(worksProps.productionDatesTo)
      : undefined,
    languages: worksProps.languages,
    'genres.label': worksProps.genresLabel.map(quoteVal),
    'subjects.label': worksProps.subjectsLabel.map(quoteVal),
    'contributors.agent.label': worksProps.contributorsAgentLabel.map(quoteVal),
    ...overrides,
  };
}

export function imagesRouteToApiUrl(
  imagesRouteProps: ImagesRouteProps
): CatalogueImagesApiProps {
  return {
    query: imagesRouteProps.query,
    page: imagesRouteProps.page,
    color: imagesRouteProps.color,
    'locations.license': imagesRouteProps.locationsLicense,
  };
}

// TODO: construct images endpoint params independently rather than extracting from works
export function worksPropsToImagesProps(
  worksProps: CatalogueWorksApiProps
): CatalogueImagesApiProps {
  return {
    query: worksProps.query || null,
    page: worksProps.page || null,
    'locations.license': null,
    color: null,
  };
}
