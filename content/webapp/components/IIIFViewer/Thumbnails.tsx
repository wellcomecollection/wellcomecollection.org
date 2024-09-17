import NextLink from 'next/link';
import { useContext } from 'react';
import styled from 'styled-components';
import ItemViewerContext from '@weco/content/components/ItemViewerContext/ItemViewerContext';
import { toLink as itemLink } from '@weco/content/components/ItemLink';
import { thumbnailsPageSize } from './Paginators';
import { queryParamToArrayIndex } from '.';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';

const ThumbnailsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  position: relative;
  border-top: none;
  height: 1800px;
  ${props => `
    ${props.theme.media('xlarge')(`
    height: calc(100vh - ${props.theme.navHeight}px);
    `)}
  `}
`;

const ThumbnailLink = styled.a`
  display: block;
  text-decoration: none;
  padding: 12px;
  width: auto;
`;

export const Thumbnails = () => {
  const { work, query, transformedManifest } = useContext(ItemViewerContext);
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
            <NextLink
              key={canvas.id}
              {...itemLink({
                workId: work.id,
                props: {
                  canvas: canvasParam,
                  page: query.page,
                  manifest: query.manifest,
                  query: query.query,
                },
                source: 'viewer/paginator',
              })}
              scroll={false}
              replace
              passHref
              legacyBehavior
            >
              <ThumbnailLink aria-current={canvasParam === query.canvas}>
                <IIIFCanvasThumbnail
                  canvas={canvas}
                  thumbNumber={canvasParam}
                />
              </ThumbnailLink>
            </NextLink>
          );
        })}
    </ThumbnailsContainer>
  );
};

export default Thumbnails;
