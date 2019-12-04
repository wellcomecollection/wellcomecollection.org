// @flow
import { type IIIFCanvas, type IIIFManifest } from '@weco/common/model/iiif';
import fetch from 'isomorphic-unfetch';
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
import { itemUrl, workUrl } from '@weco/common/services/catalogue/urls';
import { clientSideSearchParams } from '@weco/common/services/catalogue/search-params';
import { classNames, font } from '@weco/common/utils/classnames';
import NextLink from 'next/link';
import Router from 'next/router';
import {
  convertIiifUriToInfoUri,
  iiifImageTemplate,
} from '@weco/common/utils/convert-image-uri';
import Paginator, {
  type PropsWithoutRenderFunction as PaginatorPropsWithoutRenderFunction,
} from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer';
import TruncatedText from '@weco/common/views/components/TruncatedText/TruncatedText';
import LL from '@weco/common/views/components/styled/LL';
import { trackEvent } from '@weco/common/utils/ga';
import Download from '@weco/catalogue/components/Download/ViewerDownload';
import ViewerExtraContent from '@weco/catalogue/components/Download/ViewerExtraContent';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space, { type SpaceComponentProps } from '../styled/Space';
import IIIFCanvasThumbnail from './parts/IIIFCanvasThumbnail';
import NoScriptViewer, {
  IIIFViewerPaginatorButtons,
  PaginatorButtons,
} from './parts/NoScriptViewer';
// import TopBar from '../styled/TopBar';

export const headerHeight = 149;

const TopBar = styled.div`
  position: relative;
  z-index: 2;
  background: ${props => lighten(0.14, props.theme.colors.viewerBlack)};
  color: ${props => props.theme.colors.white};
  .title {
    max-width: 30%;
    .icon {
      width: 48px;
    }
  }
  h1 {
    margin: 0;
  }
  .part {
    max-width: 100%;
    display: block;
    @media (min-width: ${props => props.theme.sizes.large}px) {
      display: none;
    }
  }
  .plain-link {
    max-width: 100%;
  }
  .icon__shape {
    fill: currentColor;
  }
  button {
    overflow: hidden;
    display: inline-block;
    .btn__text {
      position: absolute;
      right: 100%;
      @media (min-width: ${props => props.theme.sizes.large}px) {
        position: static;
      }
    }
  }
`;

const ViewAllContainer = styled.div.attrs(props => ({
  className: classNames({
    'flex flex--v-center flex--h-center': true,
  }),
}))`
  height: 64px;
  width: 15%;
  border-right: 1px solid
    ${props => lighten(0.1, props.theme.colors.viewerBlack)};
`;

const TitleContainer = styled.div.attrs(props => ({
  className: classNames({
    'flex flex--v-center': true,
    [font('hnl', 5)]: true,
  }),
}))`
  justify-content: space-between;
  height: 64px;
  width: ${props => (props.isEnhanced ? '85%' : '100%')};
  padding: ${props => `0 ${props.theme.spacingUnit * 2}px`};
`;

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

const ScrollingThumbnailContainer = styled.div`
  height: calc(100% - ${headerHeight}px);
  overflow: scroll;
  background: ${props => props.theme.colors.viewerBlack};
  position: fixed;
  top: ${props => (props.showThumbs ? `${headerHeight}px` : '100vh')};
  left: 0;
  transition: top 800ms ease;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  /* Makes sure trailing items in last row stay next to each other rather than being evenly spaced */
  &:after {
    content: '';
    flex: auto;
  }
`;

function scrollIntoViewIfOutOfView(container, index) {
  const itemToScroll = container.children.item(index);
  if (itemToScroll) {
    const inView = checkInView(container, itemToScroll);
    !inView && itemToScroll.scrollIntoView();
  }
}

function checkInView(container, element, includePartialView) {
  const containerTop = container.scrollTop;
  const containerBottom = containerTop + container.clientHeight;
  const elementTop = element.offsetTop;
  const elementBottom = elementTop + element.clientHeight;

  return elementTop >= containerTop && elementBottom <= containerBottom;
}

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
  const [parentManifest, setParentManifest] = useState(null);
  const [currentManifestLabel, setCurrentManifestLabel] = useState(null);
  const thumbnailContainer = useRef(null);
  const activeThumbnailRef = useRef(null);
  const viewToggleRef = useRef(null);
  const navigationCanvases =
    canvases &&
    [...Array(pageSize)]
      .map((_, i) => pageSize * pageIndex + i)
      .map(i => canvases[i])
      .filter(Boolean);

  const mainImageService = {
    '@id': currentCanvas ? currentCanvas.images[0].resource.service['@id'] : '',
  };

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
  const urlTemplate =
    (iiifImageLocation && iiifImageTemplate(iiifImageLocation.url)) ||
    (mainImageService['@id'] && iiifImageTemplate(mainImageService['@id']));

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
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setShowThumbs(Router.query.isOverview);
    setEnhanced(true);
  }, []);

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
      parentManifest.manifests.find(manifest => {
        return (
          (manifest['@id'].match(/iiif\/(.*)\/manifest/) || [])[1] === sierraId
        );
      });

    matchingManifest && setCurrentManifestLabel(matchingManifest.label);
  });

  useEffect(() => {
    thumbnailContainer.current &&
      scrollIntoViewIfOutOfView(thumbnailContainer.current, canvasIndex);
  }, [canvasIndex]);

  return (
    <>
      <TopBar className="flex">
        {enhanced && canvases && canvases.length > 1 && (
          <ViewAllContainer>
            <Button
              extraClasses="btn--primary-black"
              icon={showThumbs ? 'detailView' : 'gridView'}
              text={showThumbs ? 'Detail view' : 'View all'}
              fontFamily="hnl"
              clickHandler={() => {
                activeThumbnailRef &&
                  activeThumbnailRef.current &&
                  activeThumbnailRef.current.focus();
                setShowThumbs(!showThumbs);
                trackEvent({
                  category: 'Control',
                  action: `clicked work viewer ${
                    showThumbs ? '"Detail view"' : '"View all"'
                  } button`,
                  label: `${workId}`,
                });
              }}
              ref={viewToggleRef}
            />
          </ViewAllContainer>
        )}
        <TitleContainer isEnhanced={enhanced}>
          <div className="title">
            <span className="part">{currentManifestLabel}</span>
            <NextLink {...workUrl({ ...params, id: workId })}>
              <a
                className={classNames({
                  [font('hnm', 5)]: true,
                  flex: true,
                  'flex-v-center': true,
                  'plain-link': true,
                  'font-hover-yellow': true,
                })}
              >
                <Icon name="chevron" extraClasses="icon--90 icon--white" />
                <TruncatedText as="h1">{title}</TruncatedText>
              </a>
            </NextLink>
          </div>
          {canvases && canvases.length > 1 && (
            <>{`${canvasIndex + 1 || ''} / ${(canvases && canvases.length) ||
              ''}`}</>
          )}
          {enhanced && (
            <div className="flex flex--v-center">
              <Button
                extraClasses={classNames({
                  relative: true,
                  'btn--primary-black': true,
                })}
                icon="rotatePageRight"
                iconPosition="end"
                fontFamily="hnl"
                text="Rotate"
                textHidden={true}
                clickHandler={() => {
                  setRotation(rotation < 270 ? rotation + 90 : 0);
                }}
              />
              <Space
                h={{ size: 'm', properties: ['margin-left', 'margin-right'] }}
              >
                <Download
                  title={title}
                  workId={workId}
                  licenseInfo={licenseInfo || iiifPresentationLicenseInfo}
                  iiifImageLocationLicenseId={iiifImageLocationLicenseId}
                  iiifImageLocationCredit={iiifImageLocationCredit}
                  downloadOptions={
                    downloadOptions || iiifPresentationDownloadOptions
                  }
                />
              </Space>
              {parentManifest && parentManifest.manifests && (
                <ViewerExtraContent
                  buttonText={currentManifestLabel || 'Choose'}
                >
                  <ul className="no-margin no-padding plain-list">
                    {parentManifest.manifests.map((manifest, i) => (
                      <li
                        key={manifest['@id']}
                        className={
                          manifest.label === currentManifestLabel
                            ? 'current'
                            : null
                        }
                      >
                        <NextLink
                          {...itemUrl({
                            ...params,
                            workId,
                            page: 1,
                            sierraId: (manifest['@id'].match(
                              /iiif\/(.*)\/manifest/
                            ) || [])[1],
                            langCode: lang,
                            canvas: 0,
                          })}
                        >
                          <a>{manifest.label}</a>
                        </NextLink>
                      </li>
                    ))}
                  </ul>
                </ViewerExtraContent>
              )}
            </div>
          )}
        </TitleContainer>
      </TopBar>
      <IIIFViewerBackground>
        <LL lighten={true} />
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
        />
        {/* enhanced javascript viewer */}
        {enhanced && (
          <IIIFViewer rotation={rotation}>
            <IIIFViewerMain fullWidth={true} aria-live="polite">
              <IIIFViewerImageWrapper aria-hidden={showThumbs}>
                {canvasOcr && <p className="visually-hidden">{canvasOcr}</p>}
                {iiifImageLocationUrl && imageUrl && (
                  <ImageViewer
                    infoUrl={iiifImageLocationUrl}
                    id={imageUrl}
                    width={800}
                    lang={null}
                    alt={
                      (work && work.description) || (work && work.title) || ''
                    }
                    urlTemplate={urlTemplate}
                    presentationOnly={Boolean(canvasOcr)}
                    rotation={rotation}
                  />
                )}
                {mainImageService['@id'] && currentCanvas && (
                  <ImageViewer
                    id="item-page"
                    infoUrl={convertIiifUriToInfoUri(mainImageService['@id'])}
                    width={currentCanvas.width}
                    height={currentCanvas.height}
                    lang={lang}
                    alt={
                      canvasOcr && work && work.title
                        ? `image from ${work && work.title}`
                        : ''
                    }
                    urlTemplate={urlTemplate}
                    presentationOnly={Boolean(canvasOcr)}
                    rotation={rotation}
                  />
                )}
              </IIIFViewerImageWrapper>
              <IIIFViewerPaginatorButtons>
                <Paginator
                  {...mainPaginatorProps}
                  render={PaginatorButtons(!showThumbs, workId)}
                />
              </IIIFViewerPaginatorButtons>
            </IIIFViewerMain>
            {thumbnailsRequired && (
              <ScrollingThumbnailContainer
                ref={thumbnailContainer}
                showThumbs={showThumbs}
                aria-hidden={!showThumbs}
              >
                {canvases &&
                  canvases.map((canvas, i) => {
                    const isActive = canvasIndex === i;
                    return (
                      <IIIFViewerThumb key={canvas['@id']} isActive={isActive}>
                        <NextLink
                          {...itemUrl({
                            ...params,
                            workId,
                            page: pageIndex + 1,
                            sierraId,
                            langCode: lang,
                            canvas: i + 1,
                          })}
                          scroll={false}
                          replace
                          passHref
                        >
                          <IIIFViewerThumbLink
                            tabIndex={showThumbs ? 0 : -1}
                            onClick={() => {
                              viewToggleRef &&
                                viewToggleRef.current &&
                                viewToggleRef.current.focus();
                              setShowThumbs(!showThumbs);
                            }}
                            ref={isActive ? activeThumbnailRef : undefined}
                          >
                            <IIIFCanvasThumbnail
                              canvas={canvas}
                              lang={lang}
                              isEnhanced={true}
                            />
                            <div>
                              <IIIFViewerThumbNumber isActive={isActive}>
                                <span className="visually-hidden">image </span>
                                {i + 1}
                              </IIIFViewerThumbNumber>
                            </div>
                          </IIIFViewerThumbLink>
                        </NextLink>
                      </IIIFViewerThumb>
                    );
                  })}
              </ScrollingThumbnailContainer>
            )}
          </IIIFViewer>
        )}
      </IIIFViewerBackground>
    </>
  );
};

export default IIIFViewerComponent;
