import { FunctionComponent, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
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
import { IIIFViewerProps } from '../IIIFViewer/IIIFViewer';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { FixedSizeList } from 'react-window';
import { IIIFManifest } from '@weco/common/model/iiif';
import useSkipInitialEffect from '@weco/common/hooks/useSkipInitialEffect';
import Router from 'next/router';

const Grid = styled.div`
  display: grid;
  height: calc(100vh - 85px); // FIXME: use variable for header height
  overflow: hidden;
  grid-template-columns: [left-edge] minmax(200px, 3fr) [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  grid-template-rows: [top-edge] min-content [desktop-main-start desktop-topbar-end] 1fr [bottom-edge];
`;

const Sidebar = styled.div`
  grid-area: top-edge / left-edge / bottom-edge / desktop-sidebar-end;
  background: ${props => props.theme.color('viewerBlack')};
  color: ${props => props.theme.color('white')};
  border-right: 1px solid ${props => props.theme.color('charcoal')};
  overflow: auto;
`;

const Topbar = styled.div`
  background: ${props => props.theme.color('charcoal')};
  grid-area: top-edge / desktop-topbar-start / desktop-topbar-end / right-edge;
`;

const Main = styled.div`
  background: ${props => props.theme.color('viewerBlack')};
  color: ${props => props.theme.color('white')};
  grid-area: desktop-main-start / main-start / bottom-edge / right-edge;
  overflow: auto;
`;

const Thumbnails = styled.div`
  background: ${props => props.theme.color('charcoal')};
  grid-area: desktop-main-start / main-start / bottom-edge / right-edge;
  transform: translateY(${props => (props.isActive ? '0' : '100%')});
  transition: transform 250ms ease;
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageHeight, setPageHeight] = useState(500);
  const [pageWidth, setPageWidth] = useState(1000);
  const [showZoomed, setShowZoomed] = useState(false);
  const [zoomInfoUrl, setZoomInfoUrl] = useState<string | undefined>();
  const [rotatedImages, setRotatedImages] = useState<any[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageJson, setImageJson] = useState<any>();
  const mainImageService = { '@id': getServiceId(currentCanvas) };

  const iiifPresentationLocation =
    work && getDigitalLocationOfType(work, 'iiif-presentation');
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
        pageHeight: pageHeight,
        pageWidth: pageWidth,
        showZoomed: showZoomed,
        zoomInfoUrl: zoomInfoUrl,
        rotatedImages: rotatedImages,
        showControls: showControls,
        isLoading: isLoading,
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
        <Sidebar>
          <ViewerSidebarPrototype mainViewerRef={mainViewerRef} />
        </Sidebar>
        <Topbar>
          <ViewerTopBarPrototype
            viewToggleRef={viewToggleRef}
            viewerRef={viewerRef}
          />
        </Topbar>
        <Main>
          <MainViewerPrototype mainViewerRef={mainViewerRef} />
        </Main>
        <Thumbnails isActive={gridVisible}>{/* TODO: thumbnails */}</Thumbnails>
      </Grid>
    </ItemViewerContext.Provider>
  );
};

export default IIIFViewerPrototype;
