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
import IIIFViewerImage from './IIIFViewerImage';
import { missingAltTextMessage } from '@weco/catalogue/services/wellcome/catalogue/works';
import { font } from '@weco/common/utils/classnames';
import { SearchResults } from '../../services/iiif/types/search/v3';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import ImageViewer from './ImageViewer';
import { TransformedCanvas } from '../../types/manifest';
import { fetchCanvasOcr } from '../../services/iiif/fetch/canvasOcr';
import { transformCanvasOcr } from '../../services/iiif/transformers/canvasOcr';
import { AuthExternalService } from '@iiif/presentation-3';

type SearchTermHighlightProps = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const SearchTermHighlight = styled.div<SearchTermHighlightProps>`
  background: ${props => props.theme.color('accent.purple')};
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
  border: 1px solid ${props => props.theme.color('neutral.600')};
  height: 80%;
  margin-top: 50%;
  transform: translateY(-50%);
  padding: 10%;
`;

const ThumbnailWrapper = styled.div<{ imageLoaded?: boolean }>`
  opacity: ${props => (props.imageLoaded ? 1 : 0)};
  transition: opacity 500ms ease;
  position: absolute;
  width: calc(100% - 20px);
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
    canvases: TransformedCanvas[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rotatedImages: any[];
    setIsLoading: (value: boolean) => void;
    errorHandler?: () => void;
    restrictedService: AuthExternalService | undefined;
  };
};

function getPositionData(
  imageContainerRect: ClientRect,
  imageRect: ClientRect,
  currentCanvas: TransformedCanvas,
  searchResults: SearchResults,
  canvases: TransformedCanvas[]
) {
  const imageContainerTop = imageContainerRect?.top || 0;
  const imageTop = imageRect?.top || 0;
  const imageContainerLeft = imageContainerRect?.left || 0;
  const imageLeft = imageRect?.left || 0;
  const overlayStartTop = imageTop - imageContainerTop;
  const overlayStartLeft = imageLeft - imageContainerLeft;
  const scale =
    imageRect && currentCanvas.width
      ? imageRect.width / currentCanvas.width
      : 1;
  const highlightsPositioningData =
    searchResults &&
    searchResults?.resources.map(resource => {
      // on: "https://wellcomelibrary.org/iiif/b30330002/canvas/c55#xywh=2301,662,157,47"
      // OR
      // on: https://iiif.wellcomecollection.org/presentation/b29338062/canvases/b29338062_0031.jp2#xywh=148,2277,259,59"
      const canvasNumber = canvases.findIndex(canvas => {
        return new URL(resource.on).pathname === new URL(canvas.id).pathname;
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
  const {
    scrollVelocity,
    canvases,
    rotatedImages,
    setIsLoading,
    mainAreaRef,
    restrictedService,
  } = data;
  const [mainLoaded, setMainLoaded] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const currentCanvas = canvases[index];
  const mainImageService = { '@id': currentCanvas.imageServiceId };
  const urlTemplateMain = mainImageService['@id']
    ? iiifImageTemplate(mainImageService['@id'])
    : undefined;
  const infoUrl =
    mainImageService['@id'] && convertIiifUriToInfoUri(mainImageService['@id']);
  const matching = rotatedImages.find(
    canvas => canvas.canvasParam === index + 1
  );

  const rotation = matching ? matching.rotation : 0;
  const imageType = scrollVelocity >= 1 ? 'thumbnail' : 'main';
  const isRestricted = currentCanvas.hasRestrictedImage;
  const { searchResults } = useContext(ItemViewerContext);
  const [imageRect, setImageRect] = useState<ClientRect | undefined>();
  const [imageContainerRect, setImageContainerRect] = useState<
    ClientRect | undefined
  >();
  const [ocrText, setOcrText] = useState(missingAltTextMessage);

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

  useEffect(() => {
    const fetchOcr = async () => {
      const ocrText = await fetchCanvasOcr(canvases[index]);
      const ocrString = transformCanvasOcr(ocrText);
      setOcrText(ocrString || missingAltTextMessage);
    };
    fetchOcr();
  }, []);

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
          <h2 className={font('intb', 4)}>{restrictedService?.label}</h2>
          <p
            className={font('intr', 5)}
            dangerouslySetInnerHTML={{
              __html: restrictedService?.description || '',
            }}
          />
        </MessageContainer>
      ) : (
        <>
          <LL lighten={true} />
          {!mainLoaded && currentCanvas.thumbnailImage && (
            <ThumbnailWrapper imageLoaded={thumbLoaded}>
              <IIIFViewerImage
                width={currentCanvas.width || 0}
                height={currentCanvas.height || 0}
                src={currentCanvas.thumbnailImage.url}
                srcSet=""
                sizes=""
                alt=""
                lang={undefined}
                loadHandler={() => {
                  setThumbLoaded(true);
                }}
              />
            </ThumbnailWrapper>
          )}
          {(imageType === 'main' || mainLoaded) &&
            urlTemplateMain &&
            infoUrl && (
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
                    width={currentCanvas.width || 0}
                    height={currentCanvas.height || 0}
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
  currentCanvas: TransformedCanvas | undefined,
  canvasIndex: number,
  viewer: FixedSizeList | null,
  mainAreaWidth: number
): void {
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
  mainAreaRef: RefObject<HTMLDivElement>;
};

const MainViewer: FunctionComponent<Props> = ({ mainAreaRef }: Props) => {
  const {
    mainAreaHeight,
    mainAreaWidth,
    transformedManifest,
    canvasIndex,
    canvasParam,
    setShowZoomed,
    setZoomInfoUrl,
    setIsLoading,
    rotatedImages,
    setShowControls,
    errorHandler,
  } = useContext(ItemViewerContext);
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
  const { canvases, restrictedService } = transformedManifest;

  function handleOnScroll({ scrollOffset }) {
    timer.current && clearTimeout(timer.current);
    setShowControls(false);
    setNewScrollOffset(scrollOffset);

    timer.current = setTimeout(() => {
      setShowControls(true);
    }, 500);
  }

  function handleOnItemsRendered() {
    let currentCanvas: TransformedCanvas | undefined;
    if (firstRenderRef.current) {
      currentCanvas = canvases?.[canvasIndex];
      const viewer = mainViewerRef?.current;

      scrollViewer(currentCanvas, canvasIndex, viewer, mainAreaWidth);
      setFirstRender(false);
      const mainImageService = {
        '@id': currentCanvas ? currentCanvas.imageServiceId : '',
      };
      const infoUrl = convertIiifUriToInfoUri(mainImageService['@id'] || '');
      if (infoUrl) {
        setZoomInfoUrl(infoUrl);
      }
      setShowControls(true);
    }
  }

  // Scroll to the correct canvas if the canvasIndex, i.e. url canvas param changes
  // TODO do we need to handle landscapes here too? Maybe use scrollViewer function from here
  useEffect(() => {
    const canvasIndex = canvasParam - 1; // TODO do this somewhere else and comment on why
    mainViewerRef?.current?.scrollToItem(canvasIndex, 'start');
  }, [canvasParam]);

  return (
    <div data-test-id="main-viewer">
      <FixedSizeList
        width={mainAreaWidth}
        style={{ width: `${mainAreaWidth}px`, margin: '0 auto' }}
        height={mainAreaHeight}
        itemCount={canvases?.length || 0}
        itemData={{
          scrollVelocity,
          canvases,
          setShowZoomed,
          setZoomInfoUrl,
          rotatedImages,
          setIsLoading,
          mainAreaRef,
          errorHandler,
          restrictedService,
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
