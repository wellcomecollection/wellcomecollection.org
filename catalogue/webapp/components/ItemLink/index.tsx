import { ParsedUrlQuery } from 'querystring';
import {
  decodeQuery,
  encodeQuery,
  FromCodecMap,
  maybeNumberCodec,
  booleanCodec,
  stringCodec,
} from '@weco/common/utils/routes';
import { LinkProps } from '@weco/common/model/link-props';
import { ItemLinkSource } from '@weco/common/data/segment-values';
import { removeUndefinedProps } from '@weco/common/utils/json';

const emptyItemProps: ItemProps = {
  workId: '',
  resultPosition: undefined,
  canvas: 1,
  manifest: 1,
  page: 1,
  shouldScrollToCanvas: true,
};

const codecMap = {
  workId: stringCodec,
  resultPosition: maybeNumberCodec, // This used for tracking and tells us the position of the search result that linked to the item page. It doesn't get exposed in the url
  canvas: maybeNumberCodec,
  manifest: maybeNumberCodec,
  page: maybeNumberCodec, // This is only needed by the NoScriptViewer
  shouldScrollToCanvas: booleanCodec,
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
  const { canvas, manifest, page } = query;
  return {
    href: {
      pathname: '/works/[workId]/items',
      query: { ...query, source },
    },
    as: {
      pathname: `/works/${props.workId}/items`,
      query: removeUndefinedProps({ canvas, manifest, page }),
    },
  };
}

export { toLink, fromQuery, emptyItemProps };
