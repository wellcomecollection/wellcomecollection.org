import NextLink from 'next/link';
import { useContext } from 'react';
import styled from 'styled-components';

import { arrow } from '@weco/common/icons';
import { LinkProps } from '@weco/common/model/link-props';
// import Control from '@weco/common/views/components/Control';
import Icon from '@weco/common/views/components/Icon/Icon';
// import { Container } from '@weco/common/views/components/styled/Container';
// import Rotator from '@weco/common/views/components/styled/Rotator';
import Space from '@weco/common/views/components/styled/Space';
import { toLink as itemLink } from '@weco/content/components/ItemLink';
import ItemViewerContext from '@weco/content/components/ItemViewerContext/ItemViewerContext';
import {
  AlignCenter,
  PrevNext,
} from '@weco/content/pages/guides/exhibitions/[id]/[type]/[stop]'; // TODO move this import somewhere better for sharing

const StyledPaginatorButtons = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.color('neutral.700')};
`;

const PaginatorButtons = ({
  prevLink,
  nextLink,
}: {
  prevLink?: LinkProps;
  nextLink?: LinkProps;
}) => {
  console.log('o', prevLink);
  console.log('p', nextLink);
  return (
    <div>
      {/* <Container> */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {prevLink && (
          <NextLink {...prevLink} passHref legacyBehavior>
            <AlignCenter>
              <Space
                $h={{ size: 'm', properties: ['margin-right'] }}
                style={{ display: 'flex' }}
              >
                <Icon icon={arrow} rotate={180} />
              </Space>
              <span>Previous</span>
            </AlignCenter>
          </NextLink>
        )}
        {nextLink && (
          <NextLink {...nextLink} passHref legacyBehavior>
            <AlignCenter>
              <span>Next</span>
              <Space
                $h={{ size: 'm', properties: ['margin-left'] }}
                style={{ display: 'flex' }}
              >
                <Icon icon={arrow} />
              </Space>
            </AlignCenter>
          </NextLink>
        )}
      </div>
      {/* </Container> */}
    </div>
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
