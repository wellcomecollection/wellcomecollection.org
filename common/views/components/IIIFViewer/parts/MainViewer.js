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
  border: '1px solid red';
  width: 100%;
  height: 100%;
  img {
    height: 95%;
    width: auto;
    display: block;
    margin: auto;
  }
`;

function getImageTypeForScrollVelocity(velocity) {
  // tweak how many velocities ?
  switch (velocity) {
    case 3:
      return 'thumbnail';
    case 2:
      return 'thumbnail';
    case 1:
      return 'thumbnail';
    default:
      return 'main';
  }
}

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
  } = data;
  const [ocrText, setOcrText] = useState('');
  const currentCanvas = canvases[index];
  getCanvasOcr(currentCanvas).then(text => {
    text && setOcrText(text);
  });
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
  const imageType = getImageTypeForScrollVelocity(scrollVelocity);
  return (
    <div style={style} tabIndex={0}>
      {scrollVelocity === 3 || isProgrammaticScroll ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LL lighten={true} />
        </div>
      ) : (
        <>
          <LL lighten={true} />
          {imageType === 'main' && urlTemplateMain && (
            <ImageViewer
              id="item-page"
              infoUrl={infoUrl}
              width={currentCanvas.width}
              height={currentCanvas.height}
              alt={ocrText}
              urlTemplate={urlTemplateMain}
              // presentationOnly={Boolean(canvasOcr)} // TODO
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
              onLoadHandler={() => {
                setIsLoading(false);
              }}
            />
          )}
          {imageType === 'thumbnail' && urlTemplateThumbnail && (
            <ThumbnailWrapper>
              <IIIFResponsiveImage
                width={
                  smallestWidthImageDimensions
                    ? smallestWidthImageDimensions.width
                    : 30
                }
                src={urlTemplateThumbnail({
                  size: `${
                    smallestWidthImageDimensions
                      ? smallestWidthImageDimensions.width
                      : '!100'
                  },`,
                })}
                srcSet={''}
                sizes={`${
                  smallestWidthImageDimensions
                    ? smallestWidthImageDimensions.width
                    : 30
                }px`}
                alt={''}
                isLazy={false}
                lang={null}
              />
            </ThumbnailWrapper>
          )}
        </>
      )}
    </div>
  );
}, areEqual);

type Props = {|
  listHeight: number,
  mainViewerRef: any,
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
  const firstRenderRef = useRef(firstRender);
  firstRenderRef.current = firstRender;
  const scrollVelocity = useScrollVelocity(newScrollOffset);
  const debounceHandleOnItemsRendered = useRef(
    debounce(handleOnItemsRendered, 500)
  );
  const itemHeight = pageWidth * 0.8;
  let scrollEnd;
  function handleOnScroll({ scrollOffset, scrollUpdateWasRequested }) {
    setNewScrollOffset(scrollOffset);
    setIsProgrammaticScroll(scrollUpdateWasRequested);
    setShowControls(false);
    clearTimeout(scrollEnd);
    scrollEnd = setTimeout(() => {
      setShowControls(true);
    }, 1500);
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
    }
  }

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
