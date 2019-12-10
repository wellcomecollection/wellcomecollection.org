// @flow
import { type IIIFCanvas, type IIIFManifest } from '@weco/common/model/iiif';
// import fetch from 'isomorphic-unfetch';
import { lighten } from 'polished';
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
// import { itemUrl } from '@weco/common/services/catalogue/urls';
import { clientSideSearchParams } from '@weco/common/services/catalogue/search-params';
import { classNames, font } from '@weco/common/utils/classnames';
// import NextLink from 'next/link';
import Router from 'next/router';
// import {
//   // convertIiifUriToInfoUri,
//   iiifImageTemplate,
// } from '@weco/common/utils/convert-image-uri';
// import Paginator,
import { type PropsWithoutRenderFunction as PaginatorPropsWithoutRenderFunction } from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
// import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer';
// import LL from '@weco/common/views/components/styled/LL';
import Space, { type SpaceComponentProps } from '../styled/Space';
import ViewerTopBar from '@weco/common/views/components/ViewerTopBar/ViewerTopBar';
// import IIIFCanvasThumbnail from './parts/IIIFCanvasThumbnail';
import NoScriptViewer from './parts/NoScriptViewer'; // PaginatorButtons, // IIIFViewerPaginatorButtons,
import MainViewer from './parts/MainViewer';
import ThumbsViewer from './parts/ThumbsViewer';
import GridViewer from './parts/GridViewer';

export const headerHeight = 149;

const IIIFViewerBackground = styled.div`
  position: relative;
  background: ${props => props.theme.colors.viewerBlack};
  height: calc(100vh - ${`${headerHeight}px`});
  color: ${props => props.theme.colors.white};
  noscript {
    color: ${props => props.theme.colors.white};
  }
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

  noscript & img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
`;

export const IIIFViewerMain: ComponentType<SpaceComponentProps> = styled(
  Space
).attrs(props => ({
  className: classNames({
    'relative bg-viewerBlack font-white': true,
  }),
}))`
  noscript & {
    height: 80%;
    @media (min-width: ${props => props.theme.sizes.medium}px) {
      height: 100%;
    }
  }
  width: 100%;

  @media (min-width: ${props => props.theme.sizes.medium}px) {
    height: 100%;
    width: ${props => (props.fullWidth ? '100%' : '75%')};
  }
`;

export const IIIFViewerThumb = styled.div`
  width: 130px;
  margin: 3%;
  border-radius: 8px;
  background: ${props =>
    props.isActive
      ? lighten(0.14, props.theme.colors.viewerBlack)
      : props.theme.colors.viewerBlack};

  img {
    display: block;
    width: 100%;
  }

  noscript & {
    height: 100%;
    @media (min-width: ${props => props.theme.sizes.medium}px) {
      width: auto;
    }
    img {
      display: inline-block;
      max-height: calc(100% - 2em);
    }
  }
`;

export const IIIFViewerThumbLink = styled.a.attrs(props => ({
  className: classNames({
    'block h-center': true,
  }),
}))`
  text-decoration: none;
  height: 100%;
  text-align: center;
  display: block;
  padding: 16px 16px 3px;
`;

export const IIIFViewerThumbNumber = styled.span.attrs(props => ({
  className: classNames({
    'line-height-1': true,
    'inline-block': true,
    'font-white': !props.isActive,
    'font-black': props.isActive,
    'bg-yellow': props.isActive,
    [font('hnm', 6)]: true,
  }),
}))`
  padding: 3px 6px;
  border-radius: 3px;
`;

// const ScrollingThumbnailContainer = styled.div`
//   height: calc(100% - ${headerHeight}px);
//   overflow: scroll;
//   background: ${props => props.theme.colors.viewerBlack};
//   position: fixed;
//   top: ${props => (props.showThumbs ? `${headerHeight}px` : '100vh')};
//   left: 0;
//   transition: top 800ms ease;
//   z-index: 1;
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: space-around;

//   /* Makes sure trailing items in last row stay next to each other rather than being evenly spaced */
//   &:after {
//     content: '';
//     flex: auto;
//   }
// `;

const ViewerLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  height: calc(100vh - ${`${headerHeight}px`});
  position: relative;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 5fr;
  }
`;

// function scrollIntoViewIfOutOfView(container, index) {
//   const itemToScroll = container.children.item(index);
//   if (itemToScroll) {
//     const inView = checkInView(container, itemToScroll);
//     !inView && itemToScroll.scrollIntoView();
//   }
// }

// function checkInView(container, element, includePartialView) {
//   const containerTop = container.scrollTop;
//   const containerBottom = containerTop + container.clientHeight;
//   const elementTop = element.offsetTop;
//   const elementBottom = elementTop + element.clientHeight;

//   return elementTop >= containerTop && elementBottom <= containerBottom;
// }

type IIIFViewerProps = {|
  title: string,
  mainPaginatorProps: PaginatorPropsWithoutRenderFunction,
  thumbsPaginatorProps: PaginatorPropsWithoutRenderFunction,
  currentCanvas: ?IIIFCanvas,
  lang: string,
  canvasOcr: ?string,
  canvases: ?[],
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
  const [showThumbs, setShowThumbs] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  // const [parentManifest, setParentManifest] = useState(null);
  // const [currentManifestLabel, setCurrentManifestLabel] = useState(null);
  const parentManifest = null;
  const currentManifestLabel = null;
  // const thumbnailContainer = useRef(null);
  const activeThumbnailRef = useRef(null);
  const viewToggleRef = useRef(null);
  const navigationCanvases =
    canvases &&
    [...Array(pageSize)]
      .map((_, i) => pageSize * pageIndex + i)
      .map(i => canvases[i])
      .filter(Boolean);

  // const mainImageService = {
  //   '@id': currentCanvas ? currentCanvas.images[0].resource.service['@id'] : '',
  // };

  // Download info from work
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
  // const urlTemplate =
  //   (iiifImageLocation && iiifImageTemplate(iiifImageLocation.url)) ||
  //   (mainImageService['@id'] && iiifImageTemplate(mainImageService['@id']));

  const thumbnailsRequired =
    navigationCanvases && navigationCanvases.length > 1;

  const iiifImageLocationCredit = iiifImageLocation && iiifImageLocation.credit;
  const iiifImageLocationLicenseId =
    iiifImageLocation &&
    iiifImageLocation.license &&
    iiifImageLocation.license.id;
  const licenseInfo =
    iiifImageLocationLicenseId && getLicenseInfo(iiifImageLocationLicenseId);

  const downloadOptions = iiifImageLocationUrl // TODO move to ViewerTopBar?
    ? getDownloadOptionsFromImageUrl(iiifImageLocationUrl)
    : null;

  // // Download info from manifest
  const iiifPresentationDownloadOptions =
    (manifest && getDownloadOptionsFromManifest(manifest)) || [];
  const iiifPresentationLicenseInfo =
    manifest && manifest.license ? getLicenseInfo(manifest.license) : null;
  // const parentManifestUrl = manifest && manifest.within;
  const params = clientSideSearchParams();

  useEffect(() => {
    setShowThumbs(Router.query.isOverview);
    setEnhanced(true);
  }, []);

  // useEffect(() => {
  //   const fetchParentManifest = async () => {
  //     const parentManifest =
  //       parentManifestUrl && (await (await fetch(parentManifestUrl)).json());
  //     parentManifest && setParentManifest(parentManifest);
  //   };

  //   fetchParentManifest();
  // }, []);
  // useEffect(() => {
  //   const matchingManifest =
  //     parentManifest &&
  //     parentManifest.manifests &&
  //     parentManifest.manifests.find(manifest => {
  //       return (
  //         (manifest['@id'].match(/iiif\/(.*)\/manifest/) || [])[1] === sierraId
  //       );
  //     });

  //   matchingManifest && setCurrentManifestLabel(matchingManifest.label);
  // });

  // useEffect(() => {
  //   thumbnailContainer.current &&
  //     scrollIntoViewIfOutOfView(thumbnailContainer.current, canvasIndex);
  // }, [canvasIndex]);

  /// ////////////
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageHeight, setPageHeight] = useState(500);
  const [pageWidth, setPageWidth] = useState(1000);
  const mainViewerRef = useRef(null);
  const viewerLayoutRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      setPageHeight(window.innerHeight - 149); // TODO this function account for header properly - page height too big can scroll of the end
      setPageWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  /// ////////////////

  return (
    <>
      <ViewerTopBar
        canvases={canvases}
        enhanced={enhanced}
        showThumbs={showThumbs}
        setShowThumbs={setShowThumbs}
        activeThumbnailRef={activeThumbnailRef}
        workId={workId}
        viewToggleRef={viewToggleRef}
        currentManifestLabel={currentManifestLabel}
        params={params}
        canvasIndex={canvasIndex}
        title={title}
        licenseInfo={licenseInfo}
        iiifPresentationLicenseInfo={iiifPresentationLicenseInfo}
        iiifImageLocationCredit={iiifImageLocationCredit}
        iiifImageLocationLicenseId={iiifImageLocationLicenseId}
        downloadOptions={downloadOptions}
        iiifPresentationDownloadOptions={iiifPresentationDownloadOptions}
        parentManifest={parentManifest}
        lang={lang}
      />
      <IIIFViewerBackground>
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
          pageIndex={pageIndex}
          sierraId={sierraId}
          pageSize={pageSize}
          canvasIndex={canvasIndex}
          params={params}
        />
        {/* enhanced javascript viewer */}
        {enhanced && (
          // <IIIFViewer>
          //   <IIIFViewerMain fullWidth={true} aria-live="polite">
          //     <IIIFViewerImageWrapper aria-hidden={showThumbs}>
          //       {canvasOcr && <p className="visually-hidden">{canvasOcr}</p>}
          //       {iiifImageLocationUrl && imageUrl && (
          //         <ImageViewer
          //           infoUrl={iiifImageLocationUrl}
          //           id={imageUrl}
          //           width={800}
          //           lang={null}
          //           alt={
          //             (work && work.description) || (work && work.title) || ''
          //           }
          //           urlTemplate={urlTemplate}
          //           presentationOnly={Boolean(canvasOcr)}
          //         />
          //       )}
          //       {mainImageService['@id'] && currentCanvas && (
          //         <ImageViewer
          //           id="item-page"
          //           infoUrl={convertIiifUriToInfoUri(mainImageService['@id'])}
          //           width={currentCanvas.width}
          //           height={currentCanvas.height}
          //           lang={lang}
          //           alt={
          //             canvasOcr && work && work.title
          //               ? `image from ${work && work.title}`
          //               : ''
          //           }
          //           urlTemplate={urlTemplate}
          //           presentationOnly={Boolean(canvasOcr)}
          //         />
          //       )}
          //     </IIIFViewerImageWrapper>
          //     <IIIFViewerPaginatorButtons>
          //       <Space
          //         h={{ size: 'm', properties: ['margin-left', 'margin-right'] }}
          //         v={{ size: 'm', properties: ['margin-top'] }}
          //       >
          //         <Paginator
          //           {...mainPaginatorProps}
          //           render={PaginatorButtons(!showThumbs, workId)}
          //         />
          //       </Space>
          //     </IIIFViewerPaginatorButtons>
          //   </IIIFViewerMain>
          //   {thumbnailsRequired && (
          //     <ScrollingThumbnailContainer
          //       ref={thumbnailContainer}
          //       showThumbs={showThumbs}
          //       aria-hidden={!showThumbs}
          //     >
          //       {canvases &&
          //         canvases.map((canvas, i) => {
          //           const isActive = canvasIndex === i;
          //           return (
          //             <IIIFViewerThumb key={canvas['@id']} isActive={isActive}>
          //               <NextLink
          //                 {...itemUrl({
          //                   ...params,
          //                   workId,
          //                   page: pageIndex + 1,
          //                   sierraId,
          //                   langCode: lang,
          //                   canvas: i + 1,
          //                 })}
          //                 scroll={false}
          //                 replace
          //                 passHref
          //               >
          //                 <IIIFViewerThumbLink
          //                   tabIndex={showThumbs ? 0 : -1}
          //                   onClick={() => {
          //                     viewToggleRef &&
          //                       viewToggleRef.current &&
          //                       viewToggleRef.current.focus();
          //                     setShowThumbs(!showThumbs);
          //                   }}
          //                   ref={isActive ? activeThumbnailRef : undefined}
          //                 >
          //                   <IIIFCanvasThumbnail
          //                     canvas={canvas}
          //                     lang={lang}
          //                     isEnhanced={true}
          //                   />
          //                   <div>
          //                     <IIIFViewerThumbNumber isActive={isActive}>
          //                       <span className="visually-hidden">image </span>
          //                       {i + 1}
          //                     </IIIFViewerThumbNumber>
          //                   </div>
          //                 </IIIFViewerThumbLink>
          //               </NextLink>
          //             </IIIFViewerThumb>
          //           );
          //         })}
          //     </ScrollingThumbnailContainer>
          //   )}
          // </IIIFViewer>
          <>
            <ViewerLayout ref={viewerLayoutRef}>
              <GridViewer
                gridHeight={pageHeight}
                gridWidth={pageWidth}
                isVisible={showThumbs} // TODO rename for consitency
                mainViewerRef={mainViewerRef}
                setIsGridVisible={setShowThumbs} // TODO rename for consitency
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                canvases={canvases}
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
              <MainViewer
                listHeight={pageHeight}
                mainViewerRef={mainViewerRef}
                setActiveIndex={setActiveIndex}
                pageWidth={pageWidth}
                canvases={canvases}
                link={mainPaginatorProps.link}
              />
            </ViewerLayout>
          </>
        )}
      </IIIFViewerBackground>
    </>
  );
};

export default IIIFViewerComponent;
