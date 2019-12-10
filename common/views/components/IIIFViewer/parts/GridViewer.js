import styled from 'styled-components';
import { useState, memo } from 'react';
import { FixedSizeGrid, areEqual } from 'react-window';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import Loader from './Loader';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';

const Cell = memo(({ columnIndex, rowIndex, style, data }) => {
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
  const thumbnailService =
    canvases[itemIndex] && canvases[itemIndex].thumbnail.service;
  const urlTemplate =
    thumbnailService && iiifImageTemplate(thumbnailService['@id']);
  const smallestWidthImageDimensions =
    thumbnailService &&
    thumbnailService.sizes
      .sort((a, b) => a.width - b.width)
      .find(dimensions => dimensions.width > 100);
  return urlTemplate ? ( // TODO work out why urlTemplate is null for GridViewer and not for ThumbsViewer http://localhost:3001/works/mrg68by5/items?sierraId=b3057822x&langCode=ger#0#0#0#0 - prob something to do with itemIndex that isn't in the canvases array...
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
    </div>
  ) : null;
}, areEqual);
const headerHeight = 149;

const GridViewerEl = styled.div`
  position: fixed;
  top: ${headerHeight}px;
  bottom: 0;
  width: 100vw;
  margin-left: ${props => (props.isVisible ? 0 : '-100vw')};
  z-index: 1;
  background: #555;
  transition: margin-left 500ms ease;
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
