import { ParsedUrlQuery } from 'querystring';
import NextLink from 'next/link';
import { LinkProps } from '@weco/common/model/link-props';
import { FunctionComponent } from 'react';
import {
  LinkFrom,
  stringCodec,
  numberCodec,
  csvCodec,
  FromCodecMap,
  encodeQuery,
  decodeQuery,
} from '@weco/common/utils/routes';
import { StoriesLinkSource } from '@weco/content/data/segment-values';
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
