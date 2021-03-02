import NextLink from 'next/link';
import { LinkProps } from '../../../model/link-props';
import { FunctionComponent } from 'react';
import {
  toCsv,
  toMaybeString,
  toString,
  toNumber,
  toSource,
  QueryTo,
  LinkFrom,
  toQuotedCsv,
  propsToQuery,
} from '../../../utils/routes';
import { Prefix } from '../../../utils/utility-types';

const worksPropsSources = [
  'search_form',
  'canonical_link',
  'meta_link',
  'search/paginator',
  'works_search_context',
] as const;
// Currently we allow all strings as I can't get the Prefix to work
// when compiling strings e.g. `cancel_filter/${value}`
// TODO make this work
type WorksPropsSource =
  | typeof worksPropsSources[number]
  | Prefix<'cancel_filter/'>
  | string;

export type WorksProps = {
  query: string;
  page: number;
  workType: string[];
  itemsLocationsLocationType: string[];
  itemsLocationsType: string[];
  languages: string[];
  genresLabel: string[];
  subjectsLabel: string[];
  contributorsAgentLabel: string[];
  sort?: string;
  sortOrder?: string;
  productionDatesFrom?: string;
  productionDatesTo?: string;
  source: WorksPropsSource | 'unknown';
};

const emptyWorksProps: WorksProps = {
  query: '',
  page: 1,
  workType: [],
  itemsLocationsLocationType: [],
  itemsLocationsType: [],
  languages: [],
  genresLabel: [],
  subjectsLabel: [],
  contributorsAgentLabel: [],
  source: 'unknown',
};

// This is a hack for now until we stop using different keys
const keyToQueryMap = {
  query: 'query',
  page: 'page',
  workType: 'workType',
  sort: 'sort',
  sortOrder: 'sortOrder',
  itemsLocationsLocationType: 'items.locations.locationType',
  itemsLocationsType: 'items.locations.type',
  languages: 'languages',
  genresLabel: 'genres.label',
  subjectsLabel: 'subjects.label',
  contributorsAgentLabel: 'contributors.agent.label',
  productionDatesFrom: 'production.dates.from',
  productionDatesTo: 'production.dates.to',
  source: 'source',
};

const fromQuery: QueryTo<WorksProps> = params => {
  return {
    query: toString(params.query, ''),
    page: toNumber(params.page, 1),
    workType: toCsv(params.workType),
    sort: toMaybeString(params.sort),
    sortOrder: toMaybeString(params.sortOrder),
    itemsLocationsLocationType: toCsv(params['items.locations.locationType']),
    itemsLocationsType: toCsv(params['items.locations.type']),
    languages: toCsv(params.languages),
    genresLabel: toQuotedCsv(params['genres.label']),
    subjectsLabel: toQuotedCsv(params['subjects.label']),
    contributorsAgentLabel: toQuotedCsv(params['contributors.agent.label']),
    productionDatesFrom: toMaybeString(params['production.dates.from']),
    productionDatesTo: toMaybeString(params['production.dates.to']),
    source: toSource(params.source, worksPropsSources) || 'unknown',
  };
};

function toLink(props: WorksProps): LinkProps {
  const pathname = '/works';
  const { source, ...propsWithoutSource } = props;
  const remapped = Object.entries(propsWithoutSource).reduce(
    (acc, [key, val]) => {
      return {
        ...acc,
        [keyToQueryMap[key]]: val,
      };
    },
    {}
  );

  return {
    href: {
      pathname,
      query: propsToQuery({ ...remapped, source }),
    },
    as: {
      pathname,
      query: propsToQuery({ ...remapped }),
    },
  };
}

type Props = LinkFrom<WorksProps>;
const WorksLink: FunctionComponent<Props> = ({ children, ...props }: Props) => {
  return <NextLink {...toLink(props)}>{children}</NextLink>;
};

export default WorksLink;
export { toLink, fromQuery, emptyWorksProps };
