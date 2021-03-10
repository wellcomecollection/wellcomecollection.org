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
import MainViewer from '../IIIFViewer/parts/MainViewer';
import ViewerTopBarPrototype from '../ViewerTopBarPrototype/ViewerTopBarPrototype';
import { IIIFViewerProps } from '../IIIFViewer/IIIFViewer';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';

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
      <Sidebar>
        <ViewerSidebarPrototype
          title={title}
          workId={workId}
          work={work}
          manifest={manifest}
          setActiveIndex={setActiveIndex}
          mainViewerRef={mainViewerRef}
        />
      </Sidebar>
      <Topbar>
        <ViewerTopBarPrototype
          canvases={canvases}
          enhanced={enhanced}
          gridVisible={gridVisible}
          setGridVisible={setGridVisible}
          workId={workId}
          viewToggleRef={viewToggleRef}
          currentManifestLabel={currentManifestLabel}
          canvasIndex={activeIndex}
          licenseInfo={licenseInfo}
          iiifImageLocationCredit={iiifImageLocationCredit}
          downloadOptions={
            showDownloadOptions
              ? [...imageDownloadOptions, ...iiifPresentationDownloadOptions]
              : []
          }
          iiifPresentationDownloadOptions={iiifPresentationDownloadOptions}
          parentManifest={parentManifest}
          lang={lang}
          viewerRef={viewerRef}
          manifestIndex={manifestIndex}
        />
      </Topbar>
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
