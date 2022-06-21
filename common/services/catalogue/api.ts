import { quoteVal } from '../../utils/csv';
import { ImagesProps } from '../../views/components/ImagesLink/ImagesLink';
import { WorksProps } from '../../views/components/WorksLink/WorksLink';

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
  'partOf.title'?: string;
  'production.dates.from'?: string;
  'production.dates.to'?: string;
  'genres.label'?: string[];
  'subjects.label'?: string[];
  subjects?: string[];
  'contributors.agent.label'?: string[];
  languages?: string[];
  _queryType?: string;
  aggregations?: string[];
};

export type CatalogueImagesApiProps = {
  query?: string;
  page?: number;
  'locations.license'?: string[];
  'source.genres.label'?: string[];
  'source.subjects.label'?: string[];
  'source.contributors.agent.label'?: string[];
  color?: string;
  aggregations?: string[];
};

export type CatalogueConceptsApiProps = {
  page?: number;
};

export function worksRouteToApiUrl(
  worksProps: WorksProps,
  overrides: Partial<CatalogueWorksApiProps>
): CatalogueWorksApiProps {
  return {
    query: worksProps.query,
    page: worksProps.page,
    workType: worksProps.workType,
    'items.locations.locationType': worksProps['items.locations.locationType'],
    availabilities: worksProps.availabilities,
    sort: worksProps.sort,
    sortOrder: worksProps.sortOrder,
    'partOf.title': worksProps['partOf.title'],
    'production.dates.from': toIsoDateString(
      worksProps['production.dates.from']
    ),
    'production.dates.to': toIsoDateString(worksProps['production.dates.to']),
    languages: worksProps.languages,
    'genres.label': worksProps['genres.label'].map(quoteVal),
    'subjects.label': worksProps['subjects.label'].map(quoteVal),
    'contributors.agent.label':
      worksProps['contributors.agent.label'].map(quoteVal),
    ...overrides,
  };
}

export function imagesRouteToApiUrl(
  imagesRouteProps: ImagesProps,
  overrides: Partial<CatalogueImagesApiProps>
): CatalogueImagesApiProps {
  return {
    query: imagesRouteProps.query,
    page: imagesRouteProps.page,
    color: imagesRouteProps.color,
    'locations.license': imagesRouteProps['locations.license'],
    'source.genres.label':
      imagesRouteProps['source.genres.label'].map(quoteVal),
    'source.subjects.label':
      imagesRouteProps['source.subjects.label'].map(quoteVal),
    'source.contributors.agent.label':
      imagesRouteProps['source.contributors.agent.label'].map(quoteVal),
    ...overrides,
  };
}
