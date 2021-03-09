import { FunctionComponent, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import MainViewer from '../IIIFViewer/parts/MainViewer';
import { IIIFViewerProps } from '../IIIFViewer/IIIFViewer';

const Grid = styled.div`
  display: grid;
  height: calc(100vh - 85px); // FIXME: use variable for header height
  overflow: hidden;
  grid-template-columns: [left-edge] minmax(200px, 300px) [desktop-sidebar-end main-start desktop-toolbar-start] 1fr [right-edge];
  grid-template-rows: [top-edge] min-content [desktop-main-start desktop-toolbar-end] 1fr [bottom-edge];
`;

const Sidebar = styled.div`
  background: hotpink;
  grid-area: top-edge / left-edge / bottom-edge / desktop-sidebar-end;
`;

const Toolbar = styled.div`
  background: dodgerblue;
  grid-area: top-edge / desktop-toolbar-start / desktop-toolbar-end / right-edge;
`;

const Main = styled.div`
  background: grey;
  grid-area: desktop-main-start / main-start / bottom-edge / right-edge;
  overflow: scroll;
`;

const IIIFViewerPrototype: FunctionComponent<IIIFViewerProps> = ({
  title,
  mainPaginatorProps,
  thumbsPaginatorProps,
  currentCanvas,
  lang,
  canvasOcr,
  canvases,
  workId,
  pageIndex,
  pageSize,
  canvasIndex,
  iiifImageLocation,
  work,
  manifest,
  manifestIndex,
  handleImageError,
}: IIIFViewerProps) => {
  const [gridVisible, setGridVisible] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [parentManifest, setParentManifest] = useState<
    IIIFManifest | undefined
  >();
  const [currentManifestLabel, setCurrentManifestLabel] = useState<
    string | undefined
  >();
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageHeight, setPageHeight] = useState(500);
  const [pageWidth, setPageWidth] = useState(1000);
  const [showZoomed, setShowZoomed] = useState(false);
  const [zoomInfoUrl, setZoomInfoUrl] = useState<string | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rotatedImages, setRotatedImages] = useState<any[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageJson, setImageJson] = useState<any>();
  const viewToggleRef = useRef<HTMLButtonElement>(null);
  const gridViewerRef = useRef<HTMLDivElement>(null);
  const mainViewerRef = useRef<FixedSizeList>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const navigationCanvases =
    canvases &&
    [...Array(pageSize)]
      .map((_, i) => pageSize * pageIndex + i)
      .map(i => canvases[i])
      .filter(Boolean);

  useEffect(() => {
    function handleResize() {
      if (isFullscreen) {
        setPageHeight(window.innerHeight);
      } else {
        setPageHeight(window.innerHeight - 85);
      }
      setPageWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  return (
    <Grid>
      <Sidebar>sidebar</Sidebar>
      <Toolbar>toolbar</Toolbar>
      <Main>
        <MainViewer
          listHeight={pageHeight}
          mainViewerRef={mainViewerRef}
          setActiveIndex={setActiveIndex}
          pageWidth={pageWidth}
          canvases={canvases}
          canvasIndex={canvasIndex}
          setShowZoomed={setShowZoomed}
          setZoomInfoUrl={setZoomInfoUrl}
          setIsLoading={setIsLoading}
          rotatedImages={rotatedImages}
          setShowControls={setShowControls}
          errorHandler={handleImageError}
        />
      </Main>
    </Grid>
  );
};

export default IIIFViewerPrototype;
