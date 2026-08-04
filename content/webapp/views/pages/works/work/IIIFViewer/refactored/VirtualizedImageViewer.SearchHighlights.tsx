import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { SearchResults } from '@weco/content/services/iiif/types/search/v3';
import { CanvasRotatedImage } from '@weco/content/types/item-viewer';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { queryParamToArrayIndex } from '@weco/content/views/pages/works/work/work.helpers';

type OverlayPositionData = {
  canvasNumber: number;
  overlayTop: number;
  overlayLeft: number;
  highlight: {
    width: number;
    height: number;
  };
  rotation: number;
};

type SearchTermHighlightProps = {
  $top: number;
  $left: number;
  $width: number;
  $height: number;
  $rotation: number;
};

export type RotationValue = 0 | 90 | 180 | 270;

const SearchTermHighlight = styled.div<SearchTermHighlightProps>`
  background: ${props => props.theme.color('yellow')};
  position: absolute;
  z-index: 1;
  top: ${props => `${props.$top}px`};
  left: ${props => `${props.$left}px`};
  width: ${props => `${props.$width}px`};
  height: ${props => `${props.$height}px`};
  transform-origin: 0 0;
  transform: ${props => `rotate(${props.$rotation}deg)`};
  mix-blend-mode: color;
`;

export function getOverlayTopLeft({
  imageContainerRect,
  imageRect,
  rotation,
  x,
  y,
}: {
  imageContainerRect: DOMRect;
  imageRect: DOMRect;
  rotation: RotationValue;
  x: number;
  y: number;
}): {
  overlayTop: number;
  overlayLeft: number;
} {
  const imageContainerTop = imageContainerRect?.top || 0;
  const imageTop = imageRect?.top || 0;
  const imageContainerLeft = imageContainerRect?.left || 0;
  const imageLeft = imageRect?.left || 0;
  const startTop = imageTop - imageContainerTop;
  const startLeft = imageLeft - imageContainerLeft;

  switch (rotation) {
    case 90:
      return {
        overlayTop: startTop + x,
        overlayLeft: startLeft + imageRect.width - y,
      };
    case 180:
      return {
        overlayTop: startTop + imageRect.height - y,
        overlayLeft: startLeft + imageRect.width - x,
      };
    case 270:
      return {
        overlayTop: startTop + imageRect.height - x,
        overlayLeft: startLeft + y,
      };
    default:
      return {
        overlayTop: startTop + y,
        overlayLeft: startLeft + x,
      };
  }
}

function getScale({
  imageRect,
  currentCanvas,
  rotation,
}: {
  imageRect: DOMRect;
  currentCanvas: TransformedCanvas;
  rotation: RotationValue;
}): number {
  if (!rotation || rotation === 180) {
    return imageRect && currentCanvas.width
      ? imageRect.width / currentCanvas.width
      : 1;
  } else {
    return imageRect && currentCanvas.height
      ? imageRect.width / currentCanvas.height
      : 1;
  }
}

function getPositionData({
  imageContainerRect,
  imageRect,
  currentCanvas,
  searchResults,
  canvases,
  rotatedImages,
}: {
  imageContainerRect: DOMRect;
  imageRect: DOMRect;
  currentCanvas: TransformedCanvas;
  searchResults: SearchResults | null;
  canvases: TransformedCanvas[];
  rotatedImages: CanvasRotatedImage[];
}): OverlayPositionData[] {
  const searchHitsPositioningData = searchResults?.resources.map(resource => {
    // on: "https://wellcomelibrary.org/iiif/b30330002/canvas/c55#xywh=2301,662,157,47"
    // OR
    // on: https://iiif.wellcomecollection.org/presentation/b29338062/canvases/b29338062_0031.jp2#xywh=148,2277,259,59"
    const canvasNumber = canvases.findIndex(canvas => {
      return new URL(resource.on).pathname === new URL(canvas.id).pathname;
    });
    const matchingRotation = rotatedImages.find(image => {
      return queryParamToArrayIndex(image.canvas) === canvasNumber;
    });
    const scale = getScale({
      imageRect,
      currentCanvas,
      rotation: (matchingRotation?.rotation || 0) as RotationValue,
    });
    const coordsMatch = resource.on.match(/(#xywh=)(.*)/);
    const coords = coordsMatch && coordsMatch[2].split(',');
    const coordX = coords ? Math.round(Number(coords[0]) * scale) : 0;
    const coordY = coords ? Math.round(Number(coords[1]) * scale) : 0;
    const highlightWidth = coords ? Math.round(Number(coords[2]) * scale) : 0;
    const highlightHeight = coords ? Math.round(Number(coords[3]) * scale) : 0;
    const { overlayTop, overlayLeft } = getOverlayTopLeft({
      imageContainerRect,
      imageRect,
      rotation: (matchingRotation?.rotation || 0) as RotationValue,
      x: coordX,
      y: coordY,
    });

    return {
      canvasNumber: Number(canvasNumber),
      overlayTop,
      overlayLeft,
      highlight: {
        width: highlightWidth,
        height: highlightHeight,
      },
      rotation: matchingRotation?.rotation || 0,
    };
  });
  return searchHitsPositioningData || [];
}

// The overlay positions can only be worked out once we know where the image
// has actually been rendered, and that measurement comes from IIIFItem. So as
// well as the positions, this returns the two setters that the caller must
// pass down to IIIFItem for it to report its measurements back.
export function useSearchTermHighlights({
  currentCanvas,
  canvases,
  index,
}: {
  currentCanvas: TransformedCanvas;
  canvases: TransformedCanvas[];
  index: number;
}): {
  overlayPositionData: OverlayPositionData[];
  setImageRect: (v: DOMRect) => void;
  setImageContainerRect: (v: DOMRect) => void;
} {
  const { searchResults, rotatedImages } = useItemViewerContext();
  const [imageRect, setImageRect] = useState<DOMRect | undefined>();
  const [imageContainerRect, setImageContainerRect] = useState<
    DOMRect | undefined
  >();
  const [overlayPositionData, setOverlayPositionData] = useState<
    OverlayPositionData[]
  >([]);

  useEffect(() => {
    // The search hit dimensions and coordinates are given relative to the full size image.
    // The highlight overlays are positioned relative to the image container.
    // Therefore, in order to display the highlight overlays correctly over the search hits,
    // we need to get the position of the image relative to the container and the display scale of the image relative to the full size.
    // We then need to calculate the position of the highlight overlays factoring in the orientation of the image.
    // This needs to be recalculated whenever the image changes size or orientation.
    const searchHitsPositioningData =
      imageContainerRect &&
      imageRect &&
      getPositionData({
        imageContainerRect,
        imageRect,
        currentCanvas,
        searchResults,
        canvases,
        rotatedImages,
      });
    if (searchHitsPositioningData) {
      setOverlayPositionData(
        searchHitsPositioningData.filter(item => {
          return item.canvasNumber === index;
        })
      );
    }
  }, [imageRect, imageContainerRect, currentCanvas, searchResults]);

  return { overlayPositionData, setImageRect, setImageContainerRect };
}

const SearchTermHighlights: FunctionComponent<{
  overlayPositionData: OverlayPositionData[];
}> = ({ overlayPositionData }) => {
  return (
    <>
      {overlayPositionData &&
        overlayPositionData.map((item, i) => {
          return (
            <SearchTermHighlight
              key={i}
              data-testid="search-term-highlight"
              $top={item.overlayTop}
              $left={item.overlayLeft}
              $width={item.highlight.width}
              $height={item.highlight.height}
              $rotation={item.rotation}
            />
          );
        })}
    </>
  );
};

export default SearchTermHighlights;
