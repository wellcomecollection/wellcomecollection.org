import styled from 'styled-components';

import { arrow } from '@weco/common/icons';
import { LinkProps } from '@weco/common/model/link-props';
import Control from '@weco/common/views/components/Control';
import Rotator from '@weco/common/views/components/styled/Rotator';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';

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
              scroll={false}
              replace={true}
              link={prevLink}
              colorScheme="light"
              icon={arrow}
              text="Previous page"
            />
          </Rotator>
        </Space>
      )}
      {nextLink && (
        <Space $v={{ size: 'xs', properties: ['margin-bottom'] }}>
          <Rotator $rotate={90}>
            <Control
              scroll={false}
              replace={true}
              link={nextLink}
              colorScheme="light"
              icon={arrow}
              text="Next page"
            />
          </Rotator>
        </Space>
      )}
    </PaginatorWrapper>
  );
};

export const thumbnailsPageSize = 6;

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

export const CanvasPaginator = () => {
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
  const currentPage = query.canvas;
  const pageSize = 1;
  const totalPages = Math.ceil(totalResults / pageSize);
  const next = currentPage < totalPages ? currentPage + 1 : 0;
  const prev = currentPage > 1 ? currentPage - 1 : 0;
  const matchingNextPage = Math.ceil(next / thumbnailsPageSize);
  const matchingPreviousPage = Math.ceil(prev / thumbnailsPageSize);

  const prevLink = getLink({
    pageNumber: prev,
    matchingPage: matchingPreviousPage,
    link,
  });
  const nextLink = getLink({
    pageNumber: next,
    matchingPage: matchingNextPage,
    link,
  });

  return (
    <StyledPaginatorButtons>
      <PaginatorButtons prevLink={prevLink} nextLink={nextLink} />
    </StyledPaginatorButtons>
  );
};

export const ThumbnailsPaginator = () => {
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
  const currentPage = query.page;
  const totalPages = Math.ceil(totalResults / thumbnailsPageSize);
  const next = currentPage < totalPages ? currentPage + 1 : 0;
  const prev = currentPage > 1 ? currentPage - 1 : 0;

  const prevLink = getLink({ pageNumber: prev, link });
  const nextLink = getLink({ pageNumber: next, link });

  return (
    <StyledPaginatorButtons>
      <PaginatorButtons prevLink={prevLink} nextLink={nextLink} />
    </StyledPaginatorButtons>
  );
};

export default ThumbnailsPaginator;
