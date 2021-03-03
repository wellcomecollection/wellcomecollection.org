import { quoteVal } from '../../utils/csv';
import { ImagesProps } from '../../views/components/ImagesLink/ImagesLink';
import { WorksProps } from '../../views/components/WorksLink/WorksLink';

export type CatalogueImagesApiProps = {
  query: string | undefined;
  page: number | undefined;
  'locations.license': string[] | undefined;
  color: string | undefined;
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
  availabilities?: string[];
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
    availabilities: worksProps.availabilities,
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
  imagesRouteProps: ImagesProps
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
    query: worksProps.query ?? undefined,
    page: worksProps.page ?? undefined,
    'locations.license': undefined,
    color: undefined,
  };
}
