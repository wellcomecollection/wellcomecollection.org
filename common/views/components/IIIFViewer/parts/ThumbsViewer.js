import { FixedSizeList, areEqual } from 'react-window';
import imageData from '../data/data';
import { useState, memo } from 'react';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import Loader from './Loader';

const ItemRenderer = memo(({ style, index, data }) => {
  const { mainViewerRef, scrollVelocity, activeIndex, setActiveIndex } = data;

  return (
    <div
      style={style}
      onClick={() => {
        mainViewerRef &&
          mainViewerRef.current &&
          mainViewerRef.current.scrollToItem(index, 'start');

        setActiveIndex(index);
      }}
    >
      {scrollVelocity > 1 ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Loader />
        </div>
      ) : (
        <img
          style={{
            display: 'block',
            height: '95%',
            width: 'auto',
            margin: '5px auto 0',
            border: `3px solid ${
              activeIndex === index ? 'yellow' : 'transparent'
            }`,
          }}
          src={imageData[index]}
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
  activeIndex: any,
  setActiveIndex: any,
|};

const ThumbsViewer = ({
  listHeight,
  mainViewerRef,
  activeIndex,
  setActiveIndex,
}: Props) => {
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const scrollVelocity = useScrollVelocity(newScrollOffset);

  function handleOnScroll({ scrollOffset }) {
    setNewScrollOffset(scrollOffset);
  }

  return (
    <FixedSizeList
      height={listHeight}
      itemCount={imageData.length}
      itemSize={0.2 * listHeight}
      style={{ background: '#555' }}
      onScroll={handleOnScroll}
      itemData={{
        mainViewerRef,
        scrollVelocity,
        activeIndex,
        setActiveIndex,
      }}
    >
      {ItemRenderer}
    </FixedSizeList>
  );
};

export default ThumbsViewer;
