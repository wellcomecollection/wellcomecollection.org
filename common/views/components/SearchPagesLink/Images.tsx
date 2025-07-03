import NextLink from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FunctionComponent } from 'react';

import { ImagesLinkSource } from '@weco/common/data/segment-values';
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

export type ImagesProps = FromCodecMap<typeof codecMap>;

const emptyImagesProps: ImagesProps = {
  query: '',
  page: 1,
  'locations.license': [],
  'source.genres.label': [],
  'source.production.dates.to': undefined,
  'source.production.dates.from': undefined,
  'source.genres.concepts': [],
  'source.subjects.label': [],
  'source.subjects.concepts': [],
  'source.contributors.agent.label': [],
  'source.contributors.concepts': [],
  color: undefined,
  sort: undefined,
  sortOrder: undefined,
};

const codecMap = {
  query: stringCodec,
  page: numberCodec,
  'locations.license': csvCodec,
  'source.genres.label': quotedCsvCodec,
  'source.production.dates.to': maybeStringCodec,
  'source.production.dates.from': maybeStringCodec,
  'source.genres.concepts': csvCodec,
  'source.subjects.label': quotedCsvCodec,
  'source.subjects.concepts': csvCodec,
  'source.contributors.agent.label': quotedCsvCodec,
  'source.contributors.concepts': csvCodec,
  color: maybeStringCodec,
  sort: maybeStringCodec,
  sortOrder: maybeStringCodec,
};

const fromQuery: (params: ParsedUrlQuery) => ImagesProps = params => {
  return decodeQuery<ImagesProps>(params, codecMap);
};

const toQuery: (props: ImagesProps) => ParsedUrlQuery = props => {
  return encodeQuery<ImagesProps>(props, codecMap);
};

function toLink(
  partialProps: Partial<ImagesProps>,
  source: ImagesLinkSource
): LinkProps {
  const pathname = '/search/images';
  const props: ImagesProps = {
    ...emptyImagesProps,
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

type Props = LinkFrom<ImagesProps> & { source: ImagesLinkSource };
const ImagesLink: FunctionComponent<Props> = ({
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

export default ImagesLink;
export { toLink, toQuery, fromQuery, emptyImagesProps };
