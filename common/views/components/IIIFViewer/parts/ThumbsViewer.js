import { FixedSizeList, areEqual } from 'react-window';
import { useState, memo } from 'react';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import Loader from './Loader';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';

const ItemRenderer = memo(({ style, index, data }) => {
  const {
    mainViewerRef,
    scrollVelocity,
    activeIndex,
    setActiveIndex,
    canvases,
  } = data;
  const thumbnailService = canvases[index].thumbnail.service; // TODO make this function to share across MainV, GridV and ThumbV
  const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
  const smallestWidthImageDimensions = thumbnailService.sizes
    .sort((a, b) => a.width - b.width)
    .find(dimensions => dimensions.width > 100);
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
          src={urlTemplate({
            size: `${
              smallestWidthImageDimensions
                ? smallestWidthImageDimensions.width
                : '!100'
            },`,
          })}
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
  canvases: any,
|};

const ThumbsViewer = ({
  listHeight,
  mainViewerRef,
  activeIndex,
  setActiveIndex,
  canvases,
}: Props) => {
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const scrollVelocity = useScrollVelocity(newScrollOffset);

  function handleOnScroll({ scrollOffset }) {
    setNewScrollOffset(scrollOffset);
  }

  return (
    <FixedSizeList
      height={listHeight}
      itemCount={canvases.length}
      itemSize={0.2 * listHeight}
      style={{ background: '#555' }}
      onScroll={handleOnScroll}
      itemData={{
        mainViewerRef,
        scrollVelocity,
        activeIndex,
        setActiveIndex,
        canvases,
      }}
    >
      {ItemRenderer}
    </FixedSizeList>
  );
};

export default ThumbsViewer;
