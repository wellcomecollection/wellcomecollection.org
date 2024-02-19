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
} from '@weco/common/utils/routes';
import { LinkProps } from '@weco/common/model/link-props';
import { ImageLinkSource } from '@weco/common/data/segment-values';

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
  source: ImageLinkSource,
  sourcePath?: string
): LinkProps {
  const props: ImageProps = {
    ...emptyImageProps,
    ...partialProps,
  };
  const query = toQuery(props);

  return {
    href: {
      pathname: '/works/[workId]/images',
      query: {
        workId: props.workId,
        ...query,
        source,
        sourcePath,
      },
    },
    as: {
      pathname: `/works/${props.workId}/images`,
      query: {
        id: props.id,
      },
    },
  };
}

type Props = LinkFrom<ImageProps> & {
  source: ImageLinkSource;
  sourcePath?: string;
};

const ImageLink: FunctionComponent<Props> = ({
  children,
  source,
  sourcePath,
  ...props
}: Props) => {
  return (
    <NextLink {...toLink(props, source, sourcePath)} legacyBehavior>
      {children}
    </NextLink>
  );
};

export default ImageLink;
export { toLink, fromQuery, emptyImageProps };
