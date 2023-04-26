import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import { ParsedUrlQuery } from 'querystring';
import {
  booleanCodec,
  decodeQuery,
  encodeQuery,
  FromCodecMap,
  LinkFrom,
  maybeNumberCodec,
  stringCodec,
} from '@weco/common/utils/routes';
import { LinkProps } from '@weco/common/model/link-props';
import { ItemLinkSource } from '@weco/common/data/segment-sources';

const emptyItemProps: ItemProps = {
  workId: '',
  canvas: 1,
  page: 1,
  manifest: 1,
  pageSize: undefined,
  isOverview: false,
  resultPosition: undefined,
};

const codecMap = {
  workId: stringCodec,
  canvas: maybeNumberCodec,
  page: maybeNumberCodec,
  pageSize: maybeNumberCodec,
  isOverview: booleanCodec,
  resultPosition: maybeNumberCodec,
  manifest: maybeNumberCodec,
};

export type ItemProps = FromCodecMap<typeof codecMap>;

const fromQuery: (params: ParsedUrlQuery) => ItemProps = params => {
  return decodeQuery<ItemProps>(params, codecMap);
};

const toQuery: (props: ItemProps) => ParsedUrlQuery = props => {
  return encodeQuery<ItemProps>(props, codecMap);
};

function toLink(
  partialProps: Partial<ItemProps>,
  source: ItemLinkSource
): LinkProps {
  const props: ItemProps = {
    ...emptyItemProps,
    ...partialProps,
  };
  const query = toQuery(props);

  return {
    href: {
      pathname: '/works/[workId]/items',
      query: { ...query, source },
    },
    as: {
      pathname: `/works/${props.workId}/items`,
      query: {},
    },
  };
}

type Props = LinkFrom<ItemProps> & { source: ItemLinkSource };

const ItemLink: FunctionComponent<Props> = ({
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

export default ItemLink;
export { toLink, fromQuery, emptyItemProps };
