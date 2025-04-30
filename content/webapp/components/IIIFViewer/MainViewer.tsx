import { AuthExternalService } from '@iiif/presentation-3';
import debounce from 'lodash.debounce';
import {
  CSSProperties,
  FunctionComponent,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { areEqual, FixedSizeList } from 'react-window';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import LL from '@weco/common/views/components/styled/LL';
import { useUser } from '@weco/common/views/components/UserProvider';
import IIIFItem from '@weco/content/components/IIIFItem';
import { CanvasPaginator } from '@weco/content/components/IIIFViewer/Paginators';
import ItemViewerContext, {
  RotatedImage,
} from '@weco/content/components/ItemViewerContext';
import useScrollVelocity from '@weco/content/hooks/useScrollVelocity';
import { SearchResults } from '@weco/content/services/iiif/types/search/v3';
import { TransformedCanvas } from '@weco/content/types/manifest';
import {
  hasNonImages,
  TransformedAuthService,
} from '@weco/content/utils/iiif/v3';
import { getDisplayItems } from '@weco/content/utils/iiif/v3/canvas';

import { queryParamToArrayIndex } from '.';

// Temporary styling for viewer to display audio, video and pdfs
// will be tidied up in future work
const ItemWrapper = styled.div`
  margin: auto;
  height: 100%;

  .item-wrapper {
    margin: auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    display: block;
    height: auto;
    width: 90%;
    max-width: 800px;
    max-height: 95%;
  }

  .pdf-wrapper,
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }

  video {
    display: block;
    margin: auto;
    width: 100%;
    max-height: 90%;
  }
`;

type OverlayPositionData = {
  canvasNumber: number;
  overlayTop: number;
  overlayLeft: number;
  highlight: {
    w: number;
    h: number;
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

type RotationValue = 0 | 90 | 180 | 270;

const SearchTermHighlight = styled.div<SearchTermHighlightProps>`
  background: ${props => props.theme.color('accent.purple')};
  opacity: 0.5;
  position: absolute;
  z-index: 1;
  top: ${props => `${props.$top}px`};
  left: ${props => `${props.$left}px`};
  width: ${props => `${props.$width}px`};
  height: ${props => `${props.$height}px`};
  transform-origin: 0 0;
  transform: ${props => `rotate(${props.$rotation}deg)`};
`;

const MessageContainer = styled.div`
  min-width: 360px;
  max-width: 60%;
  margin: 0 auto;
  border: 1px solid ${props => props.theme.color('neutral.600')};
  height: 80%;
  margin-top: 50%;
  transform: translateY(-50%);
  padding: 10%;
`;

type ItemRendererProps = {
  style: CSSProperties;
  index: number;
  data: {
    scrollVelocity: number;
    canvases: TransformedCanvas[];
    rotatedImages: RotatedImage[];
    errorHandler?: () => void;
    externalAccessService?: TransformedAuthService;
    accessToken?: string;
    restrictedService?: AuthExternalService;
    placeholderId?: string;
  };
};

function getOverlayTopLeft({
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
  if (rotation === 90) {
    return {
      overlayTop: startTop + x,
      overlayLeft: startLeft + imageRect.width - y,
    };
  } else if (rotation === 180) {
    return {
      overlayTop: startTop + imageRect.height - y,
      overlayLeft: startLeft + imageRect.width - x,
    };
  } else if (rotation === 270) {
    return {
      overlayTop: imageTop - imageContainerTop + imageRect.height - x,
      overlayLeft: imageLeft - imageContainerLeft + y,
    };
  } else {
    return {
      overlayTop: imageTop - imageContainerTop + y,
      overlayLeft: imageLeft - imageContainerLeft + x,
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
  rotatedImages: RotatedImage[];
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
    const x = coords ? Math.round(Number(coords[0]) * scale) : 0;
    const y = coords ? Math.round(Number(coords[1]) * scale) : 0;
    const w = coords ? Math.round(Number(coords[2]) * scale) : 0;
    const h = coords ? Math.round(Number(coords[3]) * scale) : 0;
    const { overlayTop, overlayLeft } = getOverlayTopLeft({
      imageContainerRect,
      imageRect,
      rotation: (matchingRotation?.rotation || 0) as RotationValue,
      x,
      y,
    });

    return {
      canvasNumber: Number(canvasNumber),
      overlayTop,
      overlayLeft,
      highlight: {
        w,
        h,
      },
      rotation: matchingRotation?.rotation || 0,
    };
  });
  return searchHitsPositioningData || [];
}

const ItemRenderer = memo(({ style, index, data }: ItemRendererProps) => {
  const { scrollVelocity, canvases, externalAccessService, placeholderId } =
    data;
  const currentCanvas = canvases[index];
  const { userIsStaffWithRestricted } = useUser();
  const isRestricted = currentCanvas.hasRestrictedImage;
  const { searchResults, rotatedImages } = useContext(ItemViewerContext);
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

  const displayItems = getDisplayItems(currentCanvas);

  return (
    <div style={style}>
      {scrollVelocity === 3 ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LL $lighten={true} />
        </div>
      ) : isRestricted && !userIsStaffWithRestricted ? (
        // We always want to show the restricted message to users without a role of 'StaffWithRestricted'
        // If the user has the correct role then officially we should check the probe service repsonse before trying to load the image.
        // https://iiif.io/api/auth/2.0/#probe-service
        // However, we've opted to just try and load the image if the accessToken is available rather than making an additional call
        // In our case the probe service doesn't offer any information other than whether the image would load, so we may as well try that directly.
        <MessageContainer>
          <h2 className={font('intb', 4)}>{externalAccessService?.label}</h2>
          <p
            className={font('intr', 5)}
            dangerouslySetInnerHTML={{
              __html: externalAccessService?.description || '',
            }}
          />
        </MessageContainer>
      ) : (
        <>
          {overlayPositionData &&
            overlayPositionData.map((item, i) => {
              return (
                <SearchTermHighlight
                  key={i}
                  $top={item.overlayTop}
                  $left={item.overlayLeft}
                  $width={item.highlight.w}
                  $height={item.highlight.h}
                  $rotation={item.rotation}
                />
              );
            })}

          {displayItems.length > 0 &&
            displayItems.map(item => {
              return (
                <ItemWrapper key={item.type + item.id}>
                  <IIIFItem
                    placeholderId={placeholderId}
                    item={item}
                    canvas={currentCanvas}
                    titleOverride={`${index}/${canvases.length}`}
                    i={index}
                    exclude={[]}
                    setImageRect={setImageRect}
                    setImageContainerRect={setImageContainerRect}
                  />
                </ItemWrapper>
              );
            })}
        </>
      )}
    </div>
  );
}, areEqual);

ItemRenderer.displayName = 'ItemRenderer';

function scrollViewer({
  currentCanvas,
  canvas,
  viewer,
  mainAreaWidth,
}: {
  currentCanvas: TransformedCanvas | undefined;
  canvas: number;
  viewer: FixedSizeList | null;
  mainAreaWidth: number;
}): void {
  const isLandscape =
    currentCanvas?.width && currentCanvas?.height
      ? currentCanvas.width > currentCanvas.height
      : false;

  // If an image is landscape, it will tend to appear too low in the viewport
  // on account of the FixedSizedList necessarily being comprised of square items.
  // To circumvent this, if the image is landscape
  // 1. We calculate the rendered height of the image
  // 2. We half the difference between that and the square item it sits inside
  // 3. We scroll that distance, putting the top of the image at the top of the viewport

  if (isLandscape) {
    const ratio =
      currentCanvas?.height && currentCanvas?.width
        ? currentCanvas.height / currentCanvas.width
        : 1;
    const renderedHeight = mainAreaWidth * ratio * 0.8; // 0.8 = 80% max-width image in container. Variable.
    const heightOfPreviousItems =
      queryParamToArrayIndex(canvas) * (viewer?.props.itemSize || 0);
    const distanceToScroll =
      heightOfPreviousItems +
      ((viewer?.props.itemSize || 0) - renderedHeight) / 2;
    viewer?.scrollTo(distanceToScroll);
  } else {
    // 4. Otherwise, if it's portrait, we go to the start of the image
    viewer?.scrollToItem(queryParamToArrayIndex(canvas), 'start');
  }
}

const MainViewer: FunctionComponent = () => {
  const {
    mainAreaHeight,
    mainAreaWidth,
    transformedManifest,
    query,
    setShowZoomed,
    setShowFullscreenControl,
    rotatedImages,
    setShowControls,
    errorHandler,
    accessToken,
  } = useContext(ItemViewerContext);
  const { shouldScrollToCanvas, canvas } = query;
  const mainViewerRef = useRef<FixedSizeList>(null);
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const firstRenderRef = useRef(firstRender);
  firstRenderRef.current = firstRender;
  const scrollVelocity = useScrollVelocity(newScrollOffset);
  const debounceHandleOnItemsRendered = useRef(
    debounce(handleOnItemsRendered, 500)
  );
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>();
  const { canvases, auth, placeholderId } = {
    ...transformedManifest,
  };
  const currentCanvas = canvases?.[queryParamToArrayIndex(canvas)];

  // Only the V2 external service works for providing access so we always attempt to use that first
  const externalAccessService =
    auth?.v2.externalAccessService || auth?.v1.externalAccessService;

  // We hide the zoom and rotation controls while the user is scrolling
  function handleOnScroll({ scrollOffset }) {
    timer.current && clearTimeout(timer.current);
    setShowControls(false);
    setNewScrollOffset(scrollOffset);

    timer.current = setTimeout(() => {
      if (currentCanvas?.imageServiceId) {
        setShowControls(true);
      }
    }, 500);
  }

  // We display the canvas indicated by the canvas (index) when the page first loads
  function handleOnItemsRendered() {
    let currentCanvas: TransformedCanvas | undefined;
    if (firstRenderRef.current) {
      const viewer = mainViewerRef?.current;
      scrollViewer({ currentCanvas, canvas, viewer, mainAreaWidth });
      setFirstRender(false);
    }
  }

  // Scroll to the correct canvas when the canvas changes.
  // But we don't want this to happen if the canvas changes as a result of the viewer being scrolled,
  // so ItemLink href prop can include a shouldScrollToCanvas query param on the href object to prevent this.
  useEffect(() => {
    if (shouldScrollToCanvas) {
      scrollViewer({
        currentCanvas,
        canvas,
        viewer: mainViewerRef?.current,
        mainAreaWidth,
      });
    }
  }, [canvas]);

  const displayItems = currentCanvas ? getDisplayItems(currentCanvas) : [];
  const useFixedSizeList = !hasNonImages(canvases);
  if (!useFixedSizeList) {
    setShowFullscreenControl(false);
  }

  return (
    <div data-testid="main-viewer" style={{ height: '100%' }}>
      {useFixedSizeList ? (
        <FixedSizeList
          width={mainAreaWidth}
          style={{ width: `${mainAreaWidth}px`, margin: '0 auto' }}
          height={mainAreaHeight}
          itemCount={canvases?.length || 0}
          itemData={{
            scrollVelocity,
            canvases: canvases || [],
            setShowZoomed,
            rotatedImages,
            errorHandler,
            externalAccessService,
            canvas,
            accessToken,
            placeholderId,
          }}
          itemSize={mainAreaWidth}
          onItemsRendered={debounceHandleOnItemsRendered.current}
          onScroll={handleOnScroll}
          ref={mainViewerRef}
        >
          {ItemRenderer}
        </FixedSizeList>
      ) : (
        <>
          {displayItems.map((item, i) => {
            return (
              <>
                {currentCanvas ? (
                  <ItemWrapper key={i}>
                    <IIIFItem
                      placeholderId={placeholderId}
                      item={item}
                      i={1}
                      canvas={currentCanvas}
                      titleOverride={`${canvas}/${canvases?.length}`}
                      exclude={[]}
                    />
                  </ItemWrapper>
                ) : null}
              </>
            );
          })}
          <CanvasPaginator />;
        </>
      )}
    </div>
  );
};

export default MainViewer;
