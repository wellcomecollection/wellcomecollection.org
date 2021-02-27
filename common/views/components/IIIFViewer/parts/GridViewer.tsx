import styled from 'styled-components';
import {
  useState,
  memo,
  useEffect,
  useRef,
  RefObject,
  FunctionComponent,
  CSSProperties,
} from 'react';
import { FixedSizeGrid, FixedSizeList, areEqual } from 'react-window';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import LL from '@weco/common/views/components/styled/LL';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';
import Space from '@weco/common/views/components/styled/Space';
import { IIIFCanvas } from '../../../../model/iiif';

const ThumbnailSpacer = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  height: 200px;
`;

type CellProps = {
  style: CSSProperties;
  columnIndex: number;
  rowIndex: number;
  index: number;
  data: {
    scrollVelocity: number;
    columnCount: number;
    gridVisible: boolean;
    setGridVisible: (value: boolean) => void;
    mainViewerRef: RefObject<FixedSizeList>;
    activeIndex: number;
    setActiveIndex: (i: number) => void;
    canvases: IIIFCanvas[];
  };
};

const Cell = memo(({ columnIndex, rowIndex, style, data }: CellProps) => {
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

Cell.displayName = 'Cell';

type Props = {
  gridHeight: number;
  gridWidth: number;
  gridVisible: boolean;
  gridViewerRef: RefObject<HTMLDivElement>;
  mainViewerRef: RefObject<FixedSizeList>;
  setGridVisible: (visible: boolean) => void;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  canvases: IIIFCanvas[];
  isFullscreen: boolean;
  viewerRef: RefObject<HTMLElement>;
};

const GridViewer: FunctionComponent<Props> = ({
  gridHeight,
  gridWidth,
  gridVisible,
  gridViewerRef,
  mainViewerRef,
  setGridVisible,
  activeIndex,
  setActiveIndex,
  canvases,
}: Props) => {
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const scrollVelocity = useScrollVelocity(newScrollOffset);
  const itemWidth = 250;
  const columnCount = Math.round(gridWidth / itemWidth);
  const columnWidth = gridWidth / columnCount;
  const grid = useRef<FixedSizeGrid>(null);

  useEffect(() => {
    const rowIndex = Math.floor(activeIndex / columnCount);
    grid.current?.scrollToItem({ align: 'start', rowIndex });
  }, [activeIndex]);

  useEffect(() => {
    // required to be set as we are setting the body to overflow hidden to stop multiple scrolls in view bug issue.
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 700);

    const body = document && document.body ? document.body : null;
    // there are multiple scrolls in this view, we have to set the body to hidden to stop flickering and offset
    if (body && body.style) {
      body.style.overflow = 'hidden';
    }

    return () => {
      // unmounting
      if (body && body.style) {
        body.style.overflow = '';
      }
    };
  }, []);

  return (
    <div ref={gridViewerRef}>
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
        ref={grid}
      >
        {Cell}
      </FixedSizeGrid>
    </div>
  );
};

export default GridViewer;
