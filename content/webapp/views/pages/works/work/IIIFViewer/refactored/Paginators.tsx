import styled from 'styled-components';

import { arrow } from '@weco/common/icons';
import { LinkProps } from '@weco/common/model/link-props';
import Control from '@weco/common/views/components/Control';
import Rotator from '@weco/common/views/components/styled/Rotator';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { ItemViewerQuery } from '@weco/content/types/item-viewer';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';
import {
  getThumbnailsPageForCanvas,
  thumbnailsPageSize,
} from '@weco/content/views/pages/works/work/work.helpers';

const PaginatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledPaginatorButtons = styled.div`
  position: absolute;
  left: 12px;
  top: 12px;
`;

const PaginatorButtons = ({
  prevLink,
  nextLink,
}: {
  prevLink?: LinkProps;
  nextLink?: LinkProps;
}) => {
  return (
    <PaginatorWrapper>
      {prevLink && (
        <Space $v={{ size: 'xs', properties: ['margin-bottom'] }}>
          <Rotator $rotate={270}>
            <Control
              link={prevLink}
              colorScheme="light"
              icon={arrow}
              text="Previous page"
              scroll={false}
              replace
            />
          </Rotator>
        </Space>
      )}
      {nextLink && (
        <Space $v={{ size: 'xs', properties: ['margin-bottom'] }}>
          <Rotator $rotate={90}>
            <Control
              link={nextLink}
              colorScheme="light"
              icon={arrow}
              text="Next page"
              scroll={false}
              replace
            />
          </Rotator>
        </Space>
      )}
    </PaginatorWrapper>
  );
};

const getLink = ({
  pageNumber,
  link,
  matchingPage,
}: {
  pageNumber: number;
  link: LinkProps;
  matchingPage?: number;
}) => {
  return pageNumber && typeof link.href === 'object'
    ? {
        href: {
          ...link.href,
          query: {
            ...(typeof link.href.query === 'object' && link.href.query !== null
              ? link.href.query
              : {}),
            canvas: matchingPage ? pageNumber : undefined,
            // Keep thumbnails page in sync with the chosen canvas
            page: matchingPage || pageNumber,
          },
        },
      }
    : undefined;
};

// Shared by CanvasPaginator and ThumbnailsPaginator, which only differ in
// which query field is the current page, the page size, and whether the
// canvas number needs translating into its containing thumbnails page.
function usePaginatorLinks({
  getCurrentPage,
  pageSize,
  getMatchingPage,
}: {
  getCurrentPage: (query: ItemViewerQuery) => number;
  pageSize: number;
  getMatchingPage?: (pageNumber: number) => number;
}): { prevLink?: LinkProps; nextLink?: LinkProps } {
  const { work, query, transformedManifest } = useItemViewerContext();
  const { canvases } = { ...transformedManifest };

  const totalResults = canvases?.length || 1;
  const link = toWorksItemLink({
    workId: work.id,
    props: {
      canvas: query.canvas,
      page: query.page,
      manifest: query.manifest,
      query: query.query,
    },
  });

  const currentPage = getCurrentPage(query);
  const totalPages = Math.ceil(totalResults / pageSize);
  const next = currentPage < totalPages ? currentPage + 1 : 0;
  const prev = currentPage > 1 ? currentPage - 1 : 0;

  const prevLink = getLink({
    pageNumber: prev,
    matchingPage: getMatchingPage?.(prev),
    link,
  });
  const nextLink = getLink({
    pageNumber: next,
    matchingPage: getMatchingPage?.(next),
    link,
  });

  return { prevLink, nextLink };
}

export const CanvasPaginator = () => {
  const { prevLink, nextLink } = usePaginatorLinks({
    getCurrentPage: query => query.canvas,
    pageSize: 1,
    getMatchingPage: pageNumber =>
      getThumbnailsPageForCanvas({ canvasNumber: pageNumber }),
  });

  return (
    <StyledPaginatorButtons>
      <PaginatorButtons prevLink={prevLink} nextLink={nextLink} />
    </StyledPaginatorButtons>
  );
};

export const ThumbnailsPaginator = () => {
  const { prevLink, nextLink } = usePaginatorLinks({
    getCurrentPage: query => query.page,
    pageSize: thumbnailsPageSize,
  });

  return (
    <StyledPaginatorButtons>
      <PaginatorButtons prevLink={prevLink} nextLink={nextLink} />
    </StyledPaginatorButtons>
  );
};

export default ThumbnailsPaginator;
