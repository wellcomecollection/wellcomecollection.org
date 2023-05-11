import {
  FunctionComponent,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import styled from 'styled-components';
import { Manifest } from '@iiif/presentation-3';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { Work, Image } from '@weco/catalogue/services/wellcome/catalogue/types';
import {
  getDigitalLocationOfType,
  getDownloadOptionsFromImageUrl,
} from '../../utils/works';
import { getMultiVolumeLabel } from '../../utils/iiif/v3';
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
import { TransformedCanvas, TransformedManifest } from '../../types/manifest';
import useTransformedIIIFImage from '../../hooks/useTransformedIIIFImage';
import { fromQuery } from '@weco/catalogue/components/ItemLink';

type IIIFViewerProps = {
  title: string;
  currentCanvas?: TransformedCanvas;
  lang: string;
  canvasOcr?: string;
  pageIndex: number;
  canvasIndex: number;
  work: Work;
  image?: Image;
  iiifImageLocation?: DigitalLocation;
  transformedManifest: TransformedManifest;
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

  /* TODO: this is to let downloads sit above sidebar on desktop but not have the topbar above the sidebar on mobile.
   If we move the downloads, this can be simplified */
  z-index: 4;

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
  currentCanvas,
  lang,
  canvasIndex,
  work,
  image,
  iiifImageLocation,
  transformedManifest,
  manifestIndex,
  pageIndex,
  canvasOcr,
  handleImageError,
}: IIIFViewerProps) => {
  const router = useRouter(); // TODO or should this be passed in from items/images pages from context.query?
  const {
    page: pageParam = 1, // TODO do we really need to rename these
    canvas: canvasParam = 1,
    manifest: manifestParam = 1,
  } = fromQuery(router.query);
  const [gridVisible, setGridVisible] = useState(false);
  const [parentManifest, setParentManifest] = useState<Manifest | undefined>();
  const [currentManifestLabel, setCurrentManifestLabel] = useState<
    string | undefined
  >();
  const { isFullSupportBrowser } = useContext(AppContext);
  const viewToggleRef = useRef<HTMLButtonElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const [isDesktopSidebarActive, setIsDesktopSidebarActive] = useState(true);
  const [isMobileSidebarActive, setIsMobileSidebarActive] = useState(false); // don't show sidebar by default on mobile
  const [showZoomed, setShowZoomed] = useState(false);
  const [zoomInfoUrl, setZoomInfoUrl] = useState<string | undefined>();
  const [rotatedImages, setRotatedImages] = useState<RotatedImage[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mainAreaHeight, setMainAreaHeight] = useState(500);
  const [mainAreaWidth, setMainAreaWidth] = useState(1000);
  const [searchResults, setSearchResults] = useState(results);
  const [isResizing, setIsResizing] = useState(false);
  const mainImageService = { '@id': currentCanvas?.imageServiceId };
  const urlTemplate =
    iiifImageLocation && iiifImageTemplate(iiifImageLocation.url);
  const imageUrl = urlTemplate && urlTemplate({ size: '800,' });
  const previousManifestIndex = useRef(manifestIndex);
  const hasIiifImage = urlTemplate && imageUrl && iiifImageLocation;
  const transformedIIIFImage = useTransformedIIIFImage(work);

  const hasImageService = mainImageService['@id'] && currentCanvas;
  const {
    canvases,
    downloadEnabled,
    downloadOptions: manifestDownloadOptions,
    parentManifestUrl,
    iiifCredit,
  } = transformedManifest;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const mainAreaObserver = new ResizeObserver(([mainArea]) => {
      clearTimeout(timer);

      if (!isResizing) {
        setIsResizing(true);
      }

      // timer = setTimeout(() => {
      // If we've changed index as a result of the
      // mainArea changing size, reset it to what
      // it was before and scroll to the right place.
      // if () {
      //   canvases &&
      //     scrollViewer();
      // }
      //   previousActiveIndex = undefined;
      //   setIsResizing(false);
      // }, 500); // Debounce

      setMainAreaWidth(mainArea.contentRect.width);
      setMainAreaHeight(mainArea.contentRect.height);
    });

    mainAreaRef?.current && mainAreaObserver.observe(mainAreaRef.current);

    return () => mainAreaObserver.disconnect();
  }, []);

  useEffect(() => {
    const matchingManifest =
      parentManifest &&
      parentManifest.items &&
      parentManifest.items.find(canvas => {
        return !transformedManifest
          ? false
          : canvas.id === transformedManifest.id;
      });

    const manifestLabel =
      matchingManifest?.label &&
      getMultiVolumeLabel(matchingManifest.label, work?.title || '');
    manifestLabel && setCurrentManifestLabel(manifestLabel);
  }, [transformedManifest, parentManifest]);

  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );

  // Determine digital location. If the work has a iiif-presentation location and a iiif-image location
  // we use the former
  const digitalLocation: DigitalLocation | undefined =
    iiifPresentationLocation || iiifImageLocation;

  // iiif-image locations have credit info.
  // iiif-presentation locations don't have credit info, so we fall back to the data in the manifest
  const iiifImageLocationCredit = digitalLocation?.credit || iiifCredit;

  // Works can have a DigitalLocation of type iiif-presentation and/or iiif-image.
  // For a iiif-presentation DigitalLocation we get the download options from the manifest to which it points.
  // For a iiif-image DigitalLocation we create the download options
  // from a combination of the DigitalLocation and the iiif-image json to which it points.
  // The json provides the image width and height used in the link text.
  // Since this isn't vital to rendering the links, the useTransformedIIIFImage hook
  // gets this data client side.
  const iiifImageDownloadOptions = iiifImageLocation
    ? getDownloadOptionsFromImageUrl({
        url: iiifImageLocation.url,
        width: transformedIIIFImage.width,
        height: transformedIIIFImage.height,
      })
    : [];

  // We also want to offer download options for each canvas image
  // in the iiif-presentation manifest when it is being viewed.
  const canvasImageDownloads = mainImageService['@id']
    ? getDownloadOptionsFromImageUrl({
        url: mainImageService['@id'],
        width: currentCanvas && currentCanvas.width,
        height: currentCanvas && currentCanvas.height,
      })
    : [];

  const downloadOptions = [
    ...iiifImageDownloadOptions,
    ...canvasImageDownloads,
    ...manifestDownloadOptions,
  ];

  // TODO why do we need to do this?
  useEffect(() => {
    const fetchParentManifest = async () => {
      const parentManifest =
        transformedManifest.parentManifestUrl &&
        (await fetchJson(parentManifestUrl as string));

      parentManifest && setParentManifest(parentManifest);
    };

    fetchParentManifest();
  }, []);

  return isFullSupportBrowser ? (
    <ItemViewerContext.Provider
      value={{
        work,
        transformedManifest,
        manifestIndex,
        lang,
        canvasIndex,
        pageParam, // TODO maybe do these as one thing, i.e. query and maybe do them as index with -1 taken into account
        canvasParam,
        manifestParam,
        gridVisible,
        currentManifestLabel,
        iiifImageLocationCredit,
        downloadOptions: downloadEnabled ? downloadOptions : [],
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
        setGridVisible,
        setShowZoomed,
        setIsFullscreen,
        setZoomInfoUrl,
        setIsLoading,
        setShowControls,
        errorHandler: handleImageError,
        setRotatedImages,
        setParentManifest,
        setCurrentManifestLabel,
        viewerRef,
        mainAreaRef,
      }}
    >
      <Grid ref={viewerRef}>
        <Sidebar
          data-test-id="viewer-sidebar"
          isActiveMobile={isMobileSidebarActive}
          isActiveDesktop={isDesktopSidebarActive}
        >
          <ViewerSidebar />
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
              index={0}
              alt={work?.description || work?.title || ''}
              urlTemplate={urlTemplate}
              loadHandler={() => {
                setZoomInfoUrl(iiifImageLocation.url);
                setIsLoading(false);
              }}
              setImageRect={() => undefined}
              setImageContainerRect={() => undefined}
            />
          )}
          {hasImageService && <MainViewer />}
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
          <GridViewer viewerRef={viewerRef} />
        </Thumbnails>
      </Grid>
    </ItemViewerContext.Provider>
  ) : (
    <NoScriptViewer
      imageUrl={imageUrl}
      iiifImageLocation={iiifImageLocation}
      currentCanvas={currentCanvas}
      canvasOcr={canvasOcr}
      lang={lang}
      workId={work.id}
      canvases={canvases || []}
      canvasIndex={canvasIndex}
      pageIndex={pageIndex}
    />
  );
};

export default IIIFViewer;
