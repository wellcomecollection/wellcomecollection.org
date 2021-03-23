import { FunctionComponent, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IIIFCanvas, IIIFManifest } from '@weco/common/model/iiif';
import { DigitalLocation, Work } from '../../../model/catalogue';
import {
  getDigitalLocationOfType,
  getDownloadOptionsFromImageUrl,
} from '@weco/common/utils/works';
import {
  getUiExtensions,
  isUiEnabled,
  getServiceId,
  getDownloadOptionsFromManifest,
} from '@weco/common/utils/iiif';
import ViewerSidebarPrototype from './ViewerSidebarPrototype';
import MainViewerPrototype from '../MainViewerPrototype/MainViewerPrototype';
import ViewerTopBarPrototype from './ViewerTopBarPrototype';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import ItemViewerContext, {
  results,
} from '../ItemViewerContext/ItemViewerContext';
import { FixedSizeList } from 'react-window';
import useSkipInitialEffect from '@weco/common/hooks/useSkipInitialEffect';
import Router from 'next/router';
import GridViewerPrototype from './GridViewerPrototype';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import dynamic from 'next/dynamic';
import LL from '@weco/common/views/components/styled/LL';
import { PropsWithoutRenderFunction as PaginatorPropsWithoutRenderFunction } from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
import ImageViewer from '../ImageViewer/ImageViewer';
import ImageViewerControlsPrototype from './ImageViewerControlsPrototype';
import ViewerBottomBarPrototype from './ViewerBottomBarPrototype';
import useWindowSize from '@weco/common/hooks/useWindowSize';

type IIIFViewerProps = {
  title: string;
  currentCanvas?: IIIFCanvas;
  mainPaginatorProps: PaginatorPropsWithoutRenderFunction;
  thumbsPaginatorProps: PaginatorPropsWithoutRenderFunction;
  lang: string;
  canvasOcr?: string;
  canvases: IIIFCanvas[];
  workId: string;
  pageIndex: number;
  pageSize: number;
  canvasIndex: number;
  iiifImageLocation?: DigitalLocation;
  work: Work;
  manifest?: IIIFManifest;
  manifestIndex?: number;
  handleImageError?: () => void;
};
// TODO: Move this to somewhere better?
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
const ZoomedImagePrototype = dynamic(
  () =>
    import(
      '@weco/common/views/components/ZoomedImagePrototype/ZoomedImagePrototype'
    ),
  {
    ssr: false,
    loading: LoadingComponent,
  }
);

const Grid = styled.div`
  display: grid;
  height: calc(100vh - 85px); // FIXME: use variable for header height
  overflow: hidden;
  grid-template-columns: [left-edge] minmax(200px, 330px) [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  grid-template-rows: [top-edge] min-content [desktop-main-start desktop-topbar-end] 1fr [mobile-bottombar-start mobile-main-end] min-content [bottom-edge];
`;

const Sidebar = styled.div<{
  isActiveMobile: boolean;
  isActiveDesktop: boolean;
  isMobile: boolean;
}>`
  display: ${props =>
    (props.isActiveMobile && props.isMobile) ||
    (props.isActiveDesktop && !props.isMobile)
      ? 'inherit'
      : 'none'};
  grid-area: top-edge / left-edge / bottom-edge /
    ${props => (props.isMobile ? ' right-edge ' : 'desktop-sidebar-end')};
  background: ${props => props.theme.color('viewerBlack')};
  color: ${props => props.theme.color('white')};
  border-right: 1px solid ${props => props.theme.color('charcoal')};
  overflow: auto;
  z-index: 5;
`;

const Topbar = styled.div<{
  isMobileSidebarActive: boolean; // TODO: required here?
  isDesktopSidebarActive: boolean;
  isMobile: boolean;
}>`
  background: ${props => props.theme.color('charcoal')};
  z-index: 5;

  ${props =>
    props.isMobile &&
    `
    z-index: 4; // TODO: this is to let downloads sit above sidebar on desktop but not have the topbar above the sidebar on mobile. If we move the downloads, this can be simplified
    grid-area: top-edge / left-edge / desktop-topbar-end / right-edge;
  `}

  ${props =>
    !props.isMobile &&
    `
    grid-area: top-edge / ${
      props.isDesktopSidebarActive ? 'desktop-topbar-start' : 'left-edge'
    } / desktop-topbar-end / right-edge;
  `}
`;

const Main = styled.div<{
  isMobileSidebarActive: boolean; // TODO: required here?
  isDesktopSidebarActive: boolean;
  isMobile: boolean;
}>`
  background: ${props => props.theme.color('viewerBlack')};
  color: ${props => props.theme.color('white')};
  overflow: auto;
  position: relative;

  ${props =>
    props.isMobile &&
    `
    grid-area: desktop-main-start / left-edge / mobile-main-end / right-edge;
  `}

  ${props =>
    !props.isMobile &&
    `
    grid-area: desktop-main-start / ${
      props.isDesktopSidebarActive ? 'main-start' : 'left-edge'
    } / bottom-edge / right-edge;
  `}
`;

const BottomBar = styled.div<{
  isMobile: boolean;
  isMobileSidebarActive: boolean;
}>`
  display: ${props =>
    props.isMobile && !props.isMobileSidebarActive ? 'inherit' : 'none'};
  grid-area: mobile-bottombar-start / left-edge / bottom-edge / right-edge;
  background: hotpink;
  z-index: 6;
`;

// TODO: check that we can't reach thumbnails by keyboard/screenreader
const Thumbnails = styled.div<{
  isActive: boolean;
  isMobileSidebarActive: boolean; // TODO: required?
  isDesktopSidebarActive: boolean;
  isMobile: boolean;
}>`
  background: ${props => props.theme.color('charcoal')};
  transform: translateY(${props => (props.isActive ? '0' : '100%')});
  transition: transform 250ms ease;
  z-index: 3;

  ${props =>
    props.isMobile &&
    `
    grid-area: desktop-main-start / left-edge / bottom-edge / right-edge;
  `}

  ${props =>
    !props.isMobile &&
    `
    grid-area: desktop-main-start / desktop-sidebar-end / bottom-edge / right-edge;
    `}
`;

const IIIFViewerPrototype: FunctionComponent<IIIFViewerProps> = ({
  mainPaginatorProps,
  currentCanvas,
  lang,
  canvases,
  canvasIndex,
  iiifImageLocation,
  work,
  manifest,
  manifestIndex,
  handleImageError,
}: IIIFViewerProps) => {
  const windowSize = useWindowSize();
  const [gridVisible, setGridVisible] = useState(false);
  const [parentManifest, setParentManifest] = useState<
    IIIFManifest | undefined
  >();
  const [currentManifestLabel, setCurrentManifestLabel] = useState<
    string | undefined
  >();
  const viewToggleRef = useRef<HTMLButtonElement>(null);
  const gridViewerRef = useRef<HTMLDivElement>(null);
  const mainViewerRef = useRef<FixedSizeList>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const [isDesktopSidebarActive, setIsDesktopSidebarActive] = useState(true);
  const [isMobileSidebarActive, setisMobileSidebarActive] = useState(false); // don't show sidebar by default on mobile
  const [activeIndex, setActiveIndex] = useState(0);
  const [showZoomed, setShowZoomed] = useState(false);
  const [zoomInfoUrl, setZoomInfoUrl] = useState<string | undefined>();
  const [rotatedImages, setRotatedImages] = useState<any[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageJson, setImageJson] = useState<any>();
  const [isMobile, setIsMobile] = useState(false);
  const [mainAreaHeight, setMainAreaHeight] = useState(500);
  const [mainAreaWidth, setMainAreaWidth] = useState(1000);
  const [searchResults, setSearchResults] = useState(results);
  const mainImageService = { '@id': getServiceId(currentCanvas) };
  const urlTemplate =
    iiifImageLocation && iiifImageTemplate(iiifImageLocation.url);
  const imageUrl = urlTemplate && urlTemplate({ size: '800,' });
  const firstRotatedImage = rotatedImages.find(
    image => image.canvasIndex === 0
  );
  const firstRotation = firstRotatedImage ? firstRotatedImage.rotation : 0;

  useEffect(() => {
    setIsMobile(windowSize === 'medium' || windowSize === 'small');
  }, [windowSize]);

  useEffect(() => {
    setIsDesktopSidebarActive(!showZoomed);
  }, [showZoomed]);

  // TODO: check for intersectionObservers (previous version of isEnhanced)
  // TODO: add testing and possibly fallbacks
  useEffect(() => {
    // TODO: either polyfill ts-ignore
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mainAreaObserver = new ResizeObserver(([mainArea]) => {
      setMainAreaWidth(mainArea.contentRect.width);
      setMainAreaHeight(mainArea.contentRect.height);
    });

    mainAreaRef &&
      mainAreaRef.current &&
      mainAreaObserver.observe(mainAreaRef.current);

    return () => mainAreaObserver.disconnect();
  }, []);

  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );
  const digitalLocation = iiifImageLocation || iiifPresentationLocation;
  const licenseInfo =
    digitalLocation &&
    digitalLocation.license &&
    getAugmentedLicenseInfo(digitalLocation.license);

  const iiifImageLocationCredit = iiifImageLocation && iiifImageLocation.credit;
  const showDownloadOptions = manifest
    ? isUiEnabled(getUiExtensions(manifest), 'mediaDownload')
    : true;

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
  const iiifPresentationDownloadOptions =
    (showDownloadOptions &&
      manifest &&
      imageDownloads && [
        ...imageDownloads,
        ...getDownloadOptionsFromManifest(manifest),
      ]) ||
    [];

  const downloadOptions = showDownloadOptions
    ? [...imageDownloadOptions, ...iiifPresentationDownloadOptions]
    : [];

  useSkipInitialEffect(() => {
    const canvasParams =
      canvases.length > 0 || currentCanvas
        ? { canvas: `${activeIndex + 1}` }
        : {};

    const url = {
      ...mainPaginatorProps.link.href,
      query: {
        ...mainPaginatorProps.link.href.query,
        ...canvasParams,
        source: 'viewer/paginator',
      },
    };
    const as = {
      ...mainPaginatorProps.link.as,
      query: {
        ...mainPaginatorProps.link.as.query,
        ...canvasParams,
      },
    };
    Router.replace(url, as);
  }, [activeIndex]);

  return (
    <ItemViewerContext.Provider
      value={{
        work: work,
        manifest: manifest,
        manifestIndex: manifestIndex,
        lang: lang,
        canvases: canvases,
        canvasIndex: canvasIndex,
        activeIndex: activeIndex,
        gridVisible: gridVisible,
        currentManifestLabel: currentManifestLabel,
        licenseInfo: licenseInfo,
        iiifImageLocationCredit: iiifImageLocationCredit,
        downloadOptions: downloadOptions,
        iiifPresentationDownloadOptions: iiifPresentationDownloadOptions,
        parentManifest: parentManifest,
        mainAreaWidth: mainAreaWidth,
        mainAreaHeight: mainAreaHeight,
        showZoomed: showZoomed,
        zoomInfoUrl: zoomInfoUrl,
        rotatedImages: rotatedImages,
        showControls: showControls,
        isLoading: isLoading,
        isFullscreen: isFullscreen,
        isDesktopSidebarActive: isDesktopSidebarActive,
        urlTemplate: urlTemplate,
        isMobile: isMobile,
        isMobileSidebarActive: isMobileSidebarActive,
        searchResults: searchResults,
        setSearchResults: setSearchResults,
        setIsMobileSidebarActive: setisMobileSidebarActive,
        setIsDesktopSidebarActive: setIsDesktopSidebarActive,
        setActiveIndex: setActiveIndex,
        setGridVisible: setGridVisible,
        setShowZoomed: setShowZoomed,
        setIsFullscreen: setIsFullscreen,
        setZoomInfoUrl: setZoomInfoUrl,
        setIsLoading: setIsLoading,
        setShowControls: setShowControls,
        errorHandler: handleImageError,
        setRotatedImages: setRotatedImages,
        setImageJson: setImageJson,
        setParentManifest: setParentManifest,
        setCurrentManifestLabel: setCurrentManifestLabel,
      }}
    >
      <Grid ref={viewerRef}>
        <Sidebar
          isMobile={isMobile}
          isActiveMobile={isMobileSidebarActive}
          isActiveDesktop={isDesktopSidebarActive}
        >
          <ViewerSidebarPrototype mainViewerRef={mainViewerRef} />
        </Sidebar>
        <Topbar
          isMobile={isMobile}
          isMobileSidebarActive={isMobileSidebarActive}
          isDesktopSidebarActive={isDesktopSidebarActive}
        >
          {!(isMobile && showZoomed) && (
            <ViewerTopBarPrototype
              viewToggleRef={viewToggleRef}
              viewerRef={viewerRef}
            />
          )}
        </Topbar>
        <Main
          isMobile={isMobile}
          isMobileSidebarActive={isMobileSidebarActive}
          isDesktopSidebarActive={isDesktopSidebarActive}
          ref={mainAreaRef}
        >
          {showZoomed && <ZoomedImagePrototype />}
          {!showZoomed && <ImageViewerControlsPrototype />}
          {urlTemplate && imageUrl && iiifImageLocation && (
            <ImageViewer
              infoUrl={iiifImageLocation.url}
              id={imageUrl}
              width={800}
              alt={work?.description || work?.title || ''}
              urlTemplate={urlTemplate}
              setShowZoomed={setShowZoomed}
              rotation={firstRotation}
              loadHandler={() => {
                setZoomInfoUrl(iiifImageLocation.url);
                setIsLoading(false);
              }}
            />
          )}
          {mainImageService['@id'] && currentCanvas && (
            <MainViewerPrototype
              mainViewerRef={mainViewerRef}
              mainAreaRef={mainAreaRef}
            />
          )}
        </Main>
        <BottomBar
          isMobile={isMobile}
          isMobileSidebarActive={isMobileSidebarActive}
        >
          <ViewerBottomBarPrototype
            viewToggleRef={viewToggleRef}
            viewerRef={viewerRef}
          />
        </BottomBar>
        <Thumbnails
          isActive={gridVisible}
          isMobile={isMobile}
          isMobileSidebarActive={isMobileSidebarActive}
          isDesktopSidebarActive={isDesktopSidebarActive}
        >
          <GridViewerPrototype
            mainViewerRef={mainViewerRef}
            gridViewerRef={gridViewerRef}
            viewerRef={viewerRef}
          />
        </Thumbnails>
      </Grid>
    </ItemViewerContext.Provider>
  );
};

export default IIIFViewerPrototype;
