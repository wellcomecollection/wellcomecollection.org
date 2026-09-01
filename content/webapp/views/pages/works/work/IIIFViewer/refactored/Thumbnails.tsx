import NextLink from 'next/link';
import styled from 'styled-components';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';
import {
  getCanvasesForPage,
  queryParamToArrayIndex,
  thumbnailsPageSize,
} from '@weco/content/views/pages/works/work/work.helpers';

import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';

const ThumbnailsContainer = styled.div<{
  $isTRKiosk?: boolean;
  $isNonTRKiosk?: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  position: relative;
  border-top: none;
  height: 1800px;
  ${props =>
    props.theme.media('lg')(`
    height: ${props.theme.getViewerHeight(
      props.$isTRKiosk || false,
      props.$isNonTRKiosk || false
    )};
    `)}
`;

const ThumbnailLink = styled(NextLink)`
  display: block;
  text-decoration: none;
  padding: 12px;
  width: auto;
`;

export const Thumbnails = () => {
  const { work, query, transformedManifest } = useItemViewerContext();
  const { isKiosk, isTendernessAndRageKiosk } = useKiosk();
  const navigationCanvases = getCanvasesForPage({
    canvases: transformedManifest?.canvases,
    page: query.page,
  });

  return (
    <ThumbnailsContainer
      $isTRKiosk={isTendernessAndRageKiosk}
      $isNonTRKiosk={isKiosk && !isTendernessAndRageKiosk}
    >
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
