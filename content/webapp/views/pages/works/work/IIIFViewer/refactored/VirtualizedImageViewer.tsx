import debounce from 'lodash.debounce';
import { FunctionComponent, memo, useEffect, useRef, useState } from 'react';
import {
  areEqual,
  FixedSizeList,
  ListChildComponentProps,
  ListOnScrollProps,
} from 'react-window';
import styled from 'styled-components';

import LL from '@weco/common/views/components/styled/LL';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext/refactored';
import useScrollVelocity from '@weco/content/hooks/useScrollVelocity';
import { CanvasRotatedImage } from '@weco/content/types/item-viewer';
import { TransformedCanvas } from '@weco/content/types/manifest';
import {
  hasRestrictedItem,
  TransformedAuthService,
} from '@weco/content/utils/iiif/v3';
import { getDisplayItems } from '@weco/content/utils/iiif/v3/canvas';
import { queryParamToArrayIndex } from '@weco/content/views/pages/works/work/work.helpers';

import IIIFItem from './IIIFItem';
import SearchTermHighlights, {
  useSearchTermHighlights,
} from './VirtualizedImageViewer.SearchHighlights';

const ItemWrapper = styled.div<{ $isFirstItemRestricted: boolean }>`
  height: 100%;
  ${props => (props.$isFirstItemRestricted ? 'margin-top: 2em;' : null)}
`;

type ItemRendererProps = ListChildComponentProps<{
  scrollVelocity: number;
  canvases: TransformedCanvas[];
  rotatedImages: CanvasRotatedImage[];
  errorHandler?: () => void;
  externalAccessService?: TransformedAuthService;
  accessToken?: string;
  placeholderId?: string;
  isFirstItemRestricted?: boolean;
}>;

const ItemRenderer = memo(({ style, index, data }: ItemRendererProps) => {
  const {
    scrollVelocity,
    canvases,
    placeholderId,
    externalAccessService,
    isFirstItemRestricted,
  } = data;

  const currentCanvas = canvases[index];
  const { overlayPositionData, setImageRect, setImageContainerRect } =
    useSearchTermHighlights({ currentCanvas, canvases, index });

  const displayItems = getDisplayItems(currentCanvas);

  return (
    <div style={style}>
      {scrollVelocity === 3 ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LL $lighten />
        </div>
      ) : (
        <>
          <SearchTermHighlights overlayPositionData={overlayPositionData} />

          {displayItems.length > 0 &&
            displayItems.map(item => {
              return (
                <ItemWrapper
                  key={item.type + item.id}
                  data-testid="image-item"
                  $isFirstItemRestricted={!!isFirstItemRestricted}
                >
                  <IIIFItem
                    placeholderId={placeholderId}
                    item={item}
                    canvas={currentCanvas}
                    i={index}
                    exclude={[]}
                    setImageRect={setImageRect}
                    setImageContainerRect={setImageContainerRect}
                    externalAccessService={externalAccessService}
                    showVideoTranscript={false}
                    shouldScrollToUpdateUrl
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
  canvasNumber,
  viewer,
  mainAreaWidth,
}: {
  currentCanvas: TransformedCanvas | undefined;
  canvasNumber: number;
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
      queryParamToArrayIndex(canvasNumber) * (viewer?.props.itemSize || 0);
    const distanceToScroll =
      heightOfPreviousItems +
      ((viewer?.props.itemSize || 0) - renderedHeight) / 2;
    viewer?.scrollTo(distanceToScroll);
  } else {
    // 4. Otherwise, if it's portrait, we go to the start of the image
    viewer?.scrollToItem(queryParamToArrayIndex(canvasNumber), 'start');
  }
}

const VirtualizedImageViewer: FunctionComponent = () => {
  const {
    mainAreaHeight,
    mainAreaWidth,
    transformedManifest,
    query,
    rotatedImages,
    setShowControls,
    errorHandler,
    accessToken,
    currentCanvas,
  } = useItemViewerContext();

  const mainViewerRef = useRef<FixedSizeList>(null);

  const [viewerScrollOffset, setViewerScrollOffset] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const firstRenderRef = useRef(firstRender);
  firstRenderRef.current = firstRender;

  const scrollVelocity = useScrollVelocity(viewerScrollOffset);

  const debounceHandleOnItemsRendered = useRef(
    debounce(handleOnItemsRendered, 500)
  );
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { canvases, auth, placeholderId } = {
    ...transformedManifest,
  };
  const isFirstItemRestricted = canvases?.[0]
    ? hasRestrictedItem(canvases[0])
    : false;
  const externalAccessService = auth?.externalAccessService;

  // We hide the zoom and rotation controls while the user is scrolling
  function handleOnScroll({ scrollOffset }: ListOnScrollProps) {
    if (!currentCanvas?.imageServiceId) return;
    timer.current && clearTimeout(timer.current);
    setShowControls(false);
    setViewerScrollOffset(scrollOffset);

    timer.current = setTimeout(() => {
      setShowControls(true);
    }, 500);
  }

  // We display the canvas indicated by the ?canvas= number when the page first loads
  function handleOnItemsRendered() {
    if (firstRenderRef.current) {
      const viewer = mainViewerRef?.current;
      scrollViewer({
        currentCanvas,
        canvasNumber: query.canvas,
        viewer,
        mainAreaWidth,
      });
      setFirstRender(false);
    }
  }

  // Scroll to the correct canvas when the canvas changes.
  // But we don't want this to happen if the canvas changes as a result of the viewer being scrolled,
  // so ItemLink href prop can include a shouldScrollToCanvas query param on the href object to prevent this.
  useEffect(() => {
    if (query.shouldScrollToCanvas) {
      scrollViewer({
        currentCanvas,
        canvasNumber: query.canvas,
        viewer: mainViewerRef?.current,
        mainAreaWidth,
      });
    }
  }, [query.canvas]);

  return (
    <FixedSizeList
      width={mainAreaWidth}
      style={{ width: `${mainAreaWidth}px`, margin: '0 auto' }}
      height={mainAreaHeight}
      itemCount={canvases?.length || 0}
      itemData={{
        scrollVelocity,
        canvases: canvases || [],
        rotatedImages,
        errorHandler,
        externalAccessService,
        accessToken,
        placeholderId,
        isFirstItemRestricted,
      }}
      itemSize={mainAreaWidth}
      onItemsRendered={debounceHandleOnItemsRendered.current}
      onScroll={handleOnScroll}
      ref={mainViewerRef}
    >
      {ItemRenderer}
    </FixedSizeList>
  );
};

export default VirtualizedImageViewer;
