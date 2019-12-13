import { memo, useState, useRef } from 'react';
import { FixedSizeList, areEqual } from 'react-window';
import debounce from 'lodash.debounce';
import LL from '@weco/common/views/components/styled/LL';
import Router from 'next/router';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import {
  iiifImageTemplate,
  convertIiifUriToInfoUri,
} from '@weco/common/utils/convert-image-uri';
import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer';

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
    rotation,
    lang,
    setShowZoomed,
    setZoomInfoUrl,
    showControls,
  } = data;
  const currentCanvas = canvases[index];
  const mainImageService = {
    '@id': currentCanvas ? currentCanvas.images[0].resource.service['@id'] : '',
  };
  const urlTemplate =
    mainImageService['@id'] && iiifImageTemplate(mainImageService['@id']);
  const infoUrl = convertIiifUriToInfoUri(mainImageService['@id']);
  return (
    <>
      <div style={style}>
        {scrollVelocity === 3 || isProgrammaticScroll ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LL />
          </div>
        ) : (
          <>
            <ImageViewer
              id="item-page"
              infoUrl={infoUrl}
              width={currentCanvas.width}
              height={currentCanvas.height}
              lang={lang}
              // alt={
              //   canvasOcr && work && work.title
              //     ? `image from ${work && work.title}`
              //     : ''
              // }
              urlTemplate={urlTemplate}
              // presentationOnly={Boolean(canvasOcr)}
              rotation={rotation}
              setShowZoomed={setShowZoomed}
              setZoomInfoUrl={setZoomInfoUrl}
              showControls={showControls}
            />
            {/* <img
              style={{
                paddingTop: '10px',
                display: 'block',
                height: '90%',
                width: 'auto',
                margin: '0 auto',
              }}
              src={getUrlForScrollVelocity(
                scrollVelocity,
                canvases[index],
                index
              )}
              alt=""
            /> */}
          </>
        )}
      </div>
    </>
  );
}, areEqual);

type Props = {|
  // TODO
  listHeight: any,
  mainViewerRef: any,
  activeIndex: number,
  setActiveIndex: any,
  pageWidth: any,
  canvases: any,
  link: any,
  rotation: number,
  lang: string,
  setShowZoomed: () => void,
  setZoomInfoUrl: () => void,
|};

const MainViewer = ({
  listHeight,
  mainViewerRef,
  activeIndex,
  setActiveIndex,
  pageWidth,
  canvases,
  link,
  rotation,
  lang,
  setShowZoomed,
  setZoomInfoUrl,
}: Props) => {
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const [showControls, setShowControls] = useState(false);
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
    setActiveIndex(visibleStopIndex);
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

  return (
    <FixedSizeList
      style={{ width: `${itemHeight}px`, margin: '0 auto' }}
      height={listHeight}
      itemCount={canvases.length}
      itemData={{
        scrollVelocity,
        isProgrammaticScroll,
        canvases,
        rotation,
        lang,
        setShowZoomed,
        setZoomInfoUrl,
        showControls,
        activeIndex,
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
