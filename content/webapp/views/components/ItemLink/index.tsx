// eslint-data-component: intentionally omitted
import { ParsedUrlQuery } from 'querystring';

import { LinkProps } from '@weco/common/model/link-props';
import { removeUndefinedProps } from '@weco/common/utils/json';
import {
  booleanCodec,
  decodeQuery,
  encodeQuery,
  FromCodecMap,
  maybeNumberCodec,
  maybeStringCodec,
} from '@weco/common/utils/routes';

const emptyItemProps: ItemProps = {
  canvas: 1,
  manifest: 1,
  query: '',
  page: 1,
  resultPosition: undefined,
  shouldScrollToCanvas: true,
};

const codecMap = {
  canvas: maybeNumberCodec,
  manifest: maybeNumberCodec,
  query: maybeStringCodec,
  page: maybeNumberCodec, // This is only needed by the NoScriptViewer
  resultPosition: maybeNumberCodec, // This used for tracking and tells us the position of the search result that linked to the item page. It doesn't get exposed in the url
  shouldScrollToCanvas: booleanCodec,
};

export type ItemProps = FromCodecMap<typeof codecMap>;

const fromQuery: (params: ParsedUrlQuery) => ItemProps = params => {
  return decodeQuery<ItemProps>(params, codecMap);
};

const toQuery: (props: ItemProps) => ParsedUrlQuery = props => {
  return encodeQuery<ItemProps>(props, codecMap);
};

type ToLinkProps = {
  workId: string;
  props: Partial<ItemProps>;
};

function toWorksItemLink({ workId, props }: ToLinkProps): LinkProps {
  const itemProps: ItemProps = {
    ...emptyItemProps,
    ...props,
  };
  const urlQuery = toQuery(itemProps);
  const { canvas, manifest, page, query, shouldScrollToCanvas } = urlQuery;

  return {
    href: {
      pathname: `/works/${workId}/items`,
      query: removeUndefinedProps({
        canvas,
        manifest,
        query,
        page,
        shouldScrollToCanvas,
      }),
    },
  };
}

export { toWorksItemLink, fromQuery, emptyItemProps };
