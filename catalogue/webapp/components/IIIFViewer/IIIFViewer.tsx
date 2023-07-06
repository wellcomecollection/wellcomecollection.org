import {
  FunctionComponent,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import styled, { keyframes } from 'styled-components';
import { Manifest } from '@iiif/presentation-3';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { Work } from '@weco/catalogue/services/wellcome/catalogue/types';
import ViewerSidebar from './ViewerSidebar';
import MainViewer from './MainViewer';
import ViewerTopBar from './ViewerTopBar';
import ItemViewerContext, {
  results,
  RotatedImage,
} from '../ItemViewerContext/ItemViewerContext';
import { useRouter } from 'next/router';
import GridViewer from './GridViewer';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import dynamic from 'next/dynamic';
import LL from '@weco/common/views/components/styled/LL';
import ImageViewer from './ImageViewer';
import ImageViewerControls from './ImageViewerControls';
import ViewerBottomBar from './ViewerBottomBar';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import NoScriptViewer from './NoScriptViewer';
import { fetchJson } from '@weco/common/utils/http';
import { TransformedManifest } from '@weco/catalogue/types/manifest';
import { fromQuery } from '@weco/catalogue/components/ItemLink';

// canvas and manifest params use 1-based indexing, but are used to access items in 0 indexed arrays,
// so we need to convert it in various places
export function queryParamToArrayIndex(canvas: number): number {
  return canvas - 1;
}

export function arrayIndexToQueryParam(canvasIndex: number): number {
  return canvasIndex + 1;
}

const show = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
// The <NoScriptViewer /> will display before the enhanced viewer takes it's place.
// This is necessary for it to be available to visitors without javascript,
// but would normally result in a large and noticeable change to the page which is jarring.
// In order to prevent that, we wrap the <NoScriptViewer /> in a DelayVisibility styled component.
// This delays the visibility of the <NoScriptViewer /> long enough
// that the enhanced viewer will usually have replaced it, if javascript is available, and so it will never be seen.
// The trade off is that if javascript isn't available there will be a slight delay before seeing the <NoScriptViewer />.
const DelayVisibility = styled.div`
  opacity: 0;
  animation: 0.5s ${show} 2s forwards;
`;

type IIIFViewerProps = {
  work: Work;
  iiifImageLocation?: DigitalLocation;
  iiifPresentationLocation?: DigitalLocation;
  transformedManifest?: TransformedManifest;
  canvasOcr?: string;
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

  /* TODO: this is to let downloads sit above sidebar on desktop but not have the topbar above the sidebar on mobile.
   If we move the downloads, this can be simplified */
  z-index: 4;

  ${props => props.theme.media('medium')`
    z-index: 5;
  `}
`;

const Main = styled.div<{
  isDesktopSidebarActive: boolean;
}>`
  background: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
  overflow: auto;
  position: relative;

  img {
    transition: filter ${props => props.theme.transitionProperties};
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
  work,
  iiifImageLocation,
  iiifPresentationLocation,
  transformedManifest,
  canvasOcr,
  handleImageError,
}) => {
  const router = useRouter();
  const {
    page = 1,
    canvas = 1,
    manifest = 1,
    shouldScrollToCanvas = true,
    query = '',
  } = fromQuery(router.query);
  const [gridVisible, setGridVisible] = useState(false);
  const [parentManifest, setParentManifest] = useState<Manifest | undefined>();
  const { isFullSupportBrowser } = useContext(AppContext);
  const viewerRef = useRef<HTMLDivElement>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const [isDesktopSidebarActive, setIsDesktopSidebarActive] = useState(true);
  const [isMobileSidebarActive, setIsMobileSidebarActive] = useState(false); // don't show sidebar by default on mobile
  const [showZoomed, setShowZoomed] = useState(false);
  const [rotatedImages, setRotatedImages] = useState<RotatedImage[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mainAreaHeight, setMainAreaHeight] = useState(500);
  const [mainAreaWidth, setMainAreaWidth] = useState(1000);
  const [searchResults, setSearchResults] = useState(results);
  const [isResizing, setIsResizing] = useState(false);
  const urlTemplate =
    iiifImageLocation && iiifImageTemplate(iiifImageLocation.url);
  const imageUrl = urlTemplate && urlTemplate({ size: '800,' });
  const hasIiifImage = imageUrl && iiifImageLocation;
  const currentCanvas =
    transformedManifest?.canvases[queryParamToArrayIndex(canvas)];
  const mainImageService = { '@id': currentCanvas?.imageServiceId };
  const hasImageService = mainImageService['@id'] && currentCanvas;
  const { parentManifestUrl } = { ...transformedManifest };
  const [showControls, setShowControls] = useState(
    Boolean(hasIiifImage && !hasImageService)
  );

  // We need to reset the MainAreaWidth and MainAreaHeight
  // when the available space changes.
  // This can happen when the browser is resized
  // or if the sidebar is collapsed/expanded.
  // Previously, we used a ResizeObserver on the mainAreaRef.current
  // which took care of both these scenarios.
  // However, in Safari when 'Show scroll bars' was set to always in the system settings
  // the viewer would constantly reload itself.
  // To fix this we now reset the MainAreaWidth and MainAreaHeight
  // when the window is resized or the isDesktopSidebarActive value changes
  let timeout;
  const handleResize = () => {
    setIsResizing(true);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setIsResizing(false);
      setMainAreaWidth(mainAreaRef.current?.clientWidth || 0);
      setMainAreaHeight(mainAreaRef.current?.clientHeight || 0);
    }, 500); // debounce
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    handleResize();
  }, [isDesktopSidebarActive]);

  useEffect(() => {
    const fetchParentManifest = async () => {
      const parentManifest =
        transformedManifest?.parentManifestUrl &&
        (await fetchJson(parentManifestUrl as string));

      parentManifest && setParentManifest(parentManifest);
    };

    fetchParentManifest();
  }, []);

  return (
    <ItemViewerContext.Provider
      value={{
        // DATA props:
        query: {
          page,
          canvas,
          manifest,
          shouldScrollToCanvas,
          query,
        },
        work,
        transformedManifest,
        parentManifest,
        searchResults,
        setSearchResults,

        // UI Props:
        viewerRef,
        mainAreaRef,
        mainAreaWidth,
        mainAreaHeight,
        gridVisible,
        setGridVisible,
        isFullscreen,
        setIsFullscreen,
        isDesktopSidebarActive,
        setIsDesktopSidebarActive,
        isMobileSidebarActive,
        setIsMobileSidebarActive,
        showZoomed,
        setShowZoomed,
        showControls,
        setShowControls,
        rotatedImages,
        setRotatedImages,
        isResizing,
        errorHandler: handleImageError,
      }}
    >
      {isFullSupportBrowser ? (
        <Grid ref={viewerRef}>
          <Sidebar
            data-test-id="viewer-sidebar"
            isActiveMobile={isMobileSidebarActive}
            isActiveDesktop={isDesktopSidebarActive}
          >
            <ViewerSidebar
              iiifImageLocation={iiifImageLocation}
              iiifPresentationLocation={iiifPresentationLocation}
            />
          </Sidebar>
          <Topbar isDesktopSidebarActive={isDesktopSidebarActive}>
            <ViewerTopBar iiifImageLocation={iiifImageLocation} />
          </Topbar>
          <Main
            isDesktopSidebarActive={isDesktopSidebarActive}
            ref={mainAreaRef}
          >
            {!showZoomed && <ImageViewerControls />}
            {hasIiifImage && !hasImageService && (
              <ImageViewer
                infoUrl={iiifImageLocation.url}
                id={imageUrl}
                width={800}
                index={0}
                alt={work?.description || work?.title || ''}
                urlTemplate={urlTemplate}
                setImageRect={() => undefined}
                setImageContainerRect={() => undefined}
              />
            )}
            {/* If we hide the MainViewer when resizing the browser, it will then rerender with the correct canvas displayed */}
            {hasImageService && !isResizing && <MainViewer />}
          </Main>
          {showZoomed && (
            <Zoom>
              <ZoomedImage iiifImageLocation={iiifImageLocation} />
            </Zoom>
          )}
          <BottomBar isMobileSidebarActive={isMobileSidebarActive}>
            <ViewerBottomBar />
          </BottomBar>
          <Thumbnails
            isActive={gridVisible}
            isDesktopSidebarActive={isDesktopSidebarActive}
          >
            <GridViewer />
          </Thumbnails>
        </Grid>
      ) : (
        <DelayVisibility>
          <NoScriptViewer
            imageUrl={imageUrl}
            iiifImageLocation={iiifImageLocation}
            canvasOcr={canvasOcr}
          />
        </DelayVisibility>
      )}
    </ItemViewerContext.Provider>
  );
};

export default IIIFViewer;
