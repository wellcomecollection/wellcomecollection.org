import styled from 'styled-components';
import { useState, memo, useEffect, useRef } from 'react';
import { FixedSizeGrid, areEqual } from 'react-window';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import LL from '@weco/common/views/components/styled/LL';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';
import Space from '@weco/common/views/components/styled/Space';

const ThumbnailSpacer = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  height: 200px;
`;

const Cell = memo(({ columnIndex, rowIndex, style, data, index }) => {
  const {
    columnCount,
    mainViewerRef,
    gridVisible,
    setGridVisible,
    scrollVelocity,
    activeIndex,
    setActiveIndex,
    canvases,
  } = data;
  const itemIndex = rowIndex * columnCount + columnIndex;
  const currentCanvas = canvases[itemIndex];
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
              clickHandler={() => {
                mainViewerRef &&
                  mainViewerRef.current &&
                  mainViewerRef.current.scrollToItem(itemIndex);
                setActiveIndex(itemIndex);
                setGridVisible(false);
              }}
              isActive={activeIndex === itemIndex}
              thumbNumber={itemIndex + 1}
              isFocusable={gridVisible}
            />
          </ThumbnailSpacer>
        )
      )}
    </div>
  );
}, areEqual);
const headerHeight = 149;

const GridViewerEl = styled.div`
  position: fixed;
  top: ${props => (props.isVisible ? `${headerHeight}px` : '100vh')};
  left: 0;
  bottom: 0;
  width: 100vw;
  z-index: 1;
  background: ${props => props.theme.colors.viewerBlack};
  transition: top 500ms ease;
`;

type Props = {|
  // TODO
  gridHeight: any,
  gridWidth: any,
  gridVisible: any,
  mainViewerRef: any,
  setGridVisible: any,
  activeIndex: any,
  setActiveIndex: any,
  canvases: any,
|};

const GridViewer = ({
  gridHeight,
  gridWidth,
  gridVisible,
  mainViewerRef,
  setGridVisible,
  activeIndex,
  setActiveIndex,
  canvases,
}: Props) => {
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const gridViewerRef = useRef(null);
  const scrollVelocity = useScrollVelocity(newScrollOffset);
  const itemWidth = 250;
  const columnCount = Math.round(gridWidth / itemWidth);
  const columnWidth = gridWidth / columnCount;

  useEffect(() => {
    const rowIndex = Math.floor(activeIndex / columnCount);
    gridViewerRef &&
      gridViewerRef.current &&
      gridViewerRef.current.scrollToItem({ align: 'start', rowIndex });
  }, [activeIndex]);

  return (
    <GridViewerEl isVisible={gridVisible}>
      <FixedSizeGrid
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={gridHeight}
        rowCount={canvases.length / columnCount + 1}
        rowHeight={230}
        width={gridWidth}
        itemData={{
          columnCount,
          mainViewerRef,
          gridVisible,
          setGridVisible,
          scrollVelocity,
          activeIndex,
          setActiveIndex,
          canvases,
        }}
        onScroll={({ scrollTop }) => setNewScrollOffset(scrollTop)}
        ref={gridViewerRef}
      >
        {Cell}
      </FixedSizeGrid>
    </GridViewerEl>
  );
};

export default GridViewer;
