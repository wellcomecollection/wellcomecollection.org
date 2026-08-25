import NextLink from 'next/link';
import { FunctionComponent, memo, useEffect, useRef, useState } from 'react';
import { areEqual, FixedSizeGrid, GridChildComponentProps } from 'react-window';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import useScrollVelocity from '@weco/content/hooks/useScrollVelocity';
import { SearchResults } from '@weco/content/services/iiif/types/search/v3';
import { ItemViewerQuery } from '@weco/content/types/item-viewer';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';
import {
  arrayIndexToQueryParam,
  queryParamToArrayIndex,
} from '@weco/content/views/pages/works/work/work.helpers';

import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';

const ThumbnailSpacer = styled(Space).attrs({
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
})`
  height: 400px;

  a {
    display: block;
    height: 100%;
    text-decoration: none;
  }
`;

type CellProps = GridChildComponentProps<{
  scrollVelocity: number;
  columnCount: number;
  gridVisible: boolean;
  setGridVisible: (value: boolean) => void;
  canvases: TransformedCanvas[];
  searchResults: SearchResults | null;
  query: ItemViewerQuery;
  workId: string;
  placeholderId?: string;
  errorHandler?: () => void;
}>;

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
    placeholderId,
    errorHandler,
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
  const isScrollingFast = scrollVelocity > 1;

  return (
    <div style={style}>
      {isScrollingFast ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LL $lighten />
        </div>
      ) : (
        currentCanvas && (
          <ThumbnailSpacer>
            <NextLink
              {...toWorksItemLink({
                workId,
                props: {
                  manifest: query.manifest,
                  query: query.query,
                  canvas: arrayIndexToQueryParam(canvasIndex),
                  shouldScrollToCanvas: true,
                },
              })}
              aria-current={
                canvasIndex === queryParamToArrayIndex(query.canvas)
              }
              onClick={() => {
                setGridVisible(false);
              }}
              tabIndex={gridVisible ? 0 : -1}
              replace
            >
              <IIIFCanvasThumbnail
                canvas={currentCanvas}
                placeholderId={placeholderId}
                thumbNumber={arrayIndexToQueryParam(canvasIndex)}
                isHighlighted={hasSearchResults}
                errorHandler={errorHandler}
              />
            </NextLink>
          </ThumbnailSpacer>
        )
      )}
    </div>
  );
}, areEqual);

Cell.displayName = 'Cell';

const GridViewerContainer = styled.div`
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
    errorHandler,
  } = useItemViewerContext();
  const { windowSize } = useAppContext();

  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollVelocity = useScrollVelocity(scrollOffset);

  const grid = useRef<FixedSizeGrid>(null);

  const itemWidth = windowSize === 'zero' ? 250 : 350;
  const columnCount = Math.max(1, Math.round(mainAreaWidth / itemWidth)); // ensure at least one column is displayed
  const columnWidth = mainAreaWidth / columnCount;
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
    <GridViewerContainer tabIndex={0}>
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
          canvases: canvases || [],
          searchResults,
          query,
          workId: work.id,
          placeholderId: transformedManifest?.placeholderId,
          errorHandler,
        }}
        onScroll={({ scrollTop }) => setScrollOffset(scrollTop)}
        ref={grid}
      >
        {Cell}
      </FixedSizeGrid>
    </GridViewerContainer>
  );
};

export default GridViewer;
