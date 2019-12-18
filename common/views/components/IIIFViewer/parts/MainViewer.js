// @flow
import { memo, useState, useRef } from 'react';
import { FixedSizeList, areEqual } from 'react-window';
import type { NextLinkType } from '@weco/common/model/next-link-type';
import debounce from 'lodash.debounce';
import LL from '@weco/common/views/components/styled/LL';
import Router from 'next/router';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import {
  iiifImageTemplate,
  convertIiifUriToInfoUri,
} from '@weco/common/utils/convert-image-uri';
import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer';
import { getCanvasOcr } from '@weco/catalogue/services/catalogue/works';

// function getUrlForScrollVelocity(velocity, canvas, index) {
//   // TODO just pass the case into the ImageViewer? and create appropriate image there?
//   const thumbnailService = canvas.thumbnail.service;
//   const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
//   const smallestWidthImageDimensions = thumbnailService.sizes
//     .sort((a, b) => a.width - b.width)
//     .find(dimensions => dimensions.width > 100);
//   // TODO what to return for each case, thumbnail or full or nothing?
//   switch (velocity) {
//     // case 3:
//     default:
//       return urlTemplate({
//         // thumbnail
//         size: `${
//           smallestWidthImageDimensions
//             ? smallestWidthImageDimensions.width
//             : '!100'
//         },`,
//       });
//     // case 2:
//     //   return 'https://dlcs.io/thumbs/wellcome/5/b18021839_0003.JP2/full/120%2C/0/default.jpg'; // thumbnail
//     // case 1:
//     //   return 'https://dlcs.io/thumbs/wellcome/5/b18021839_0003.JP2/full/120%2C/0/default.jpg'; // Proper image
//     // default:
//     //   return 'https://dlcs.io/thumbs/wellcome/5/b18021839_0003.JP2/full/120%2C/0/default.jpg'; // Proper image
//   }
// }

const ItemRenderer = memo(({ style, index, data }) => {
  const {
    scrollVelocity,
    isProgrammaticScroll,
    canvases,
    setShowZoomed,
    setZoomInfoUrl,
    rotatedImages,
  } = data;
  const [ocrText, setOcrText] = useState('');
  const currentCanvas = canvases[index];
  getCanvasOcr(currentCanvas).then(text => {
    text && setOcrText(text);
  });
  const mainImageService = {
    '@id': currentCanvas ? currentCanvas.images[0].resource.service['@id'] : '',
  };
  const urlTemplate = mainImageService['@id']
    ? iiifImageTemplate(mainImageService['@id'])
    : null;
  const infoUrl = convertIiifUriToInfoUri(mainImageService['@id']);
  const matching = rotatedImages.find(canvas => canvas.canvasIndex === index);
  const rotation = matching ? matching.rotation : 0;
  return (
    <div style={style} tabIndex={0}>
      {scrollVelocity === 3 || isProgrammaticScroll ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LL lighten={true} />
        </div>
      ) : (
        <>
          <LL lighten={true} />
          {urlTemplate && (
            <ImageViewer
              id="item-page"
              infoUrl={infoUrl}
              width={currentCanvas.width}
              height={currentCanvas.height}
              alt={ocrText}
              urlTemplate={urlTemplate}
              // presentationOnly={Boolean(canvasOcr)} // TODO
              setShowZoomed={setShowZoomed}
              setZoomInfoUrl={setZoomInfoUrl}
              rotation={rotation}
            />
          )}
          {/*
                src={getUrlForScrollVelocity(
                  scrollVelocity,
                  canvases[index],
                  index
                )}
              /> */}
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
  link: NextLinkType,
  setShowZoomed: boolean => void,
  setZoomInfoUrl: string => void,
  rotatedImages: [],
  setShowControls: boolean => void,
|};

const MainViewer = ({
  listHeight,
  mainViewerRef,
  setActiveIndex,
  pageWidth,
  canvases,
  canvasIndex,
  link,
  setShowZoomed,
  setZoomInfoUrl,
  rotatedImages,
  setShowControls,
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
    scrollEnd = setTimeout(() => setShowControls(true), 1500);
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
    } else {
      setActiveIndex(visibleStopIndex);
      currentCanvas = canvases && canvases[visibleStopIndex];
      Router.replace(
        {
          ...link.href,
          query: {
            ...link.href.query,
            canvas: `${visibleStopIndex + 1}`,
          },
        },
        {
          ...link.as,
          query: {
            ...link.as.query,
            canvas: `${visibleStopIndex + 1}`,
          },
        }
      );
    }
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
