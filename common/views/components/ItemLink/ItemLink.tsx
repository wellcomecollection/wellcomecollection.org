import NextLink, { LinkProps } from 'next/link';
import { FunctionComponent, PropsWithChildren } from 'react';

type ItemLinkSource = 'images_search_result' | 'viewer/paginator';

export type ItemQueryParams = {
  workId: string;
  canvas?: number;
  page?: number;
  pageSize?: number;
  langCode?: string;
  sierraId?: string;
  isOverview?: boolean;
  source: ItemLinkSource;
};

// We remove `href` and `as` because we contruct those ourselves
// in the component.
type Props = ItemQueryParams & Omit<LinkProps, 'as' | 'href'>;

export function itemLink({
  workId,
  source,
  ...params
}: ItemQueryParams): LinkProps {
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

const ItemLink: FunctionComponent<PropsWithChildren<Props>> = ({
  workId,
  sierraId,
  langCode,
  canvas = 1,
  isOverview,
  page = 1,
  pageSize = 4,
  source,
  children,
  ...linkProps
}: PropsWithChildren<Props>) => {
  return (
    <NextLink
      {...itemLink({
        workId,
        source,
        langCode,
        canvas,
        sierraId,
        isOverview,
        page,
        pageSize,
      })}
      {...linkProps}
    >
      {children}
    </NextLink>
  );
};

export default ItemLink;
