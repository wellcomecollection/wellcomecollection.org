import {
  memo,
  useState,
  useRef,
  RefObject,
  CSSProperties,
  FunctionComponent,
  useEffect,
  useContext,
} from 'react';
import { FixedSizeList, areEqual } from 'react-window';
import debounce from 'lodash.debounce';
import styled from 'styled-components';
import LL from '@weco/common/views/components/styled/LL';
import useScrollVelocity from '../../hooks/useScrollVelocity';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { convertIiifUriToInfoUri } from '../../utils/convert-iiif-uri';
import IIIFResponsiveImage from './IIIFResponsiveImage';
import {
  getCanvasOcr,
  missingAltTextMessage,
} from '../../services/catalogue/works';
import {
  getServiceId,
  getImageAuthService,
  isImageRestricted,
  getThumbnailService,
} from '../../utils/iiif';
import { font } from '@weco/common/utils/classnames';
import { IIIFCanvas, SearchResults } from '../../model/iiif';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import ImageViewer from './ImageViewer';

type SearchTermHighlightProps = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const SearchTermHighlight = styled.div<SearchTermHighlightProps>`
  background: ${props => props.theme.color('purple')};
  opacity: 0.5;
  position: absolute;
  z-index: 1;
  top: ${props => `${props.top}px`};
  left: ${props => `${props.left}px`};
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
`;

const MessageContainer = styled.div`
  min-width: 360px;
  max-width: 60%;
  margin: 0 auto;
  border: 1px solid ${props => props.theme.color('pewter')};
  height: 80%;
  margin-top: 50%;
  transform: translateY(-50%);
  padding: 10%;
`;

const ThumbnailWrapper = styled.div<{ imageLoaded?: boolean }>`
  opacity: ${props => (props.imageLoaded ? 1 : 0)};
  transition: opacity 500ms ease;
  position: absolute;
  width: 100%;
  height: 100%;
  img {
    position: relative;
    display: block;
    margin: auto;
    top: 50%;
    transform: translateY(-50%);
    max-width: 95%;
    max-height: 95%;
    width: auto;
    height: inherit;
  }
`;

type ItemRendererProps = {
  style: CSSProperties;
  index: number;
  data: {
    scrollVelocity: number;
    mainAreaRef: RefObject<HTMLDivElement>;
    setActiveIndex: (i: number) => void;
    canvases: IIIFCanvas[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rotatedImages: any[];
    setIsLoading: (value: boolean) => void;
    errorHandler?: () => void;
  };
};

function getPositionData(
  imageContainerRect: ClientRect,
  imageRect: ClientRect,
  currentCanvas: IIIFCanvas,
  searchResults: SearchResults,
  canvases: IIIFCanvas[]
) {
  const imageContainerTop = imageContainerRect?.top || 0;
  const imageTop = imageRect?.top || 0;
  const imageContainerLeft = imageContainerRect?.left || 0;
  const imageLeft = imageRect?.left || 0;
  const overlayStartTop = imageTop - imageContainerTop;
  const overlayStartLeft = imageLeft - imageContainerLeft;
  const scale = imageRect ? imageRect.width / currentCanvas.width : 1;
  const highlightsPositioningData =
    searchResults &&
    searchResults?.resources.map(resource => {
      // on: "https://wellcomelibrary.org/iiif/b30330002/canvas/c55#xywh=2301,662,157,47"
      // OR
      // on: https://iiif.wellcomecollection.org/presentation/b29338062/canvases/b29338062_0031.jp2#xywh=148,2277,259,59"
      const canvasNumber = canvases.findIndex(canvas => {
        return (
          new URL(resource.on).pathname === new URL(canvas['@id']).pathname
        );
      });
      const coordsMatch = resource.on.match(/(#xywh=)(.*)/);
      const coords = coordsMatch && coordsMatch[2].split(',');
      const x = coords ? Math.round(Number(coords[0]) * scale) : 0;
      const y = coords ? Math.round(Number(coords[1]) * scale) : 0;
      const w = coords ? Math.round(Number(coords[2]) * scale) : 0;
      const h = coords ? Math.round(Number(coords[3]) * scale) : 0;
      return {
        canvasNumber: Number(canvasNumber),
        overlayStartTop,
        overlayStartLeft,
        highlight: {
          x,
          y,
          w,
          h,
        },
      };
    });
  return highlightsPositioningData;
}

const ItemRenderer = memo(({ style, index, data }: ItemRendererProps) => {
  const { scrollVelocity, canvases, rotatedImages, setIsLoading, mainAreaRef } =
    data;
  const [mainLoaded, setMainLoaded] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const currentCanvas = canvases[index];
  const mainImageService = { '@id': getServiceId(currentCanvas) };
  const urlTemplateMain = mainImageService['@id']
    ? iiifImageTemplate(mainImageService['@id'])
    : null;
  const thumbnailService = getThumbnailService(currentCanvas);
  const urlTemplateThumbnail =
    thumbnailService && iiifImageTemplate(thumbnailService['@id']);
  const smallestWidthImageDimensions =
    thumbnailService &&
    thumbnailService.sizes
      .sort((a, b) => a.width - b.width)
      .find(dimensions => dimensions.width > 100);
  const infoUrl =
    mainImageService['@id'] && convertIiifUriToInfoUri(mainImageService['@id']);
  const matching = rotatedImages.find(canvas => canvas.canvasIndex === index);
  const rotation = matching ? matching.rotation : 0;
  const imageType = scrollVelocity >= 1 ? 'thumbnail' : 'main';
  const imageAuthService = getImageAuthService(currentCanvas);
  const isRestricted = isImageRestricted(currentCanvas);
  const { searchResults } = useContext(ItemViewerContext);
  const [imageRect, setImageRect] = useState<ClientRect | undefined>();
  const [imageContainerRect, setImageContainerRect] = useState<
    ClientRect | undefined
  >();
  const [ocrText, setOcrText] = useState('');

  type OverlayPositionData = {
    canvasNumber: number;
    overlayStartTop: number;
    overlayStartLeft: number;
    highlight: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
  };

  const [overlayPositionData, setOverlayPositionData] = useState<
    OverlayPositionData[]
  >([]);

  useEffect(async () => {
    const ocrText = await getCanvasOcr(canvases[index]);
    setOcrText(ocrText || missingAltTextMessage);
  }, [index]);

  useEffect(() => {
    // The search hit dimensions and coordinates are given relative to the full size image.
    // We need to get the position of the image relative to the container and the display scale of the image relative to the full size
    // in order to display the highlights correctly over the search hits.
    // This needs to be recalculated whenever the image changes size for whatever reason.
    const highlightsPositioningData =
      imageContainerRect &&
      imageRect &&
      getPositionData(
        imageContainerRect,
        imageRect,
        currentCanvas,
        searchResults,
        canvases
      );
    if (highlightsPositioningData) {
      setOverlayPositionData(
        highlightsPositioningData.filter(item => {
          return item.canvasNumber === index;
        })
      );
    }
  }, [imageRect, imageContainerRect, currentCanvas, searchResults]);

  return (
    <div style={style}>
      {scrollVelocity === 3 ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LL lighten={true} />
        </div>
      ) : isRestricted ? (
        <MessageContainer>
          <h2 className={font('hnb', 4)}>
            {imageAuthService && imageAuthService.label}
          </h2>
          <p
            className={font('hnr', 5)}
            dangerouslySetInnerHTML={{
              __html: imageAuthService ? imageAuthService.description : '',
            }}
          />
        </MessageContainer>
      ) : (
        <>
          <LL lighten={true} />
          {!mainLoaded && urlTemplateThumbnail && (
            <ThumbnailWrapper imageLoaded={thumbLoaded}>
              <IIIFResponsiveImage
                width={currentCanvas.width}
                height={currentCanvas.height}
                src={urlTemplateThumbnail({
                  size: `${
                    smallestWidthImageDimensions
                      ? smallestWidthImageDimensions.width
                      : '!100'
                  },`,
                })}
                srcSet={''}
                sizes={''}
                alt={''}
                isLazy={false}
                lang={undefined}
                loadHandler={() => {
                  setThumbLoaded(true);
                }}
              />
            </ThumbnailWrapper>
          )}
          {(imageType === 'main' || mainLoaded) && urlTemplateMain && infoUrl && (
            <>
              {rotation === 0 &&
                overlayPositionData &&
                overlayPositionData.map((item, i) => {
                  return (
                    <SearchTermHighlight
                      key={i}
                      top={item.overlayStartTop + item.highlight.y}
                      left={item.overlayStartLeft + item.highlight.x}
                      width={item.highlight.w}
                      height={item.highlight.h}
                    />
                  );
                })}
              <div data-test-id={`canvas-${index}`}>
                <ImageViewer
                  id="item-page"
                  infoUrl={infoUrl}
                  width={currentCanvas.width}
                  height={currentCanvas.height}
                  alt={ocrText}
                  urlTemplate={urlTemplateMain}
                  rotation={rotation}
                  index={index}
                  loadHandler={() => {
                    setMainLoaded(true);
                    setIsLoading(false);
                  }}
                  mainAreaRef={mainAreaRef}
                  setImageRect={setImageRect}
                  setImageContainerRect={setImageContainerRect}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}, areEqual);

ItemRenderer.displayName = 'ItemRenderer';

export function scrollViewer(
  currentCanvas: IIIFCanvas,
  canvasIndex: number,
  viewer: FixedSizeList | null,
  mainAreaWidth: number
): void {
  const isLandscape = currentCanvas.width > currentCanvas.height;

  // If an image is landscape, it will tend to appear too low in the viewport
  // on account of the FixedSizedList necessarily being comprised of square items.
  // To circumvent this, if the image is landscape
  // 1. We calculate the rendered height of the image
  // 2. We half the difference between that and the square item it sits inside
  // 3. We scroll that distance, putting the top of the image at the top of the viewport

  if (isLandscape) {
    const ratio = currentCanvas.height / currentCanvas.width;
    const renderedHeight = mainAreaWidth * ratio * 0.8; // TODO: 0.8 = 80% max-width image in container. Variable.
    const heightOfPreviousItems = canvasIndex * (viewer?.props.itemSize || 0);
    const distanceToScroll =
      heightOfPreviousItems +
      ((viewer?.props.itemSize || 0) - renderedHeight) / 2;
    viewer?.scrollTo(distanceToScroll);
  } else {
    // 4. Otherwise, if it's portrait, we go to the start of the image
    viewer?.scrollToItem(canvasIndex, 'start');
  }
}

type Props = {
  mainViewerRef: RefObject<FixedSizeList>;
  mainAreaRef: RefObject<HTMLDivElement>;
};

const MainViewer: FunctionComponent<Props> = ({
  mainViewerRef,
  mainAreaRef,
}: Props) => {
  const {
    setActiveIndex,
    mainAreaHeight,
    mainAreaWidth,
    canvases,
    canvasIndex,
    setShowZoomed,
    setZoomInfoUrl,
    setIsLoading,
    rotatedImages,
    setShowControls,
    errorHandler,
  } = useContext(ItemViewerContext);
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const firstRenderRef = useRef(firstRender);
  firstRenderRef.current = firstRender;
  const scrollVelocity = useScrollVelocity(newScrollOffset);
  const debounceHandleOnItemsRendered = useRef(
    debounce(handleOnItemsRendered, 500)
  );
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>();
  function handleOnScroll({ scrollOffset }) {
    timer.current && clearTimeout(timer.current);
    setShowControls(false);
    setNewScrollOffset(scrollOffset);

    timer.current = setTimeout(() => {
      setShowControls(true);
    }, 500);
  }

  function handleOnItemsRendered() {
    let currentCanvas;
    if (firstRenderRef.current) {
      setActiveIndex(canvasIndex);
      currentCanvas = canvases && canvases[canvasIndex];
      const viewer = mainViewerRef?.current;

      scrollViewer(currentCanvas, canvasIndex, viewer, mainAreaWidth);
      setFirstRender(false);
      const mainImageService = {
        '@id': currentCanvas
          ? currentCanvas.images[0].resource.service['@id']
          : '',
      };
      const infoUrl = convertIiifUriToInfoUri(mainImageService['@id']);
      if (infoUrl) {
        setZoomInfoUrl(infoUrl);
      }
      setShowControls(true);
    }
  }

  return (
    <div data-test-id="main-viewer">
      <FixedSizeList
        width={mainAreaWidth}
        style={{ width: `${mainAreaWidth}px`, margin: '0 auto' }}
        height={mainAreaHeight}
        itemCount={canvases.length}
        itemData={{
          scrollVelocity,
          canvases,
          setShowZoomed,
          setZoomInfoUrl,
          rotatedImages,
          setActiveIndex,
          setIsLoading,
          mainAreaRef,
          errorHandler,
        }}
        itemSize={mainAreaWidth}
        onItemsRendered={debounceHandleOnItemsRendered.current}
        onScroll={handleOnScroll}
        ref={mainViewerRef}
      >
        {ItemRenderer}
      </FixedSizeList>
    </div>
  );
};

export default MainViewer;
