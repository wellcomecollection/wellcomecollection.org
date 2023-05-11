import styled from 'styled-components';
import {
  useState,
  memo,
  useEffect,
  useRef,
  useContext,
  FunctionComponent,
  CSSProperties,
} from 'react';
import { FixedSizeGrid, areEqual } from 'react-window';
import useScrollVelocity from '../../hooks/useScrollVelocity';
import LL from '@weco/common/views/components/styled/LL';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';
import Space from '@weco/common/views/components/styled/Space';
import GlobalInfoBarContext from '@weco/common/views/components/GlobalInfoBarContext/GlobalInfoBarContext';
import { SearchResults } from '../../services/iiif/types/search/v3';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { TransformedCanvas } from '../../types/manifest';
import NextLink from 'next/link';
import { toLink as itemLink } from '@weco/catalogue/components/ItemLink';

const Defs = styled.svg`
  position: absolute;
  height: 0;
  width: 0;
  left: -100%;
`;

const ThumbnailSpacer = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  height: 400px;
  a {
    text-decoration: none;
  }
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
    canvases: TransformedCanvas[];
    searchResults: SearchResults;
    manifestParam: number;
    canvasParam: number;
    workId: string;
  };
};

const Cell = memo(({ columnIndex, rowIndex, style, data }: CellProps) => {
  const {
    columnCount,
    gridVisible,
    setGridVisible,
    scrollVelocity,
    canvases,
    searchResults,
    manifestParam,
    canvasParam,
    workId,
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
            <NextLink
              {...itemLink(
                {
                  workId,
                  manifest: manifestParam,
                  canvas: itemIndex + 1,
                },
                'viewer/thumbnail'
              )}
              passHref={true}
              aria-current={true}
              onClick={() => {
                setGridVisible(false);
              }}
            >
              <IIIFCanvasThumbnail
                canvas={currentCanvas}
                isActive={canvasParam === itemIndex + 1}
                thumbNumber={itemIndex + 1}
                isFocusable={gridVisible}
                highlightImage={hasSearchResults}
              />
            </NextLink>
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

const GridViewer: FunctionComponent = () => {
  const {
    mainAreaHeight,
    mainAreaWidth,
    gridVisible,
    setGridVisible,
    transformedManifest,
    isFullscreen,
    searchResults,
    canvasParam,
    manifestParam,
    work,
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
    const rowIndex = Math.floor((canvasParam - 1) / columnCount);
    grid.current?.scrollToItem({ align: 'start', rowIndex });
  }, [canvasParam]);

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
            gridVisible,
            setGridVisible,
            scrollVelocity,
            canvases,
            searchResults,
            mainAreaWidth,
            canvasParam,
            manifestParam,
            workId: work.id,
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
