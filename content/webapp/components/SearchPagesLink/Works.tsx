import NextLink from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FunctionComponent } from 'react';

import { WorksLinkSource } from '@weco/common/data/segment-values';
import { LinkProps } from '@weco/common/model/link-props';
import {
  csvCodec,
  decodeQuery,
  encodeQuery,
  FromCodecMap,
  LinkFrom,
  maybeStringCodec,
  numberCodec,
  quotedCsvCodec,
  stringCodec,
} from '@weco/common/utils/routes';

const emptyWorksProps: WorksProps = {
  query: '',
  page: 1,
  workType: [],
  'items.locations.locationType': [],
  availabilities: [],
  languages: [],
  'genres.label': [],
  'genres.concepts': [],
  'subjects.label': [],
  'subjects.concepts': [],
  'contributors.agent.label': [],
  'contributors.concepts': [],
  sort: undefined,
  sortOrder: undefined,
  'partOf.title': undefined,
  'production.dates.from': undefined,
  'production.dates.to': undefined,
};

const codecMap = {
  query: stringCodec,
  page: numberCodec,
  workType: csvCodec,
  'items.locations.locationType': csvCodec,
  availabilities: csvCodec,
  languages: csvCodec,
  'genres.label': quotedCsvCodec,
  'genres.concepts': csvCodec,
  'subjects.label': quotedCsvCodec,
  'subjects.concepts': csvCodec,
  'contributors.agent.label': quotedCsvCodec,
  'contributors.concepts': csvCodec,
  sort: maybeStringCodec,
  sortOrder: maybeStringCodec,
  'partOf.title': maybeStringCodec,
  'production.dates.from': maybeStringCodec,
  'production.dates.to': maybeStringCodec,
};

export type WorksProps = FromCodecMap<typeof codecMap>;

const fromQuery: (params: ParsedUrlQuery) => WorksProps = params => {
  return decodeQuery<WorksProps>(params, codecMap);
};

const toQuery: (props: WorksProps) => ParsedUrlQuery = props => {
  return encodeQuery<WorksProps>(props, codecMap);
};

function toLink(
  partialProps: Partial<WorksProps>,
  source: WorksLinkSource
): LinkProps {
  const pathname = '/search/works';
  const props: WorksProps = {
    ...emptyWorksProps,
    ...partialProps,
  };
  const query = toQuery(props);

  return {
    href: {
      pathname,
      query: { ...query, source },
    },
    as: {
      pathname,
      query,
    },
  };
}

type Props = LinkFrom<WorksProps> & {
  source: WorksLinkSource;
};
const WorksLink: FunctionComponent<Props> = ({
  children,
  source,
  ...props
}: Props) => {
  return (
    <NextLink {...toLink(props, source)} legacyBehavior>
      {children}
    </NextLink>
  );
};

export default WorksLink;
export { toLink, toQuery, fromQuery, emptyWorksProps };
