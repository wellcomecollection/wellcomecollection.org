import NextLink, { LinkProps } from 'next/link';
import { FunctionComponent } from 'react';
import {
  toCsv,
  toMaybeString,
  toString,
  toNumber,
  toSource,
  QueryTo,
  LinkFrom,
} from '../../../utils/routes';

const worksPropsSources = ['search_form'] as const;
type WorksPropsSource = typeof worksPropsSources[number];

type WorksProps = {
  query: string;
  page: number;
  workType: string[];
  sort?: string;
  sortOrder?: string;
  itemsLocationsLocationType: string[];
  itemsLocationsType: string[];
  productionDatesFrom?: string;
  productionDatesTo?: string;
  source: WorksPropsSource | 'unknown';
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
    productionDatesFrom: toMaybeString(params['production.dates.from']),
    productionDatesTo: toMaybeString(params['production.dates.to']),
    source: toSource(params.source, worksPropsSources) || 'unknown',
  };
};

function toLink(params: WorksProps): LinkProps {
  const pathname = '/works';
  const { source, ...paramsWithoutSource } = params;

  return {
    href: {
      pathname,
      query: { ...params },
    },
    as: {
      pathname,
      query: { ...paramsWithoutSource },
    },
  };
}

type Props = LinkFrom<WorksProps>;
const WorksLink: FunctionComponent<Props> = ({ children, ...props }: Props) => {
  return <NextLink {...toLink(props)}>{children}</NextLink>;
};

export default WorksLink;
export { toLink, fromQuery };
