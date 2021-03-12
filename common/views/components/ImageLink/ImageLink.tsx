import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import { ParsedUrlQuery } from 'querystring';
import {
  decodeQuery,
  encodeQuery,
  FromCodecMap,
  LinkFrom,
  maybeNumberCodec,
  stringCodec,
} from '../../../utils/routes';
import { LinkProps } from '../../../model/link-props';
import { removeUndefinedProps } from '../../../utils/json';

const imagePropsSources = ['images_search_result', 'viewer/paginator'] as const;
type ImagePropsSource = typeof imagePropsSources[number];

const emptyImageProps: ImageProps = {
  id: '',
  workId: '',
  resultPosition: undefined,
};

const codecMap = {
  id: stringCodec,
  workId: stringCodec,
  resultPosition: maybeNumberCodec,
};

export type ImageProps = FromCodecMap<typeof codecMap>;

const fromQuery: (params: ParsedUrlQuery) => ImageProps = params => {
  return decodeQuery<ImageProps>(params, codecMap);
};

const toQuery: (props: ImageProps) => ParsedUrlQuery = props => {
  return encodeQuery<ImageProps>(props, codecMap);
};

function toLink(
  partialProps: Partial<ImageProps>,
  source: ImagePropsSource
): LinkProps {
  const pathname = '/works';
  const props: ImageProps = {
    ...emptyImageProps,
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

type Props = LinkFrom<ImageProps> & { source: ImagePropsSource };

const WorksLink: FunctionComponent<Props> = ({
  children,
  source,
  ...props
}: Props) => {
  return <NextLink {...toLink(props, source)}>{children}</NextLink>;
};

export default WorksLink;
export { toLink, fromQuery, emptyImageProps };
