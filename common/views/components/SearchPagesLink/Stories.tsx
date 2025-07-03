import NextLink from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FunctionComponent } from 'react';

import { StoriesLinkSource } from '@weco/common/data/segment-values';
import { LinkProps } from '@weco/common/model/link-props';
import {
  csvCodec,
  decodeQuery,
  encodeQuery,
  FromCodecMap,
  LinkFrom,
  numberCodec,
  stringCodec,
} from '@weco/common/utils/routes';

export type StoriesProps = FromCodecMap<typeof codecMap>;
const emptyStoriesProps: StoriesProps = {
  query: '',
  page: 1,
  format: [],
  'contributors.contributor': [],
};
const codecMap = {
  query: stringCodec,
  page: numberCodec,
  format: csvCodec,
  'contributors.contributor': csvCodec,
};
const fromQuery: (params: ParsedUrlQuery) => StoriesProps = params => {
  return decodeQuery<StoriesProps>(params, codecMap);
};
const toQuery: (props: StoriesProps) => ParsedUrlQuery = props => {
  return encodeQuery<StoriesProps>(props, codecMap);
};
function toLink(
  partialProps: Partial<StoriesProps>,
  source: StoriesLinkSource
): LinkProps {
  const pathname = '/search/stories';
  const props: StoriesProps = {
    ...emptyStoriesProps,
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
type Props = LinkFrom<StoriesProps> & { source: StoriesLinkSource };
const StoriesLink: FunctionComponent<Props> = ({
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
export default StoriesLink;
export { toLink, toQuery, fromQuery, emptyStoriesProps };
