// @flow
import { memo, useState, useRef } from 'react';
import { FixedSizeList, areEqual } from 'react-window';
import debounce from 'lodash.debounce';
import styled from 'styled-components';
import LL from '@weco/common/views/components/styled/LL';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import {
  iiifImageTemplate,
  convertIiifUriToInfoUri,
} from '@weco/common/utils/convert-image-uri';
import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import { getCanvasOcr } from '@weco/catalogue/services/catalogue/works';

const ThumbnailWrapper = styled.div`
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

const ItemRenderer = memo(({ style, index, data }) => {
  const {
    scrollVelocity,
    isProgrammaticScroll,
    canvases,
    setShowZoomed,
    setZoomInfoUrl,
    rotatedImages,
    mainViewerRef,
    setActiveIndex,
    setIsLoading,
    ocrText,
  } = data;
  const [mainLoaded, setMainLoaded] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const currentCanvas = canvases[index];
  const mainImageService = {
    '@id': currentCanvas ? currentCanvas.images[0].resource.service['@id'] : '',
  };
  const urlTemplateMain = mainImageService['@id']
    ? iiifImageTemplate(mainImageService['@id'])
    : null;
  const thumbnailService = currentCanvas.thumbnail.service;
  const urlTemplateThumbnail = iiifImageTemplate(thumbnailService['@id']);
  const smallestWidthImageDimensions = thumbnailService.sizes
    .sort((a, b) => a.width - b.width)
    .find(dimensions => dimensions.width > 100);

  const infoUrl = convertIiifUriToInfoUri(mainImageService['@id']);
  const matching = rotatedImages.find(canvas => canvas.canvasIndex === index);
  const rotation = matching ? matching.rotation : 0;
  const imageType = scrollVelocity >= 1 ? 'thumbnail' : 'main';
  return (
    <div style={style}>
      {scrollVelocity === 3 || isProgrammaticScroll ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LL lighten={true} />
        </div>
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
                lang={null}
                loadHandler={() => {
                  setThumbLoaded(true);
                }}
              />
            </ThumbnailWrapper>
          )}
          {(imageType === 'main' || mainLoaded) && urlTemplateMain && (
            <ImageViewer
              id="item-page"
              infoUrl={infoUrl}
              width={currentCanvas.width}
              height={currentCanvas.height}
              alt={ocrText}
              urlTemplate={urlTemplateMain}
              setShowZoomed={setShowZoomed}
              setZoomInfoUrl={setZoomInfoUrl}
              rotation={rotation}
              mainViewerRef={
                mainViewerRef && mainViewerRef.current
                  ? mainViewerRef.current
                  : null
              }
              setActiveIndex={setActiveIndex}
              index={index}
              loadHandler={() => {
                setMainLoaded(true);
                setIsLoading(false);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}, areEqual);

type Props = {|
  listHeight: number,
  mainViewerRef: { current: FixedSizeList | null },
  setActiveIndex: number => void,
  pageWidth: number,
  canvases: [],
  canvasIndex: number,
  setShowZoomed: boolean => void,
  setZoomInfoUrl: string => void,
  rotatedImages: [],
  setShowControls: boolean => void,
  setIsLoading: boolean => void,
|};

const MainViewer = ({
  listHeight,
  mainViewerRef,
  setActiveIndex,
  pageWidth,
  canvases,
  canvasIndex,
  setShowZoomed,
  setZoomInfoUrl,
  rotatedImages,
  setShowControls,
  setIsLoading,
}: Props) => {
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const [ocrText, setOcrText] = useState('');
  const firstRenderRef = useRef(firstRender);
  firstRenderRef.current = firstRender;
  const scrollVelocity = useScrollVelocity(newScrollOffset);
  const debounceHandleOnItemsRendered = useRef(
    debounce(handleOnItemsRendered, 500)
  );
  const timer = useRef(null);
  const itemHeight = pageWidth * 0.8;
  function handleOnScroll({ scrollOffset, scrollUpdateWasRequested }) {
    clearTimeout(timer.current);
    setShowControls(false);
    setNewScrollOffset(scrollOffset);
    setIsProgrammaticScroll(scrollUpdateWasRequested);

    timer.current = setTimeout(() => {
      setShowControls(true);
    }, 500);
  }

  function handleOnItemsRendered({ visibleStopIndex }) {
    setIsProgrammaticScroll(false);
    let currentCanvas;
    if (firstRenderRef.current) {
      setActiveIndex(canvasIndex);
      mainViewerRef &&
        mainViewerRef.current &&
        mainViewerRef.current.scrollToItem(canvasIndex, 'start');
      setFirstRender(false);
      currentCanvas = canvases && canvases[canvasIndex];
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

  getCanvasOcr(canvases[canvasIndex]).then(t => setOcrText(t || ''));

  return (
    <FixedSizeList
      style={{ width: `${itemHeight}px`, margin: '0 auto' }}
      height={listHeight}
      itemCount={canvases.length}
      itemData={{
        scrollVelocity,
        isProgrammaticScroll,
        canvases,
        setShowZoomed,
        setZoomInfoUrl,
        rotatedImages,
        setActiveIndex,
        setIsLoading,
        ocrText,
        mainViewerRef,
      }}
      itemSize={itemHeight}
      onItemsRendered={debounceHandleOnItemsRendered.current}
      onScroll={handleOnScroll}
      ref={mainViewerRef}
    >
      {ItemRenderer}
    </FixedSizeList>
  );
};

export default MainViewer;
