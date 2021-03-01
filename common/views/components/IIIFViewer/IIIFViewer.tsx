import { IIIFCanvas, IIIFManifest } from '@weco/common/model/iiif';
import fetch from 'isomorphic-unfetch';
import {
  getDigitalLocationOfType,
  getDownloadOptionsFromImageUrl,
} from '@weco/common/utils/works';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import {
  getDownloadOptionsFromManifest,
  getServiceId,
  getUiExtensions,
  isUiEnabled,
} from '@weco/common/utils/iiif';
import styled from 'styled-components';
import {
  useState,
  useEffect,
  useRef,
  FunctionComponent,
  useContext,
} from 'react';
import { classNames, font } from '@weco/common/utils/classnames';
import Router from 'next/router';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { PropsWithoutRenderFunction as PaginatorPropsWithoutRenderFunction } from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer';
import LL from '@weco/common/views/components/styled/LL';
import Space from '../styled/Space';
import ViewerTopBar from '@weco/common/views/components/ViewerTopBar/ViewerTopBar';
import NoScriptViewer from './parts/NoScriptViewer';
import MainViewer from './parts/MainViewer';
import ThumbsViewer from './parts/ThumbsViewer';
import GridViewer from './parts/GridViewer';
import ExplorePanel from './parts/ExplorePanel';
import StructuresViewer from './parts/StructuresViewer';
import Control from '../Buttons/Control/Control';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Download from '@weco/catalogue/components/Download/Download';
import dynamic from 'next/dynamic';
import { DigitalLocation, Work } from '../../../model/catalogue';
import { FixedSizeList } from 'react-window';
import useSkipInitialEffect from '@weco/common/hooks/useSkipInitialEffect';
import BaseTabs, { TabType } from '../BaseTabs/BaseTabs';
import { AppContext } from '../AppContext/AppContext';

type TabProps = {
  isActive: boolean;
  isFocused: boolean;
  isKeyboard: boolean;
};

const Tab = styled(Space).attrs({
  as: 'span',
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'flex-inline': true,
    [font('hnm', 5)]: true,
  }),
})<TabProps>`
  cursor: pointer;
  background: ${props => props.theme.color('pumice')};

  ${props =>
    props.isActive &&
    `
    background: ${props.theme.color('cream')};
  `}
  ${props =>
    props.isFocused &&
    `
    box-shadow: ${props.isKeyboard ? props.theme.focusBoxShadow : null};
    position: relative;
    z-index: 1;
  `}
`;

const ScrollContainer = styled.div<{ height: number }>`
  overflow: scroll;
  height: ${props => `${props.height - 50}px`};
`;

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

const ZoomedImage = dynamic(
  () => import('@weco/common/views/components/ZoomedImage/ZoomedImage'),
  {
    ssr: false,
    loading: LoadingComponent,
  }
);

export const headerHeight = 149;
export const topBarHeight = 64;

export const IIIFViewerBackground = styled.div<{
  isFullscreen?: boolean;
  headerHeight: number;
}>`
  position: relative;
  background: ${props => props.theme.color('viewerBlack')};
  height: ${props =>
    props.isFullscreen ? '100vh' : `calc(100vh - ${props.headerHeight}px)`};
  color: ${props => props.theme.color('white')};
`;

export const IIIFViewerImageWrapper = styled.div.attrs(() => ({
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

export const IIIFViewer = styled.div.attrs(() => ({
  className: classNames({
    'flex flex--wrap': true,
  }),
}))`
  height: 100%;
  width: 100%;
  flex-direction: row-reverse;
`;

type IIIFViewerMainProps = {
  noScript: boolean;
  fullWidth?: boolean;
};
export const IIIFViewerMain = styled(Space).attrs(() => ({
  className: classNames({
    'relative bg-viewerBlack font-white': true,
  }),
}))<IIIFViewerMainProps>`
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

const ViewerLayout = styled.div<{ isFullscreen?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  height: ${props =>
    props.isFullscreen ? '100vh' : `calc(100vh - ${headerHeight}px)`};
  position: relative;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 4fr;
  }
`;

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

type IIIFViewerProps = {
  title: string;
  mainPaginatorProps: PaginatorPropsWithoutRenderFunction;
  thumbsPaginatorProps: PaginatorPropsWithoutRenderFunction;
  currentCanvas?: IIIFCanvas;
  lang: string;
  canvasOcr?: string;
  canvases: IIIFCanvas[];
  workId: string;
  pageIndex: number;
  pageSize: number;
  canvasIndex: number;
  iiifImageLocation?: DigitalLocation;
  work?: Work;
  manifest?: IIIFManifest;
  manifestIndex?: number;
  handleImageError?: () => void;
};

const IIIFViewerComponent: FunctionComponent<IIIFViewerProps> = ({
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
  const { isKeyboard } = useContext(AppContext);
  const [explorePanelVisible, setExplorePanelVisible] = useState(false);
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

  const tabs: TabType[] = [
    {
      id: 'thumbnails',
      tab: function TabWithDisplayName(isActive, isFocused) {
        return (
          <Tab
            isActive={isActive}
            isFocused={isFocused}
            isKeyboard={isKeyboard}
          >
            Thumbnails
          </Tab>
        );
      },
      tabPanel: (
        <GridViewer
          gridHeight={pageHeight}
          gridWidth={pageWidth}
          mainViewerRef={mainViewerRef}
          explorePanelVisible={explorePanelVisible}
          setExplorePanelVisible={setExplorePanelVisible}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          canvases={canvases}
          gridViewerRef={gridViewerRef}
          isFullscreen={isFullscreen}
          viewerRef={viewerRef}
        />
      ),
    },
    {
      id: 'index',
      tab: function TabWithDisplayName(isActive, isFocused) {
        return (
          <Tab
            isActive={isActive}
            isFocused={isFocused}
            isKeyboard={isKeyboard}
          >
            Index
          </Tab>
        );
      },
      tabPanel: (
        <ScrollContainer height={pageHeight}>
          <StructuresViewer
            setActiveIndex={setActiveIndex}
            mainViewerRef={mainViewerRef}
            manifest={manifest}
            setExplorePanelVisible={setExplorePanelVisible}
          />
        </ScrollContainer>
      ),
    },
  ];

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

  function setFullScreen() {
    if (
      window.document.fullscreenElement ||
      window.document['webkitFullscreenElement']
    ) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  }

  useEffect(() => {
    setExplorePanelVisible(!!Router.query.isOverview);
  }, []);

  useEffect(() => {
    window.document.addEventListener('fullscreenchange', setFullScreen, false);
    window.document.addEventListener(
      'webkitfullscreenchange',
      setFullScreen,
      false
    );
    return () => {
      window.document.removeEventListener(
        'fullscreenchange',
        setFullScreen,
        false
      );
      window.document.removeEventListener(
        'webkitfullscreenchange',
        setFullScreen,
        false
      );
    };
  }, []);
  const urlTemplate =
    iiifImageLocation && iiifImageTemplate(iiifImageLocation.url);
  const imageUrl = urlTemplate && urlTemplate({ size: '800,' });
  const iiifPresentationLocation =
    work && getDigitalLocationOfType(work, 'iiif-presentation');
  const digitalLocation = iiifImageLocation || iiifPresentationLocation;
  const licenseInfo =
    digitalLocation &&
    digitalLocation.license &&
    getAugmentedLicenseInfo(digitalLocation.license);

  const thumbnailsRequired =
    navigationCanvases && navigationCanvases.length > 1;

  const iiifImageLocationCredit = iiifImageLocation && iiifImageLocation.credit;
  // Download info from manifest
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

  const parentManifestUrl = manifest && manifest.within;

  const firstRotatedImage = rotatedImages.find(
    image => image.canvasIndex === 0
  );

  const firstRotation = firstRotatedImage ? firstRotatedImage.rotation : 0;

  useEffect(() => {
    if ('IntersectionObserver' in window) {
      setEnhanced(true);
    }
  }, []);

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

  useEffect(() => {
    const fetchParentManifest = async () => {
      const parentManifest =
        parentManifestUrl && (await (await fetch(parentManifestUrl)).json());
      parentManifest && setParentManifest(parentManifest);
    };

    fetchParentManifest();
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

  useEffect(() => {
    // TODO similar for tab panel
    if (explorePanelVisible) {
      const thumb = gridViewerRef.current?.getElementsByClassName(
        'activeThumbnail'
      )?.[0] as HTMLButtonElement | undefined;
      thumb?.focus();
    } else {
      viewToggleRef.current?.focus();
    }
  }, [explorePanelVisible]);

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
    <div ref={viewerRef}>
      <ViewerTopBar
        canvases={canvases}
        enhanced={enhanced}
        explorePanelVisible={explorePanelVisible}
        setExplorePanelVisible={setExplorePanelVisible}
        workId={workId}
        viewToggleRef={viewToggleRef}
        currentManifestLabel={currentManifestLabel}
        canvasIndex={activeIndex}
        title={title}
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
      <IIIFViewerBackground
        isFullscreen={isFullscreen}
        headerHeight={headerHeight}
      >
        {isLoading && <LoadingComponent />}
        {showZoomed && (
          <ZoomedImage
            id={`zoomedImage`}
            infoUrl={zoomInfoUrl ?? ''}
            setShowViewer={setShowZoomed}
            isFullscreen={isFullscreen}
          />
        )}
        {!enhanced && (
          <NoScriptViewer
            thumbnailsRequired={thumbnailsRequired || false}
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
            pageSize={pageSize}
          />
        )}
        {enhanced && (
          <>
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
            {urlTemplate && imageUrl && iiifImageLocation && (
              <IIIFViewerImageWrapper>
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
              </IIIFViewerImageWrapper>
            )}
            {mainImageService['@id'] && currentCanvas && (
              <ViewerLayout isFullscreen={isFullscreen}>
                <ExplorePanel
                  explorePanelVisible={explorePanelVisible}
                  isFullscreen={isFullscreen}
                  viewerRef={viewerRef}
                >
                  {/* if  toggle on */}
                  <BaseTabs
                    tabs={tabs}
                    label={'Tabs for explore tools'}
                    activeTabIndex={0}
                    onTabClick={() => {
                      return null;
                    }}
                  />
                  {/* ELSE */}
                  {/* <GridViewer
                    gridHeight={pageHeight}
                    gridWidth={pageWidth}
                    mainViewerRef={mainViewerRef}
                    explorePanelVisible={explorePanelVisible}
                    setExplorePanelVisible={setExplorePanelVisible}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    canvases={canvases}
                    gridViewerRef={gridViewerRef}
                    isFullscreen={isFullscreen}
                    viewerRef={viewerRef}
                  /> */}
                </ExplorePanel>
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
                    errorHandler={handleImageError}
                  />
                </div>
              </ViewerLayout>
            )}
          </>
        )}
      </IIIFViewerBackground>
      {!enhanced && (
        <Layout12>
          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <Download
              ariaControlsId="itemDownloads"
              title={title}
              workId={workId}
              license={licenseInfo}
              iiifImageLocationCredit={iiifImageLocationCredit}
              downloadOptions={[
                ...imageDownloadOptions,
                ...iiifPresentationDownloadOptions,
              ]}
              useDarkControl={true}
              isInline={true}
            />
          </Space>
        </Layout12>
      )}
    </div>
  );
};

export default IIIFViewerComponent;
