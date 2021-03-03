import { ParsedUrlQuery } from 'querystring';
import NextLink from 'next/link';
import { LinkProps } from '../../../model/link-props';
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
} from '../../../utils/routes';
import { removeUndefinedProps } from '../../../utils/json';

const imagesPropsSources = [
  'search/paginator',
  'canonical_link',
  'images_search_context',
  'work_details/images',
  'unknown',
] as const;
type ImagesPropsSource = typeof imagesPropsSources[number];

export type ImagesProps = FromCodecMap<typeof codecMap>;

const emptyImagesProps: ImagesProps = {
  query: '',
  page: 1,
  'locations.license': [],
  color: undefined,
};

const codecMap = {
  query: stringCodec,
  page: numberCodec,
  'locations.license': csvCodec,
  color: maybeStringCodec,
};

const fromQuery: (params: ParsedUrlQuery) => ImagesProps = params => {
  return decodeQuery<ImagesProps>(params, codecMap);
};

const toQuery: (props: ImagesProps) => ParsedUrlQuery = props => {
  return encodeQuery<ImagesProps>(props, codecMap);
};

function toLink(
  partialProps: Partial<ImagesProps>,
  source: ImagesPropsSource
): LinkProps {
  const pathname = '/works';
  const props: ImagesProps = {
    ...emptyImagesProps,
    ...partialProps,
  };
  // It's a bit annoying that we have to `removeUndefinedProps`
  // here, but if we don't they come through as
  // urlProperty=&anotherUrlProperty=
  const query = removeUndefinedProps(toQuery(props));

  return {
    href: {
      pathname,
      query: { ...query, source },
    },
    as: {
      pathname,
      query: query,
    },
  };
}

type Props = LinkFrom<ImagesProps> & { source: ImagesPropsSource };
const ImagesLink: FunctionComponent<Props> = ({
  children,
  source,
  ...props
}: Props) => {
  return <NextLink {...toLink(props, source)}>{children}</NextLink>;
};

export default ImagesLink;
export { toLink, fromQuery, emptyImagesProps };
