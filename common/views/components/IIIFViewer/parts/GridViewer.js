import styled from 'styled-components';
import { useState, memo } from 'react';
import { FixedSizeGrid, areEqual } from 'react-window';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import LL from '@weco/common/views/components/styled/LL';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';

const Cell = memo(({ columnIndex, rowIndex, style, data, index }) => {
  const {
    columnCount,
    mainViewerRef,
    setIsGridVisible,
    scrollVelocity,
    activeIndex,
    setActiveIndex,
    canvases,
  } = data;
  const itemIndex = rowIndex * columnCount + columnIndex;
  return (
    <div style={style}>
      {scrollVelocity > 1 ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LL />
        </div>
      ) : (
        <IIIFCanvasThumbnail
          canvas={canvases[itemIndex]}
          lang={''} // TODO
          isLazy={true}
          clickHandler={() => {
            mainViewerRef &&
              mainViewerRef.current &&
              mainViewerRef.current.scrollToItem(itemIndex);
            setActiveIndex(itemIndex);
            setIsGridVisible(false);
          }}
          isActive={activeIndex === itemIndex}
          thumbNumber={itemIndex + 1}
        />
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
  background: #555; /* TODO proper colours */
  transition: top 500ms ease;
`;

type Props = {|
  // TODO
  gridHeight: any,
  gridWidth: any,
  isVisible: any,
  mainViewerRef: any,
  setIsGridVisible: any,
  activeIndex: any,
  setActiveIndex: any,
  canvases: any,
|};

const GridViewer = ({
  gridHeight,
  gridWidth,
  isVisible,
  mainViewerRef,
  setIsGridVisible,
  activeIndex,
  setActiveIndex,
  canvases,
}: Props) => {
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const scrollVelocity = useScrollVelocity(newScrollOffset);
  const itemWidth = 300;
  const columnCount = Math.round(gridWidth / itemWidth);
  const columnWidth = gridWidth / columnCount;

  return (
    <GridViewerEl isVisible={isVisible}>
      <FixedSizeGrid
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={gridHeight}
        rowCount={canvases.length / columnCount + 1}
        rowHeight={300}
        width={gridWidth}
        itemData={{
          columnCount,
          mainViewerRef,
          setIsGridVisible,
          scrollVelocity,
          activeIndex,
          setActiveIndex,
          canvases,
        }}
        onScroll={({ scrollTop }) => setNewScrollOffset(scrollTop)}
      >
        {Cell}
      </FixedSizeGrid>
    </GridViewerEl>
  );
};

export default GridViewer;
