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
import ViewerSidebarPrototype from '../ViewerSidebarPrototype/ViewerSidebarPrototype';
import MainViewerPrototype from '../MainViewerPrototype/MainViewerPrototype';
import ViewerTopBarPrototype from '../ViewerTopBarPrototype/ViewerTopBarPrototype';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { FixedSizeList } from 'react-window';
import useSkipInitialEffect from '@weco/common/hooks/useSkipInitialEffect';
import Router from 'next/router';
import GridViewerPrototype from '../GridViewerPrototype/GridViewerPrototype';
import Space from '../styled/Space';
import Control from '../Buttons/Control/Control';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import dynamic from 'next/dynamic';
import LL from '@weco/common/views/components/styled/LL';
import { PropsWithoutRenderFunction as PaginatorPropsWithoutRenderFunction } from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';

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

const ImageViewerControls = styled.div<{ showControls?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 73%;
  z-index: 1;
  opacity: ${props => (props.showControls ? 1 : 0)};
  transition: opacity 300ms ease;
  display: flex;
  /* TODO: keep an eye on https://github.com/openseadragon/openseadragon/issues/1586
    for a less heavy handed solution to Openseadragon breaking on touch events */
  &,
  button,
  a {
    touch-action: none;
  }

  button {
    display: block;
  }

  .icon {
    margin: 0;
  }

  .btn__text {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }
`;

const Grid = styled.div`
  display: grid;
  height: calc(100vh - 85px); // FIXME: use variable for header height
  overflow: hidden;
  grid-template-columns: [left-edge] minmax(200px, 3fr) [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  grid-template-rows: [top-edge] min-content [desktop-main-start desktop-topbar-end] 1fr [bottom-edge];
`;

const Sidebar = styled.div<{ isActive: boolean }>`
  display: ${props => (props.isActive ? 'inherit' : 'none')};
  grid-area: top-edge / left-edge / bottom-edge / desktop-sidebar-end;
  background: ${props => props.theme.color('viewerBlack')};
  color: ${props => props.theme.color('white')};
  border-right: 1px solid ${props => props.theme.color('charcoal')};
  overflow: auto;
`;

const Topbar = styled.div<{ isSidebarActive: boolean }>`
  background: ${props => props.theme.color('charcoal')};
  grid-area: top-edge /
    ${props => (props.isSidebarActive ? 'desktop-topbar-start' : 'left-edge')} /
    desktop-topbar-end / right-edge;
`;

const Main = styled.div<{ isSidebarActive: boolean }>`
  background: ${props => props.theme.color('viewerBlack')};
  color: ${props => props.theme.color('white')};
  grid-area: desktop-main-start /
    ${props => (props.isSidebarActive ? 'main-start' : 'left-edge')} /
    bottom-edge / right-edge;
  overflow: auto;
  position: relative;
`;

// TODO: check that we can't reach thumbnails by keyboard/screenreader
const Thumbnails = styled.div<{ isActive: boolean; isSidebarActive: boolean }>`
  background: ${props => props.theme.color('charcoal')};
  grid-area: desktop-main-start /
    ${props => (props.isSidebarActive ? 'main-start' : 'left-edge')} /
    bottom-edge / right-edge;
  transform: translateY(${props => (props.isActive ? '0' : '100%')});
  transition: transform 250ms ease;
  z-index: 3;
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
  const [isSidebarActive, setIsSidebarActive] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showZoomed, setShowZoomed] = useState(false);
  const [zoomInfoUrl, setZoomInfoUrl] = useState<string | undefined>();
  const [rotatedImages, setRotatedImages] = useState<any[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageJson, setImageJson] = useState<any>();
  const [mainAreaHeight, setMainAreaHeight] = useState(500);
  const [mainAreaWidth, setMainAreaWidth] = useState(1000);
  const mainImageService = { '@id': getServiceId(currentCanvas) };
  const urlTemplate =
    iiifImageLocation && iiifImageTemplate(iiifImageLocation.url);

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
        isSidebarActive: isSidebarActive,
        setIsSidebarActive: setIsSidebarActive,
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
        <Sidebar isActive={!showZoomed}>
          <ViewerSidebarPrototype mainViewerRef={mainViewerRef} />
        </Sidebar>
        <Topbar isSidebarActive={!showZoomed}>
          <ViewerTopBarPrototype
            viewToggleRef={viewToggleRef}
            viewerRef={viewerRef}
          />
        </Topbar>
        <Main isSidebarActive={!showZoomed} ref={mainAreaRef}>
          {showZoomed && <ZoomedImagePrototype />}
          {!showZoomed && (
            <ImageViewerControls showControls={showControls || urlTemplate}>
              <Space
                h={{ size: 's', properties: ['margin-left'] }}
                v={{ size: 'l', properties: ['margin-bottom'] }}
              >
                <Control
                  colorScheme="black-on-white"
                  text="Zoom in"
                  icon="zoomIn"
                  clickHandler={() => {
                    setShowZoomed(true);
                  }}
                />
              </Space>
              <Space
                h={{ size: 's', properties: ['margin-left'] }}
                v={{ size: 'l', properties: ['margin-bottom'] }}
              >
                <Control
                  colorScheme="black-on-white"
                  text="Rotate"
                  icon="rotatePageRight"
                  clickHandler={() => {
                    const matchingIndex = rotatedImages.findIndex(
                      image => image.canvasIndex === activeIndex
                    );
                    if (matchingIndex >= 0) {
                      rotatedImages[matchingIndex] = {
                        canvasIndex: rotatedImages[matchingIndex].canvasIndex,
                        rotation:
                          rotatedImages[matchingIndex].rotation < 270
                            ? rotatedImages[matchingIndex].rotation + 90
                            : 0,
                      };
                    } else {
                      rotatedImages.push({
                        canvasIndex: activeIndex,
                        rotation: 90,
                      });
                    }
                    setRotatedImages([...rotatedImages]);
                    setIsLoading(true);
                  }}
                />
              </Space>
            </ImageViewerControls>
          )}
          <MainViewerPrototype
            mainViewerRef={mainViewerRef}
            mainAreaRef={mainAreaRef}
          />
        </Main>
        <Thumbnails isActive={gridVisible} isSidebarActive={!showZoomed}>
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
