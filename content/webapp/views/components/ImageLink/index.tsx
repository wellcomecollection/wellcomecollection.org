import NextLink from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FunctionComponent } from 'react';

import { LinkProps } from '@weco/common/model/link-props';
import {
  decodeQuery,
  encodeQuery,
  FromCodecMap,
  LinkFrom,
  maybeNumberCodec,
  stringCodec,
} from '@weco/common/utils/routes';

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

function toWorksImagesLink(partialProps: Partial<ImageProps>): LinkProps {
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
      },
    },
  };
}

type Props = LinkFrom<ImageProps>;

const ImageLink: FunctionComponent<Props> = ({ children, ...props }: Props) => {
  return <NextLink {...toWorksImagesLink(props)}>{children}</NextLink>;
};

export default ImageLink;
export { toWorksImagesLink, fromQuery, emptyImageProps };
