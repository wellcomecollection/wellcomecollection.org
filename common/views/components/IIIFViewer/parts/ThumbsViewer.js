import { FixedSizeList, areEqual } from 'react-window';
import { useState, memo } from 'react';
import styled from 'styled-components';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import LL from '@weco/common/views/components/styled/LL';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';
import Space from '@weco/common/views/components/styled/Space';

const ThumbnailSpacer = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  height: 100%;
`;

const ItemRenderer = memo(({ style, index, data }) => {
  const {
    mainViewerRef,
    scrollVelocity,
    activeIndex,
    setActiveIndex,
    canvases,
  } = data;
  const currentCanvas = canvases[index];
  return (
    <div style={style}>
      {scrollVelocity > 1 ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LL />
        </div>
      ) : (
        currentCanvas && (
          <ThumbnailSpacer>
            <IIIFCanvasThumbnail
              canvas={currentCanvas}
              lang={''} // TODO
              clickHandler={() => {
                mainViewerRef &&
                  mainViewerRef.current &&
                  mainViewerRef.current.scrollToItem(index, 'start');
                setActiveIndex(index);
              }}
              isActive={activeIndex === index}
              thumbNumber={index + 1}
            />
          </ThumbnailSpacer>
        )
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
