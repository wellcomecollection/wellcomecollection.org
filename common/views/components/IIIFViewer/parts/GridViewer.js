import styled from 'styled-components';
import { useState, memo } from 'react';
import { FixedSizeGrid, areEqual } from 'react-window';
import imageData from '../data/data';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import Loader from './Loader';

const Cell = memo(({ columnIndex, rowIndex, style, data }) => {
  const {
    columnCount,
    imageData,
    mainViewerRef,
    setIsGridVisible,
    scrollVelocity,
    activeIndex,
    setActiveIndex,
  } = data;
  const itemIndex = rowIndex * columnCount + columnIndex;

  return (
    <div
      style={style}
      onClick={() => {
        mainViewerRef &&
          mainViewerRef.current &&
          mainViewerRef.current.scrollToItem(itemIndex);
        setActiveIndex(itemIndex);
        setIsGridVisible(false);
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '20px',
        }}
      >
        {scrollVelocity > 1 ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Loader />
          </div>
        ) : (
          <img
            style={{
              width: '130px',
              display: 'block',
              border: `5px solid ${
                activeIndex === itemIndex ? 'yellow' : 'transparent'
              }`,
            }}
            src={imageData[itemIndex]}
            alt=""
          />
        )}
      </div>
    </div>
  );
}, areEqual);

const GridViewerEl = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  background: #555;
  transform: ${props =>
    props.isVisible ? 'translateY(0%)' : 'translateY(100%)'};
  transition: transform 500ms ease;
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
|};

const GridViewer = ({
  gridHeight,
  gridWidth,
  isVisible,
  mainViewerRef,
  setIsGridVisible,
  activeIndex,
  setActiveIndex,
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
        rowCount={imageData.length / columnCount + 1}
        rowHeight={300}
        width={gridWidth}
        itemData={{
          imageData,
          columnCount,
          mainViewerRef,
          setIsGridVisible,
          scrollVelocity,
          activeIndex,
          setActiveIndex,
        }}
        onScroll={({ scrollTop }) => setNewScrollOffset(scrollTop)}
      >
        {Cell}
      </FixedSizeGrid>
    </GridViewerEl>
  );
};

export default GridViewer;
