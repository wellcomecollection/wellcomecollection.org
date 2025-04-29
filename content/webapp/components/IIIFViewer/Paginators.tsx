import { useContext } from 'react';
import styled from 'styled-components';

import { arrow } from '@weco/common/icons';
import { LinkProps } from '@weco/common/model/link-props';
import Control from '@weco/common/views/components/Control';
import Rotator from '@weco/common/views/components/styled/Rotator';
import Space from '@weco/common/views/components/styled/Space';
import { toLink as itemLink } from '@weco/content/components/ItemLink';
import ItemViewerContext from '@weco/content/components/ItemViewerContext';

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
        <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
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
        <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
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

export const CanvasPaginator = () => {
  const { work, query, transformedManifest } = useContext(ItemViewerContext);
  const { canvases } = { ...transformedManifest };
  const totalResults = canvases?.length || 1;
  const link = itemLink({
    workId: work.id,
    props: {
      canvas: query.canvas,
      page: query.page,
      manifest: query.manifest,
      query: query.query,
    },
    source: 'viewer/paginator',
  });
  const currentPage = query.canvas;
  const pageSize = 1;
  const totalPages = Math.ceil(totalResults / pageSize);
  const next = currentPage < totalPages ? currentPage + 1 : 0;
  const prev = currentPage > 1 ? currentPage - 1 : 0;
  const matchingNextPage = Math.ceil(next / thumbnailsPageSize);
  const matchingPreviousPage = Math.ceil(prev / thumbnailsPageSize);
  const prevLink = prev
    ? {
        href: {
          ...link.href,
          query: {
            ...link.href.query,
            canvas: prev,
            // Keep thumbnails page in sync with the chosen canvas
            page: matchingPreviousPage,
          },
        },
        as: {
          ...link.as,
          query: {
            ...link.as.query,
            canvas: prev,
            // Keep thumbnails page in sync with the chosen canvas
            page: matchingPreviousPage,
          },
        },
      }
    : undefined;

  const nextLink = next
    ? {
        href: {
          ...link.href,
          query: {
            ...link.href.query,
            canvas: next,
            // Keep thumbnails page in sync with the chosen canvas
            page: matchingNextPage,
          },
        },
        as: {
          ...link.as,
          query: {
            ...link.as.query,
            canvas: next,
            // Keep thumbnails page in sync with the chosen canvas
            page: matchingNextPage,
          },
        },
      }
    : undefined;

  return (
    <StyledPaginatorButtons>
      <PaginatorButtons prevLink={prevLink} nextLink={nextLink} />
    </StyledPaginatorButtons>
  );
};

export const ThumbnailsPaginator = () => {
  const { work, query, transformedManifest } = useContext(ItemViewerContext);
  const { canvases } = { ...transformedManifest };
  const totalResults = canvases?.length || 1;
  const link = itemLink({
    workId: work.id,
    props: {
      canvas: query.canvas,
      page: query.page,
      manifest: query.manifest,
      query: query.query,
    },
    source: 'viewer/paginator',
  });
  const currentPage = query.page;
  const totalPages = Math.ceil(totalResults / thumbnailsPageSize);
  const next = currentPage < totalPages ? currentPage + 1 : 0;
  const prev = currentPage > 1 ? currentPage - 1 : 0;
  const prevLink = prev
    ? {
        href: {
          ...link.href,
          query: {
            ...link.href.query,
            page: prev,
          },
        },
        as: {
          ...link.as,
          query: {
            ...link.as.query,
            page: prev,
          },
        },
      }
    : undefined;

  const nextLink = next
    ? {
        href: {
          ...link.href,
          query: {
            ...link.href.query,
            page: next,
          },
        },
        as: {
          ...link.as,
          query: {
            ...link.as.query,
            page: next,
          },
        },
      }
    : undefined;

  return (
    <StyledPaginatorButtons>
      <PaginatorButtons prevLink={prevLink} nextLink={nextLink} />
    </StyledPaginatorButtons>
  );
};

export default ThumbnailsPaginator;
