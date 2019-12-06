import { memo, useState, useRef } from 'react';
import { FixedSizeList, areEqual } from 'react-window';
import debounce from 'lodash.debounce';
import imageData from '../data';
import Loader from './Loader';
import Router from 'next/router';
import useScrollVelocity from '../hooks/useScrollVelocity';

function getUrlForScrollVelocity(velocity, thumbnail, index) {
  const baseUrl = `https://dlcs.io/iiif-img/wellcome/5/b23983565_`;
  switch (velocity) {
    case 3:
      return `${thumbnail}`;
    case 2:
      return `${thumbnail}`;
    case 1:
      return `${baseUrl}${(index + 1)
        .toString()
        .padStart(4, '0')}.jp2/full/500,/0/default.jpg`;
    default:
      return `${baseUrl}${(index + 1)
        .toString()
        .padStart(4, '0')}.jp2/full/500,/0/default.jpg`;
  }
}

const ItemRenderer = memo(({ style, index, data }) => {
  const { scrollVelocity, isProgrammaticScroll, imageData } = data;

  return (
    <div
      style={style}
      onClick={() => window.alert(`launch viewer for page ${index + 1}, yeah?`)}
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
          src={getUrlForScrollVelocity(scrollVelocity, imageData[index], index)}
          alt=""
        />
      )}
    </div>
  );
}, areEqual);

type Props = {|
  // TODO
  listHeight: any,
  mainViewerRef: any,
  setActiveIndex: any,
  pageWidth: any,
|};

const MainViewer = ({
  listHeight,
  mainViewerRef,
  setActiveIndex,
  pageWidth,
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

    Router.replace(`${Router.asPath}#${visibleStartIndex}`);
  }

  return (
    <FixedSizeList
      style={{ width: `${itemHeight}px`, margin: '0 auto' }}
      height={listHeight}
      itemCount={imageData.length}
      itemData={{
        scrollVelocity,
        isProgrammaticScroll,
        imageData,
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
