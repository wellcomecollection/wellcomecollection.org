// @flow
import { type IIIFCanvas, type IIIFManifest } from '@weco/common/model/iiif';
import fetch from 'isomorphic-unfetch';
import {
  type Work,
  type CatalogueApiError,
} from '@weco/common/model/catalogue';
import {
  getDownloadOptionsFromImageUrl,
  getDownloadOptionsFromManifest,
} from '@weco/common/utils/works';
import styled from 'styled-components';
import { useState, useEffect, useRef, type ComponentType } from 'react';
import getLicenseInfo from '@weco/common/utils/get-license-info';
import { clientSideSearchParams } from '@weco/common/services/catalogue/search-params';
import { classNames } from '@weco/common/utils/classnames';
import Router from 'next/router';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { type PropsWithoutRenderFunction as PaginatorPropsWithoutRenderFunction } from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer';
import LL from '@weco/common/views/components/styled/LL';
import Space, { type SpaceComponentProps } from '../styled/Space';
import ViewerTopBar from '@weco/common/views/components/ViewerTopBar/ViewerTopBar';
import NoScriptViewer from './parts/NoScriptViewer';
import MainViewer from './parts/MainViewer';
import ThumbsViewer from './parts/ThumbsViewer';
import GridViewer from './parts/GridViewer';
import Control from '../Buttons/Control/Control';
import dynamic from 'next/dynamic';
const LoadingComponent = () => (
  <div
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: '1000',
    }}
  >
    <LL />
  </div>
);

const ZoomedImage = dynamic(
  () => import('@weco/common/views/components/ZoomedImage/ZoomedImage'),
  {
    ssr: false,
    loading: LoadingComponent,
  }
);

export const headerHeight = 149;
export const topBarHeight = 64;

const IIIFViewerBackground = styled.div`
  position: relative;
  background: ${props => props.theme.colors.viewerBlack};
  height: ${props =>
    props.isFullscreen ? '100vh' : `calc(100vh - ${`${headerHeight}px`})`}
  color: ${props => props.theme.colors.white};
`;

export const IIIFViewerImageWrapper = styled.div.attrs(props => ({
  className: classNames({
    absolute: true,
  }),
}))`
  top: ${props => `${props.theme.spacingUnit * 2}px`};
  right: 0;
  bottom: ${props => `${props.theme.spacingUnit * 2}px`};
  left: 0;

  img {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
`;

export const IIIFViewer = styled.div.attrs(props => ({
  className: classNames({
    'flex flex--wrap': true,
  }),
}))`
  height: 100%;
  width: 100%;
  flex-direction: row-reverse;
`;

export const IIIFViewerMain: ComponentType<SpaceComponentProps> = styled(
  Space
).attrs(props => ({
  className: classNames({
    'relative bg-viewerBlack font-white': true,
  }),
}))`
  ${props => {
    if (props.noScript) {
      return `height: 80%;
      @media (min-width: ${props.theme.sizes.medium}px) {
        height: 100%;
      }`;
    }
  }}
  width: 100%;

  @media (min-width: ${props => props.theme.sizes.medium}px) {
    height: 100%;
    width: ${props => (props.fullWidth ? '100%' : '75%')};
  }
`;

const ViewerLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  height: ${props =>
    props.isFullscreen ? '100vh' : `calc(100vh - ${`${headerHeight}px`})`};
  position: relative;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 4fr;
  }
`;

const ImageViewerControls = styled.div`
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
}`;

type IIIFViewerProps = {|
  title: string,
  mainPaginatorProps: PaginatorPropsWithoutRenderFunction,
  thumbsPaginatorProps: PaginatorPropsWithoutRenderFunction,
  currentCanvas: ?IIIFCanvas,
  lang: string,
  canvasOcr: ?string,
  canvases: [],
  workId: string,
  pageIndex: number,
  sierraId: string,
  pageSize: number,
  canvasIndex: number,
  iiifImageLocationUrl: ?string,
  imageUrl: ?string,
  work: ?(Work | CatalogueApiError),
  manifest: ?IIIFManifest,
|};

const IIIFViewerComponent = ({
  title,
  mainPaginatorProps,
  thumbsPaginatorProps,
  currentCanvas,
  lang,
  canvasOcr,
  canvases,
  workId,
  pageIndex,
  sierraId,
  pageSize,
  canvasIndex,
  iiifImageLocationUrl,
  imageUrl,
  work,
  manifest,
}: IIIFViewerProps) => {
  const [gridVisible, setGridVisible] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [parentManifest, setParentManifest] = useState(null);
  const [currentManifestLabel, setCurrentManifestLabel] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageHeight, setPageHeight] = useState(500);
  const [pageWidth, setPageWidth] = useState(1000);
  const [showZoomed, setShowZoomed] = useState(false);
  const [zoomInfoUrl, setZoomInfoUrl] = useState(null);
  const [rotatedImages, setRotatedImages] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewToggleRef = useRef(null);
  const gridViewerRef = useRef(null);
  const mainViewerRef = useRef(null);
  const viewerRef = useRef(null);
  const navigationCanvases =
    canvases &&
    [...Array(pageSize)]
      .map((_, i) => pageSize * pageIndex + i)
      .map(i => canvases[i])
      .filter(Boolean);

  const mainImageService = {
    '@id': currentCanvas ? currentCanvas.images[0].resource.service['@id'] : '',
  };

  function setFullScreen() {
    if (
      window.document.fullscreenElement &&
      window.document.fullscreenElement !== null
    ) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  }
  useEffect(() => {
    window.document.addEventListener('fullscreenchange', setFullScreen, false);
    return () => {
      window.document.removeEventListener(
        'fullscreenchange',
        setFullScreen,
        false
      );
    };
  }, []);
  const [iiifImageLocation] =
    work && work.type !== 'Error'
      ? work.items
          .map(item =>
            item.locations.find(
              location => location.locationType.id === 'iiif-image'
            )
          )
          .filter(Boolean)
      : [];
  const urlTemplate =
    iiifImageLocation && iiifImageTemplate(iiifImageLocation.url);

  const thumbnailsRequired =
    navigationCanvases && navigationCanvases.length > 1;

  const iiifImageLocationCredit = iiifImageLocation && iiifImageLocation.credit;
  const iiifImageLocationLicenseId =
    iiifImageLocation &&
    iiifImageLocation.license &&
    iiifImageLocation.license.id;
  const licenseInfo =
    iiifImageLocationLicenseId && getLicenseInfo(iiifImageLocationLicenseId);

  const downloadOptions = iiifImageLocationUrl
    ? getDownloadOptionsFromImageUrl(iiifImageLocationUrl)
    : null;

  // Download info from manifest
  const iiifPresentationDownloadOptions =
    (manifest && getDownloadOptionsFromManifest(manifest)) || [];
  const iiifPresentationLicenseInfo =
    manifest && manifest.license ? getLicenseInfo(manifest.license) : null;
  const parentManifestUrl = manifest && manifest.within;
  const params = clientSideSearchParams();

  const firstRotatedImage = rotatedImages.find(
    image => image.canvasIndex === 0
  );
  const firstRotation = firstRotatedImage ? firstRotatedImage.rotation : 0;
  useEffect(() => {
    if ('IntersectionObserver' in window) {
      setGridVisible(Router.query.isOverview);
      setEnhanced(true);
    }
  }, []);
  useEffect(() => {
    Router.replace(
      {
        ...mainPaginatorProps.link.href,
        query: {
          ...mainPaginatorProps.link.href.query,
          canvas: `${activeIndex + 1}`,
        },
      },
      {
        ...mainPaginatorProps.link.as,
        query: {
          ...mainPaginatorProps.link.as.query,
          canvas: `${activeIndex + 1}`,
        },
      }
    );
  }, [activeIndex]);

  useEffect(() => {
    const fetchParentManifest = async () => {
      const parentManifest =
        parentManifestUrl && (await (await fetch(parentManifestUrl)).json());
      parentManifest && setParentManifest(parentManifest);
    };

    fetchParentManifest();
  }, []);

  useEffect(() => {
    if (gridVisible) {
      gridViewerRef &&
        gridViewerRef.current &&
        gridViewerRef.current.getElementsByClassName('activeThumbnail')[0] &&
        gridViewerRef.current
          .getElementsByClassName('activeThumbnail')[0]
          .focus();
    } else {
      viewToggleRef && viewToggleRef.current && viewToggleRef.current.focus();
    }
  }, [gridVisible]);

  useEffect(() => {
    const matchingManifest =
      parentManifest &&
      parentManifest.manifests &&
      parentManifest.manifests.find(manifest => {
        return (
          (manifest['@id'].match(/iiif\/(.*)\/manifest/) || [])[1] === sierraId
        );
      });

    matchingManifest && setCurrentManifestLabel(matchingManifest.label);
  });

  useEffect(() => {
    function handleResize() {
      if (isFullscreen) {
        setPageHeight(window.innerHeight);
      } else {
        setPageHeight(window.innerHeight - headerHeight);
      }
      setPageWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  return (
    <div
      ref={viewerRef}
      style={{
        border: '2px solid red',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ViewerTopBar
        canvases={canvases}
        enhanced={enhanced}
        gridVisible={gridVisible}
        setGridVisible={setGridVisible}
        workId={workId}
        viewToggleRef={viewToggleRef}
        currentManifestLabel={currentManifestLabel}
        params={params}
        canvasIndex={activeIndex}
        title={title}
        licenseInfo={licenseInfo}
        iiifPresentationLicenseInfo={iiifPresentationLicenseInfo}
        iiifImageLocationCredit={iiifImageLocationCredit}
        iiifImageLocationLicenseId={iiifImageLocationLicenseId}
        downloadOptions={downloadOptions}
        iiifPresentationDownloadOptions={iiifPresentationDownloadOptions}
        parentManifest={parentManifest}
        lang={lang}
        viewerRef={viewerRef}
      />
      <IIIFViewerBackground isFullscreen={isFullscreen}>
        {isLoading && <LoadingComponent />}
        {showZoomed && (
          <ZoomedImage
            id={`zoomedImage`}
            infoUrl={zoomInfoUrl}
            setShowViewer={setShowZoomed}
            isFullscreen={isFullscreen}
          />
        )}
        {!enhanced && (
          <NoScriptViewer
            thumbnailsRequired={thumbnailsRequired || false}
            iiifImageLocationUrl={iiifImageLocationUrl}
            imageUrl={imageUrl}
            iiifImageLocation={iiifImageLocation}
            currentCanvas={currentCanvas}
            canvasOcr={canvasOcr}
            lang={lang}
            mainPaginatorProps={mainPaginatorProps}
            thumbsPaginatorProps={thumbsPaginatorProps}
            workId={workId}
            canvases={canvases}
            canvasIndex={canvasIndex}
            pageIndex={pageIndex}
            sierraId={sierraId}
            pageSize={pageSize}
            params={params}
          />
        )}
        {enhanced && (
          <>
            <ImageViewerControls
              showControls={
                showControls ||
                (urlTemplate && iiifImageLocationUrl && imageUrl)
              }
            >
              <Space
                h={{ size: 's', properties: ['margin-left'] }}
                v={{ size: 'l', properties: ['margin-bottom'] }}
              >
                <Control
                  type="black-on-white"
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
                  type="black-on-white"
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
            {urlTemplate && iiifImageLocationUrl && imageUrl && (
              <IIIFViewerImageWrapper>
                <ImageViewer
                  infoUrl={iiifImageLocationUrl}
                  id={imageUrl}
                  width={800}
                  alt={(work && work.description) || (work && work.title) || ''}
                  urlTemplate={urlTemplate}
                  setShowZoomed={setShowZoomed}
                  rotation={firstRotation}
                  loadHandler={() => {
                    setZoomInfoUrl(iiifImageLocationUrl);
                    setIsLoading(false);
                  }}
                />
              </IIIFViewerImageWrapper>
            )}
            {mainImageService['@id'] && currentCanvas && (
              <ViewerLayout isFullscreen={isFullscreen}>
                <GridViewer
                  gridHeight={pageHeight}
                  gridWidth={pageWidth}
                  mainViewerRef={mainViewerRef}
                  gridVisible={gridVisible}
                  setGridVisible={setGridVisible}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  canvases={canvases}
                  gridViewerRef={gridViewerRef}
                  isFullscreen={isFullscreen}
                />
                {pageWidth >= 600 && (
                  <ThumbsViewer
                    canvases={canvases}
                    listHeight={pageHeight}
                    mainViewerRef={mainViewerRef}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                  />
                )}
                <div style={{ position: 'relative' }} lang={lang}>
                  {/* aria-live="polite" TODO need to test this with people using screen readers */}
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
                  />
                </div>
              </ViewerLayout>
            )}
          </>
        )}
      </IIIFViewerBackground>
    </div>
  );
};

export default IIIFViewerComponent;
