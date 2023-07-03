import { ParsedUrlQuery } from 'querystring';
import NextLink from 'next/link';
import { LinkProps } from '@weco/common/model/link-props';
import { FunctionComponent } from 'react';
import {
  LinkFrom,
  maybeStringCodec,
  stringCodec,
  numberCodec,
  csvCodec,
  FromCodecMap,
  encodeQuery,
  decodeQuery,
  quotedCsvCodec,
} from '@weco/common/utils/routes';
import { ImagesLinkSource } from '@weco/common/data/segment-values';

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
  'source.contributors.agent.label': [],
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
  'source.contributors.agent.label': quotedCsvCodec,
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
