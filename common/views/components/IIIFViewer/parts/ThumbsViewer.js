// @flow
import { FixedSizeList, areEqual } from 'react-window';
import { useState, memo } from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import LL from '@weco/common/views/components/styled/LL';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';
import Space from '@weco/common/views/components/styled/Space';

const ThumbnailsWrapper = styled.div`
  background: ${props => props.theme.colors.viewerBlack};
  border-right: 1px solid
    ${props => lighten(0.1, props.theme.colors.viewerBlack)};
`;

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
          <LL lighten={true} />
        </div>
      ) : (
        currentCanvas && (
          <ThumbnailSpacer>
            <IIIFCanvasThumbnail
              canvas={currentCanvas}
              clickHandler={() => {
                mainViewerRef &&
                  mainViewerRef.current &&
                  mainViewerRef.current.scrollToItem(index, 'start');
                setActiveIndex(index);
              }}
              isActive={activeIndex === index}
              thumbNumber={index + 1}
              isFocusable={false}
            />
          </ThumbnailSpacer>
        )
      )}
    </div>
  );
}, areEqual);

type Props = {|
  listHeight: number,
  mainViewerRef: { current: FixedSizeList | null },
  activeIndex: number,
  setActiveIndex: number => void,
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
    <ThumbnailsWrapper>
      <FixedSizeList
        height={listHeight}
        itemCount={canvases.length}
        itemSize={0.3 * listHeight}
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
    </ThumbnailsWrapper>
  );
};

export default ThumbsViewer;
