import { memo, useState, useRef } from 'react';
import { FixedSizeList, areEqual } from 'react-window';
import debounce from 'lodash.debounce';
import Loader from './Loader';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import {
  iiifImageTemplate,
  convertIiifUriToInfoUri,
} from '@weco/common/utils/convert-image-uri';
import LL from '../../styled/LL'; // TODO replace?

const LoadingComponent = () => (
  <div
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: '1000',
    }}
  >
    <LL />
  </div>
);

const ZoomedImage = dynamic(() => import('../../ZoomedImage/ZoomedImage'), {
  ssr: false,
  loading: LoadingComponent,
});

function getUrlForScrollVelocity(velocity, thumbnail, index) {
  const thumbnailService = thumbnail.thumbnail.service; // TODO DON'T USE THUMBNAIL USE PROPER CANVAS
  const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
  const smallestWidthImageDimensions = thumbnailService.sizes
    .sort((a, b) => a.width - b.width)
    .find(dimensions => dimensions.width > 400); // TODO put back to 100
  // TODO what to return for each case, thumbnail or full or nothing?
  switch (velocity) {
    // case 3:
    default:
      return urlTemplate({
        // thumbnail
        size: `${
          smallestWidthImageDimensions
            ? smallestWidthImageDimensions.width
            : '!100'
        },`,
      });
    // case 2:
    //   return 'https://dlcs.io/thumbs/wellcome/5/b18021839_0003.JP2/full/120%2C/0/default.jpg'; // thumbnail
    // case 1:
    //   return 'https://dlcs.io/thumbs/wellcome/5/b18021839_0003.JP2/full/120%2C/0/default.jpg'; // Proper image
    // default:
    //   return 'https://dlcs.io/thumbs/wellcome/5/b18021839_0003.JP2/full/120%2C/0/default.jpg'; // Proper image
  }
}

const ItemRenderer = memo(({ style, index, data }) => {
  const { scrollVelocity, isProgrammaticScroll, canvases, rotation } = data;
  const [showViewer, setShowViewer] = useState(false);
  const currentCanvas = canvases[index];
  const mainImageService = {
    '@id': currentCanvas ? currentCanvas.images[0].resource.service['@id'] : '',
  };
  console.log(rotation);
  return (
    <>
      {showViewer && (
        <ZoomedImage
          id={index}
          infoUrl={convertIiifUriToInfoUri(mainImageService['@id'])}
          setShowViewer={setShowViewer}
        />
      )}
      <div
        style={style}
        onClick={() => {
          setShowViewer(true);
        }}
      >
        {scrollVelocity === 3 || isProgrammaticScroll ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Loader />
          </div>
        ) : (
          <img
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
          />
        )}
      </div>
    </>
  );
}, areEqual);

type Props = {|
  // TODO
  listHeight: any,
  mainViewerRef: any,
  setActiveIndex: any,
  pageWidth: any,
  canvases: any,
  link: any,
  rotation: number,
|};

const MainViewer = ({
  listHeight,
  mainViewerRef,
  setActiveIndex,
  pageWidth,
  canvases,
  link,
  rotation,
}: Props) => {
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const scrollVelocity = useScrollVelocity(newScrollOffset);
  const debounceHandleOnItemsRendered = useRef(
    debounce(handleOnItemsRendered, 500)
  );
  const itemHeight = pageWidth * 0.8;

  function handleOnScroll({ scrollOffset, scrollUpdateWasRequested }) {
    setNewScrollOffset(scrollOffset);
    setIsProgrammaticScroll(scrollUpdateWasRequested);
  }

  function handleOnItemsRendered({ visibleStartIndex }) {
    setIsProgrammaticScroll(false);
    Router.replace(
      {
        ...link.href,
        query: {
          ...link.href.query,
          canvas: `${visibleStartIndex + 1}`,
        },
      },
      {
        ...link.as,
        query: {
          ...link.as.query,
          canvas: `${visibleStartIndex + 1}`,
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
