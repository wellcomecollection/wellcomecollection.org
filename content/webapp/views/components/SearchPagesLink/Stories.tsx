import NextLink from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FunctionComponent } from 'react';

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
function toSearchStories(partialProps: Partial<StoriesProps>): LinkProps {
  const pathname = '/search/stories';
  const props: StoriesProps = {
    ...emptyStoriesProps,
    ...partialProps,
  };
  const query = toQuery(props);
  return {
    href: {
      pathname,
      query,
    },
  };
}
type Props = LinkFrom<StoriesProps>;
const StoriesLink: FunctionComponent<Props> = ({
  children,
  ...props
}: Props) => {
  return <NextLink {...toSearchStories(props)}>{children}</NextLink>;
};
export default StoriesLink;
export { toSearchStories, toQuery, fromQuery, emptyStoriesProps };
