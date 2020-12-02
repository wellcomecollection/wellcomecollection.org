import NextLink, { LinkProps } from 'next/link';
import { FunctionComponent, PropsWithChildren } from 'react';

type WorkLinkSource = 'works_search_result';

// We remove `href` and `as` because we contruct those ourselves
// in the component.
type Props = {
  workId: string;
  canvas: number;
  page: number;
  pageSize: number;
  langCode?: string;
  sierraId?: string;
  isOverview?: boolean;
} & Omit<LinkProps, 'as' | 'href'>;

const ItemLink: FunctionComponent<PropsWithChildren<Props>> = ({
  workId,
  langCode = 'eng',
  canvas,
  sierraId,
  isOverview,
  page,
  pageSize,
  children,
  ...linkProps
}: PropsWithChildren<Props>) => {
  return (
    <NextLink
      href={{
        pathname: `/item`,
        query: {
          workId,
          langCode,
          canvas,
          sierraId,
          isOverview,
          page,
          pageSize,
        },
      }}
      as={{
        pathname: `/works/${workId}/items`,
      }}
      {...linkProps}
    >
      {children}
    </NextLink>
  );
};

export default ItemLink;
