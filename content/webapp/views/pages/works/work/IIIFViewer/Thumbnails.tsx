import NextLink from 'next/link';
import styled from 'styled-components';

import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';

import { queryParamToArrayIndex } from '.';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';
import { thumbnailsPageSize } from './Paginators';

const ThumbnailsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  position: relative;
  border-top: none;
  height: 1800px;
  ${props => `
    ${props.theme.media('lg')(`
    height: calc(100vh - ${props.theme.navHeight}px);
    `)}
  `}
`;

const ThumbnailLink = styled(NextLink)`
  display: block;
  text-decoration: none;
  padding: 12px;
  width: auto;
`;

export const Thumbnails = () => {
  const { work, query, transformedManifest } = useItemViewerContext();
  const { canvases } = { ...transformedManifest };
  const navigationCanvases = canvases
    ? [...Array(thumbnailsPageSize)]
        .map(
          (_, i) => thumbnailsPageSize * queryParamToArrayIndex(query.page) + i
        )
        .map(i => canvases?.[i])
        .filter(Boolean)
    : [];

  return (
    <ThumbnailsContainer id="xyz">
      {navigationCanvases &&
        navigationCanvases.map((canvas, i) => {
          const canvasParam =
            thumbnailsPageSize * queryParamToArrayIndex(query.page) + (i + 1);
          return (
            <ThumbnailLink
              key={canvas.id}
              aria-current={canvasParam === query.canvas}
              {...toWorksItemLink({
                workId: work.id,
                props: {
                  canvas: canvasParam,
                  page: query.page,
                  manifest: query.manifest,
                  query: query.query,
                },
              })}
              scroll={false}
              replace
            >
              <IIIFCanvasThumbnail canvas={canvas} thumbNumber={canvasParam} />
            </ThumbnailLink>
          );
        })}
    </ThumbnailsContainer>
  );
};

export default Thumbnails;
