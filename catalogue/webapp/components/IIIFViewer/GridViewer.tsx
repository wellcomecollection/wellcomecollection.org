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
import useScrollVelocity from '../../hooks/useScrollVelocity';
import LL from '@weco/common/views/components/styled/LL';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';
import Space from '@weco/common/views/components/styled/Space';
import GlobalInfoBarContext from '@weco/common/views/components/GlobalInfoBarContext/GlobalInfoBarContext';
import { SearchResults } from '../../services/iiif/types/search/v3';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { scrollViewer } from './MainViewer';
import { TransformedCanvas } from '../../types/manifest';

const Defs = styled.svg`
  position: absolute;
  height: 0;
  width: 0;
  overflow: none;
  left: -100%;
`;

const ThumbnailSpacer = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  height: 400px;
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
    canvases: TransformedCanvas[];
    searchResults: SearchResults;
    mainAreaWidth: number;
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
    searchResults,
    mainAreaWidth,
  } = data;
  const itemIndex = rowIndex * columnCount + columnIndex;
  const currentCanvas = canvases[itemIndex];
  const hasSearchResults = Boolean(
    searchResults.resources.find(
      resource =>
        currentCanvas &&
        new URL(currentCanvas.id).pathname === new URL(resource.on).pathname
    )
  );

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
                scrollViewer(
                  currentCanvas,
                  itemIndex,
                  mainViewerRef?.current,
                  mainAreaWidth
                );
                setActiveIndex(itemIndex);
                setGridVisible(false);
              }}
              isActive={activeIndex === itemIndex}
              thumbNumber={itemIndex + 1}
              isFocusable={gridVisible}
              highlightImage={hasSearchResults}
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
  background: ${props => props.theme.color('black')};
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
    transformedManifest,
    isFullscreen,
    searchResults,
  } = useContext(ItemViewerContext);
  const { windowSize } = useContext(AppContext);
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const scrollVelocity = useScrollVelocity(newScrollOffset);
  const itemWidth = windowSize === 'small' ? 250 : 350;
  const columnCount = Math.round(mainAreaWidth / itemWidth);
  const columnWidth = mainAreaWidth / columnCount;
  const grid = useRef<FixedSizeGrid>(null);
  const { isVisible } = useContext(GlobalInfoBarContext);
  const { canvases } = transformedManifest;

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
    <>
      {searchResults.resources.length > 0 && (
        <Defs>
          <filter
            id="purpleFilter"
            colorInterpolationFilters="sRGB"
            x="0"
            y="0"
            height="100%"
            width="100%"
          >
            <feColorMatrix
              type="matrix"
              values="0.48 0 0 0 0
            0 0.29 0 0 0
            0 0 0.7 0 0
            0 0 0 1 0"
            />
          </filter>
        </Defs>
      )}
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
          rowCount={canvases ? canvases.length / columnCount + 1 : 0}
          rowHeight={450}
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
            searchResults,
            mainAreaWidth,
          }}
          onScroll={({ scrollTop }) => setNewScrollOffset(scrollTop)}
          ref={grid}
        >
          {Cell}
        </FixedSizeGrid>
      </GridViewerEl>
    </>
  );
};

export default GridViewer;
