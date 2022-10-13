import {
  FunctionComponent,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import styled from 'styled-components';
import {
  IIIFCanvas,
  IIIFManifest,
} from '../../services/iiif/types/manifest/v2';
import { DigitalLocation, Work } from '@weco/common/model/catalogue';
import {
  getDigitalLocationOfType,
  getDownloadOptionsFromImageUrl,
} from '../../utils/works';
import { getServiceId } from '../../utils/iiif/v2';
import ViewerSidebar from './ViewerSidebar';
import MainViewer, { scrollViewer } from './MainViewer';
import ViewerTopBar from './ViewerTopBar';
import { getCatalogueLicenseData } from '@weco/common/utils/licenses';
import ItemViewerContext, {
  results,
  RotatedImage,
} from '../ItemViewerContext/ItemViewerContext';
import { FixedSizeList } from 'react-window';
import useSkipInitialEffect from '@weco/common/hooks/useSkipInitialEffect';
import Router from 'next/router';
import GridViewer from './GridViewer';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import dynamic from 'next/dynamic';
import LL from '@weco/common/views/components/styled/LL';
import { PropsWithoutRenderFunction as PaginatorPropsWithoutRenderFunction } from './RenderlessPaginator';
import ImageViewer from './ImageViewer';
import ImageViewerControls from './ImageViewerControls';
import ViewerBottomBar from './ViewerBottomBar';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import NoScriptViewer from './NoScriptViewer';
import { fetchJson } from '@weco/common/utils/http';
import { TransformedManifest } from '../../types/manifest';

type IIIFViewerProps = {
  title: string;
  currentCanvas?: IIIFCanvas;
  mainPaginatorProps: PaginatorPropsWithoutRenderFunction;
  thumbsPaginatorProps: PaginatorPropsWithoutRenderFunction;
  lang: string;
  canvasOcr?: string;
  workId: string;
  pageIndex: number;
  pageSize: number;
  canvasIndex: number;
  iiifImageLocation?: DigitalLocation;
  work: Work;
  manifest: TransformedManifest; // TODO change to transformedData
  manifestIndex?: number;
  handleImageError?: () => void;
};

const LoadingComponent = () => (
  <div
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 1000,
    }}
  >
    <LL />
  </div>
);

const ZoomedImage = dynamic(() => import('./ZoomedImage'), {
  ssr: false,
  loading: LoadingComponent,
});

const Grid = styled.div`
  display: grid;
  height: calc(100vh - ${props => props.theme.navHeight}px);
  overflow: hidden;
  grid-template-columns: [left-edge] minmax(200px, 3fr) [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  grid-template-rows: [top-edge] min-content [desktop-main-start desktop-topbar-end] 1fr [mobile-bottombar-start mobile-main-end] min-content [bottom-edge];

  .viewer-desktop {
    display: none;

    ${props => props.theme.media('medium')`
      display: inherit;
    `}
  }

  .viewer-mobile {
    ${props => props.theme.media('medium')`
      display: none;
    `}
  }

  ${props => props.theme.media('xlarge')`
    grid-template-columns: [left-edge] minmax(200px, 330px) [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  `}
`;

const Sidebar = styled.div<{
  isActiveMobile: boolean;
  isActiveDesktop: boolean;
}>`
  display: ${props => (props.isActiveMobile ? 'inherit' : 'none')};
  align-content: start;

  ${props =>
    props.theme.media('medium')(`
      display: ${props.isActiveDesktop ? 'inherit' : 'none'};
    `)}

  grid-area: desktop-main-start / left-edge / bottom-edge /right-edge;

  ${props =>
    props.theme.media('medium')(`
      grid-area: desktop-main-start / left-edge / bottom-edge / desktop-sidebar-end;
      border-right: 1px solid ${props.theme.color('black')};
    `)}

  background: ${props => props.theme.color('neutral.700')};
  color: ${props => props.theme.color('white')};
  overflow: auto;
  z-index: 5;
`;

const Topbar = styled.div<{
  isDesktopSidebarActive: boolean;
}>`
  background: ${props => props.theme.color('neutral.700')};
  grid-area: top-edge / left-edge / desktop-topbar-end / right-edge;
  z-index: 4; // TODO: this is to let downloads sit above sidebar on desktop but not have the topbar above the sidebar on mobile. If we move the downloads, this can be simplified

  ${props => props.theme.media('medium')`
    z-index: 5;
  `}
`;

const Main = styled.div<{
  isResizing: boolean;
  isDesktopSidebarActive: boolean;
}>`
  background: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
  overflow: auto;
  position: relative;

  img {
    transition: filter ${props => props.theme.transitionProperties};
    filter: blur(${props => (props.isResizing ? '5px' : '0')});
  }

  grid-area: desktop-main-start / left-edge / mobile-main-end / right-edge;

  ${props =>
    props.theme.media('medium')(`
      grid-area: desktop-main-start / ${
        props.isDesktopSidebarActive ? 'main-start' : 'left-edge'
      } / bottom-edge / right-edge;
    `)}
`;

const Zoom = styled.div`
  grid-area: desktop-main-start / left-edge / bottom-edge / right-edge;
`;

const BottomBar = styled.div<{
  isMobileSidebarActive: boolean;
}>`
  display: inherit;

  ${props => props.theme.media('medium')`
    display: none;
  `}

  grid-area: mobile-bottombar-start / left-edge / bottom-edge / right-edge;
  background: hotpink;
  z-index: 6;
`;

// TODO: check that we can't reach thumbnails by keyboard/screenreader
const Thumbnails = styled.div<{
  isActive: boolean;
  isDesktopSidebarActive: boolean;
}>`
  background: ${props => props.theme.color('neutral.700')};
  transform: translateY(${props => (props.isActive ? '0' : '100%')});
  transition: transform 250ms ease;
  z-index: 3;
  grid-area: desktop-main-start / left-edge / bottom-edge / right-edge;

  ${props => props.theme.media('medium')`
    grid-area: desktop-main-start / desktop-sidebar-end / bottom-edge / right-edge;
  `}

  ${props =>
    !props.isDesktopSidebarActive &&
    props.theme.media('medium')`
      grid-area: desktop-main-start / left-edge / bottom-edge / right-edge;
  `}
`;

const IIIFViewer: FunctionComponent<IIIFViewerProps> = ({
  mainPaginatorProps,
  currentCanvas,
  lang,
  canvasIndex,
  iiifImageLocation,
  work,
  manifest,
  manifestIndex,
  pageSize,
  pageIndex,
  canvasOcr,
  thumbsPaginatorProps,
  handleImageError,
}: IIIFViewerProps) => {
  const [gridVisible, setGridVisible] = useState(false);
  const [parentManifest, setParentManifest] = useState<
    IIIFManifest | undefined
  >();
  const [currentManifestLabel, setCurrentManifestLabel] = useState<
    string | undefined
  >();
  const { isFullSupportBrowser } = useContext(AppContext);
  const viewToggleRef = useRef<HTMLButtonElement>(null);
  const gridViewerRef = useRef<HTMLDivElement>(null);
  const mainViewerRef = useRef<FixedSizeList>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const [isDesktopSidebarActive, setIsDesktopSidebarActive] = useState(true);
  const [isMobileSidebarActive, setIsMobileSidebarActive] = useState(false); // don't show sidebar by default on mobile
  const [activeIndex, setActiveIndex] = useState(0);
  const [showZoomed, setShowZoomed] = useState(false);
  const [zoomInfoUrl, setZoomInfoUrl] = useState<string | undefined>();
  const [rotatedImages, setRotatedImages] = useState<RotatedImage[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageJson, setImageJson] = useState<any>();
  const [mainAreaHeight, setMainAreaHeight] = useState(500);
  const [mainAreaWidth, setMainAreaWidth] = useState(1000);
  const [searchResults, setSearchResults] = useState(results);
  const [isResizing, setIsResizing] = useState(false);
  const mainImageService = { '@id': getServiceId(currentCanvas) };
  const urlTemplate =
    iiifImageLocation && iiifImageTemplate(iiifImageLocation.url);
  const imageUrl = urlTemplate && urlTemplate({ size: '800,' });
  const firstRotatedImage = rotatedImages.find(
    image => image.canvasIndex === 0
  );
  const firstRotation = firstRotatedImage ? firstRotatedImage.rotation : 0;
  const activeIndexRef = useRef(activeIndex);
  const previousManifestIndex = useRef(manifestIndex);
  const hasIiifImage = urlTemplate && imageUrl && iiifImageLocation;
  const hasImageService = mainImageService['@id'] && currentCanvas;
  const { canvases, showDownloadOptions, downloadOptions, parentManifestUrl } =
    manifest;

  useEffect(() => {
    const fetchImageJson = async () => {
      try {
        if (iiifImageLocation) {
          const image = await fetch(iiifImageLocation.url);
          const json = await image.json();
          setImageJson(json);
        }
      } catch (e) {}
    };
    fetchImageJson();
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const navigationCanvases =
    canvases &&
    [...Array(pageSize)]
      .map((_, i) => pageSize * pageIndex + i)
      .map(i => canvases[i])
      .filter(Boolean);

  useEffect(() => {
    let timer;
    let previousActiveIndex;

    const mainAreaObserver = new ResizeObserver(([mainArea]) => {
      clearTimeout(timer);

      if (!isResizing) {
        setIsResizing(true);
      }

      // Store a reference to where we were
      if (!previousActiveIndex) {
        previousActiveIndex = activeIndexRef.current;
      }

      timer = setTimeout(() => {
        // If we've changed index as a result of the
        // mainArea changing size, reset it to what
        // it was before and scroll to the right place.
        if (previousActiveIndex !== activeIndex) {
          setActiveIndex(previousActiveIndex);
          canvases &&
            scrollViewer(
              canvases[previousActiveIndex],
              previousActiveIndex,
              mainViewerRef?.current,
              mainArea.contentRect.width
            );
        }

        previousActiveIndex = undefined;
        setIsResizing(false);
      }, 500); // Debounce

      setMainAreaWidth(mainArea.contentRect.width);
      setMainAreaHeight(mainArea.contentRect.height);
    });

    mainAreaRef &&
      mainAreaRef.current &&
      mainAreaObserver.observe(mainAreaRef.current);

    return () => mainAreaObserver.disconnect();
  }, []);

  useEffect(() => {
    const matchingManifest =
      parentManifest &&
      parentManifest.manifests &&
      parentManifest.manifests.find((childManifest: IIIFManifest) => {
        return !manifest ? false : childManifest['@id'] === manifest['@id'];
      });

    matchingManifest && setCurrentManifestLabel(matchingManifest.label);
  });

  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );
  const digitalLocation = iiifImageLocation || iiifPresentationLocation;
  const licenseInfo =
    digitalLocation?.license &&
    getCatalogueLicenseData(digitalLocation.license);

  const iiifImageLocationCredit = iiifImageLocation && iiifImageLocation.credit;
  const imageDownloadOptions =
    showDownloadOptions && iiifImageLocation
      ? getDownloadOptionsFromImageUrl({
          url: iiifImageLocation.url,
          width: imageJson?.width,
          height: imageJson?.height,
        })
      : [];
  const imageDownloads =
    mainImageService['@id'] &&
    getDownloadOptionsFromImageUrl({
      url: mainImageService['@id'],
      width: currentCanvas && currentCanvas.width,
      height: currentCanvas && currentCanvas.height,
    });
  // TODO tidy this up; understand what the difference is between imageDownloads and imageDownloadOptions
  const iiifPresentationDownloadOptions =
    (imageDownloads && [...imageDownloads, ...downloadOptions]) || [];

  useSkipInitialEffect(() => {
    const canvasParams =
      (canvases && canvases.length > 0) || currentCanvas
        ? { canvas: `${activeIndex + 1}` }
        : {};
    const manifest = mainPaginatorProps.link.href.query?.manifest;
    const manifestParams = manifest ? { manifest } : {};

    const url = {
      ...mainPaginatorProps.link.href,
      query: {
        ...mainPaginatorProps.link.href.query,
        ...canvasParams,
        ...manifestParams,
        source: 'viewer/paginator',
      },
    };
    const as = {
      ...mainPaginatorProps.link.as,
      query: {
        ...mainPaginatorProps.link.as.query,
        ...canvasParams,
        ...manifestParams,
      },
    };
    Router.replace(url, as);
  }, [activeIndex]);

  useEffect(() => {
    if (previousManifestIndex.current === manifestIndex) return;

    // If we change manifests, it's not enough to rely on the next/link
    // to scroll us to the first canvas, because it's being handled by
    // react window
    mainViewerRef?.current?.scrollToItem(0, 'start');
    previousManifestIndex.current = manifestIndex;
  }, [manifestIndex]);

  useEffect(() => {
    const fetchParentManifest = async () => {
      const parentManifest =
        manifest.parentManifestUrl &&
        (await fetchJson(parentManifestUrl as string));
      parentManifest && setParentManifest(parentManifest);
    };

    fetchParentManifest();
  }, []);

  return isFullSupportBrowser ? (
    <ItemViewerContext.Provider
      value={{
        work,
        manifest,
        manifestIndex,
        lang,
        canvasIndex,
        activeIndex,
        gridVisible,
        currentManifestLabel,
        licenseInfo,
        iiifImageLocationCredit,
        // TODO why need both downloadOptions and iiifPresentationDownloadOptions
        downloadOptions: showDownloadOptions
          ? [...imageDownloadOptions, ...iiifPresentationDownloadOptions]
          : [],
        iiifPresentationDownloadOptions,
        parentManifest,
        mainAreaWidth,
        mainAreaHeight,
        showZoomed,
        zoomInfoUrl,
        rotatedImages,
        showControls,
        isLoading,
        isFullscreen,
        isDesktopSidebarActive,
        urlTemplate,
        isMobileSidebarActive,
        searchResults,
        isResizing,
        setSearchResults,
        setIsMobileSidebarActive,
        setIsDesktopSidebarActive,
        setActiveIndex,
        setGridVisible,
        setShowZoomed,
        setIsFullscreen,
        setZoomInfoUrl,
        setIsLoading,
        setShowControls,
        errorHandler: handleImageError,
        setRotatedImages,
        setImageJson,
        setParentManifest,
        setCurrentManifestLabel,
      }}
    >
      <Grid ref={viewerRef}>
        <Sidebar
          data-test-id="viewer-sidebar"
          isActiveMobile={isMobileSidebarActive}
          isActiveDesktop={isDesktopSidebarActive}
        >
          <ViewerSidebar mainViewerRef={mainViewerRef} />
        </Sidebar>
        <Topbar isDesktopSidebarActive={isDesktopSidebarActive}>
          <ViewerTopBar viewToggleRef={viewToggleRef} viewerRef={viewerRef} />
        </Topbar>
        <Main
          isDesktopSidebarActive={isDesktopSidebarActive}
          isResizing={isResizing}
          ref={mainAreaRef}
        >
          {!showZoomed && <ImageViewerControls />}
          {hasIiifImage && !hasImageService && (
            <ImageViewer
              infoUrl={iiifImageLocation.url}
              id={imageUrl}
              width={800}
              alt={work?.description || work?.title || ''}
              urlTemplate={urlTemplate}
              rotation={firstRotation}
              loadHandler={() => {
                setZoomInfoUrl(iiifImageLocation.url);
                setIsLoading(false);
              }}
              setImageRect={() => undefined}
              setImageContainerRect={() => undefined}
            />
          )}
          {hasImageService && (
            <MainViewer
              mainViewerRef={mainViewerRef}
              mainAreaRef={mainAreaRef}
            />
          )}
        </Main>
        {showZoomed && (
          <Zoom>
            <ZoomedImage />
          </Zoom>
        )}
        <BottomBar isMobileSidebarActive={isMobileSidebarActive}>
          <ViewerBottomBar
            viewToggleRef={viewToggleRef}
            viewerRef={viewerRef}
          />
        </BottomBar>
        <Thumbnails
          isActive={gridVisible}
          isDesktopSidebarActive={isDesktopSidebarActive}
        >
          <GridViewer
            mainViewerRef={mainViewerRef}
            gridViewerRef={gridViewerRef}
            viewerRef={viewerRef}
          />
        </Thumbnails>
      </Grid>
    </ItemViewerContext.Provider>
  ) : (
    <NoScriptViewer
      thumbnailsRequired={Boolean(navigationCanvases?.length)}
      imageUrl={imageUrl}
      iiifImageLocation={iiifImageLocation}
      currentCanvas={currentCanvas}
      canvasOcr={canvasOcr}
      lang={lang}
      mainPaginatorProps={mainPaginatorProps}
      thumbsPaginatorProps={thumbsPaginatorProps}
      workId={work.id}
      canvases={canvases || []}
      canvasIndex={canvasIndex}
      pageIndex={pageIndex}
      pageSize={pageSize}
    />
  );
};

export default IIIFViewer;
