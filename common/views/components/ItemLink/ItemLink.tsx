import NextLink, { LinkProps } from 'next/link';
import { FunctionComponent } from 'react';
import {
  LinkFrom,
  QueryTo,
  toMaybeNumber,
  toMaybeString,
  toSource,
  toString,
} from '../../../utils/routes';

const itemPropsSources = ['images_search_result', 'viewer/paginator'] as const;
type ItemPropsSource = typeof itemPropsSources[number];

export type ItemProps = {
  workId: string;
  canvas?: number;
  page?: number;
  pageSize?: number;
  langCode?: string;
  sierraId?: string;
  isOverview?: boolean;
  resultPosition?: number;
  source: ItemPropsSource | 'unknown';
};

const fromQuery: QueryTo<ItemProps> = params => {
  return {
    workId: toString(params.workId, ''),
    canvas: toMaybeNumber(params.canvas),
    page: toMaybeNumber(params.page),
    pageSize: toMaybeNumber(params.pageSize),
    langCode: toMaybeString(params.langCode),
    sierraId: toMaybeString(params.sierraId),
    isOverview: Boolean(params.isOverview),
    resultPosition: toMaybeNumber(params.resultPosition),
    source: toSource(params.source, itemPropsSources) || 'unknown',
  };
};

function toLink({ workId, source, ...params }: ItemProps): LinkProps {
  return {
    href: {
      pathname: `/item`,
      query: {
        workId,
        source,
        ...params,
      },
    },
    as: {
      pathname: `/works/${workId}/items`,
      query: { ...params },
    },
  };
}

type Props = LinkFrom<ItemProps>;
const ItemLink: FunctionComponent<Props> = ({
  workId,
  sierraId,
  langCode,
  canvas = 1,
  isOverview,
  page = 1,
  pageSize = 4,
  resultPosition,
  source,
  children,
  ...linkProps
}: Props) => {
  return (
    <NextLink
      {...toLink({
        workId,
        source,
        langCode,
        canvas,
        sierraId,
        isOverview,
        page,
        pageSize,
        resultPosition,
      })}
      {...linkProps}
    >
      {children}
    </NextLink>
  );
};

export default ItemLink;
export { toLink, fromQuery };
