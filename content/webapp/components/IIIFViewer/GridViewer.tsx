import NextLink from 'next/link';
import {
  CSSProperties,
  FunctionComponent,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { areEqual, FixedSizeGrid } from 'react-window';
import styled from 'styled-components';

import { AppContext } from '@weco/common/views/components/AppContext';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { toLink as itemLink } from '@weco/content/components/ItemLink';
import ItemViewerContext, {
  Query,
} from '@weco/content/components/ItemViewerContext';
import useScrollVelocity from '@weco/content/hooks/useScrollVelocity';
import { SearchResults } from '@weco/content/services/iiif/types/search/v3';
import { TransformedCanvas } from '@weco/content/types/manifest';

import { arrayIndexToQueryParam, queryParamToArrayIndex } from '.';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';

const ThumbnailSpacer = styled(Space).attrs({
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  height: 400px;

  a {
    display: block;
    height: 100%;
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
    query: Query;
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
    query,
    workId,
  } = data;
  const canvasIndex = rowIndex * columnCount + columnIndex;
  const currentCanvas = canvases[canvasIndex];
  const hasSearchResults = Boolean(
    searchResults?.resources.find(
      resource =>
        currentCanvas &&
        new URL(currentCanvas.id).pathname === new URL(resource.on).pathname
    )
  );

  return (
    <div style={style}>
      {scrollVelocity > 1 ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LL $lighten={true} />
        </div>
      ) : (
        currentCanvas && (
          <ThumbnailSpacer>
            <NextLink
              replace={true}
              {...itemLink({
                workId,
                props: {
                  manifest: query.manifest,
                  query: query.query,
                  canvas: arrayIndexToQueryParam(canvasIndex),
                },
                source: 'viewer/thumbnail',
              })}
              aria-current={
                canvasIndex === queryParamToArrayIndex(query.canvas)
              }
              onClick={() => {
                setGridVisible(false);
              }}
              tabIndex={gridVisible ? 0 : -1}
            >
              <IIIFCanvasThumbnail
                canvas={currentCanvas}
                thumbNumber={arrayIndexToQueryParam(canvasIndex)}
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

const GridViewerEl = styled.div`
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
    searchResults,
    query,
    work,
  } = useContext(ItemViewerContext);
  const { windowSize } = useContext(AppContext);
  const [newScrollOffset, setNewScrollOffset] = useState(0);
  const scrollVelocity = useScrollVelocity(newScrollOffset);
  const itemWidth = windowSize === 'small' ? 250 : 350;
  const columnCount = Math.round(mainAreaWidth / itemWidth);
  const columnWidth = mainAreaWidth / columnCount;
  const grid = useRef<FixedSizeGrid>(null);
  const canvases = transformedManifest?.canvases;

  useEffect(() => {
    const rowIndex = Math.floor(
      queryParamToArrayIndex(query.canvas) / columnCount
    );
    grid.current?.scrollToItem({ align: 'start', rowIndex });
  }, [query.canvas]);

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
    <GridViewerEl tabIndex={0}>
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
          query,
          workId: work.id,
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
