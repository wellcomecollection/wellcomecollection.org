import styled from 'styled-components';
import {
  useState,
  memo,
  useEffect,
  useRef,
  useContext,
  RefObject,
  FunctionComponent,
  CSSProperties,
} from 'react';
import { FixedSizeGrid, FixedSizeList, areEqual } from 'react-window';
import useScrollVelocity from '@weco/common/hooks/useScrollVelocity';
import LL from '@weco/common/views/components/styled/LL';
import IIIFCanvasThumbnail from '../IIIFCanvasThumbnailPrototype/IIIFCanvasThumbnailPrototype';
import Space from '@weco/common/views/components/styled/Space';
import GlobalInfoBarContext from '@weco/common/views/components/GlobalInfoBarContext/GlobalInfoBarContext';
import { IIIFCanvas } from '@weco/common/model/iiif';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';

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

type GridViewerElProps = {
  isVisible?: boolean;
  isFullscreen?: boolean;
  infoBarIsVisible?: boolean;
  viewerRef: RefObject<HTMLElement>;
};

const GridViewerEl = styled.div<GridViewerElProps>`
  outline: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  background: ${props => props.theme.color('viewerBlack')};
  transition: top 500ms ease;
`;

type Props = {
  gridViewerRef: RefObject<HTMLDivElement>;
  mainViewerRef: RefObject<FixedSizeList>;
  viewerRef: RefObject<HTMLElement>;
};

const GridViewer: FunctionComponent<Props> = ({
  gridViewerRef,
  mainViewerRef,
  viewerRef,
}: Props) => {
  const {
    mainAreaHeight,
    mainAreaWidth,
    gridVisible,
    setGridVisible,
    setActiveIndex,
    activeIndex,
    canvases,
    isFullscreen,
  } = useContext(ItemViewerContext);
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const scrollVelocity = useScrollVelocity(newScrollOffset);
  const itemWidth = 250;
  const columnCount = Math.round(mainAreaWidth / itemWidth);
  const columnWidth = mainAreaWidth / columnCount;
  const grid = useRef<FixedSizeGrid>(null);
  const { isVisible } = useContext(GlobalInfoBarContext);

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
    <GridViewerEl
      isVisible={gridVisible}
      isFullscreen={isFullscreen}
      ref={gridViewerRef}
      viewerRef={viewerRef}
      tabIndex={0}
      infoBarIsVisible={isVisible}
    >
      <FixedSizeGrid
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={mainAreaHeight}
        rowCount={canvases.length / columnCount + 1}
        rowHeight={230}
        width={mainAreaWidth}
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
    </GridViewerEl>
  );
};

export default GridViewer;
