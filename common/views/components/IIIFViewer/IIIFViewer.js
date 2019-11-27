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
import {
  convertIiifUriToInfoUri,
  iiifImageTemplate,
} from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '../../../utils/image-sizes';
import Paginator, {
  type PaginatorRenderFunctionProps,
  type PropsWithoutRenderFunction as PaginatorPropsWithoutRenderFunction,
} from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer';
import TruncatedText from '@weco/common/views/components/TruncatedText/TruncatedText';
import LL from '@weco/common/views/components/styled/LL';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import { trackEvent } from '@weco/common/utils/ga';
import Download from '@weco/catalogue/components/Download/ViewerDownload';
import ViewerExtraContent from '@weco/catalogue/components/Download/ViewerExtraContent';
import Router from 'next/router';
import Space, { type SpaceComponentProps } from '../styled/Space';

const headerHeight = 149;

const TitleContainer = styled.div.attrs(props => ({
  className: classNames({
    'flex flex--v-center': true,
    [font('hnl', 5)]: true,
  }),
}))`
  justify-content: space-between;
  height: 64px;
  background: ${props => lighten(0.14, props.theme.colors.viewerBlack)};
  color: ${props => props.theme.colors.smoke};
  padding: ${props => `0 ${props.theme.spacingUnit * 2}px`};
  @media (min-width: ${props => props.theme.sizes.large}px) {
    padding: ${props => `0 ${props.theme.spacingUnit * 4}px`};
  }
  h1 {
    margin: 0;
  }
  .title {
    max-width: 30%;
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
  }
  button {
    overflow: hidden;
    display: inline-block;
    .icon {
      margin: 0;
      @media (min-width: ${props => props.theme.sizes.large}px) {
        margin-right: ${props => `${props.theme.spacingUnit}px`};
      }
    }
    .btn__text {
      position: absolute;
      right: 100%;
      @media (min-width: ${props => props.theme.sizes.large}px) {
        position: static;
      }
    }
    @media (min-width: ${props => props.theme.sizes.large}px) {
      width: 130px;
    }
  }
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

const IIIFViewerImageWrapper = styled.div.attrs(props => ({
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

const IIIFViewer = styled.div.attrs(props => ({
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

const IIIFViewerMain: ComponentType<SpaceComponentProps> = styled(Space).attrs(
  props => ({
    className: classNames({
      'relative bg-viewerBlack font-white': true,
    }),
  })
)`
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

const IIIFViewerThumb = styled.div`
  width: 130px;
  margin-left: 12px;
  margin-right: 12px;

  ${props => props.theme.media.medium`
    margin-left: 24px;
    margin-right: 24px;
  `}

  ${props => props.theme.media.large`
    margin-left: 36px;
    margin-right: 36px;
  `}

  a {
    text-decoration: none;
  }

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

const IIIFViewerThumbLink = styled.a.attrs(props => ({
  className: classNames({
    'block h-center': true,
  }),
}))`
  height: 100%;
  text-align: center;
  display: block;
  padding-top: 6px;
  padding-bottom: 36px;
`;

const IIIFViewerThumbNumber = styled.span.attrs(props => ({
  className: classNames({
    'line-height-1': true,
    'inline-block': true,
    'font-white': !props.isActive,
    'font-black': props.isActive,
    'bg-yellow': props.isActive,
    [font('hnl', 5)]: true,
  }),
}))`
  margin-top: 12px;
  padding: 3px 2px;
`;

const StaticThumbnailsContainer = styled.div.attrs(props => ({
  className: classNames({
    'bg-charcoal flex relative': true,
  }),
}))`
  width: 100%;
  height: 20%;
  border-top: 1px solid ${props => props.theme.colors.pewter};
  padding-left: 20%;
  @media (min-width: ${props => props.theme.sizes.medium}px) {
    padding-left: 0;
    flex-direction: column;
    height: 100%;
    width: 25%;
    border-top: none;
    border-right: 1px solid ${props => props.theme.colors.pewter};
  }
  a {
    display: block;
  }
  noscript img {
    margin: auto;
    width: auto;
    max-height: calc(100% - 1.5rem);
  }
`;

const ScrollingThumbnailContainer = styled.div`
  height: calc(100% - ${headerHeight}px);
  overflow: scroll;
  background: ${props => props.theme.colors.charcoal};
  padding: ${props => props.theme.spacingUnit}px;
  position: fixed;
  top: ${props => (props.showThumbs ? `${headerHeight}px` : '100vh')};
  left: 0;
  transition: top 800ms ease;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;
  align-content: flex-start;

  /* Makes sure trailing items in last row stay next to each other rather than being evenly spaced */
  &:after {
    content: '';
    flex: auto;
  }
`;

const IIIFViewerPaginatorButtons = styled.div.attrs(props => ({
  className: classNames({
    absolute: true,
  }),
}))`
  left: 12px;
  top: 12px;
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

type IIIFCanvasThumbnailProps = {|
  canvas: IIIFCanvas,
  lang: string,
  isEnhanced: boolean,
|};

const IIIFCanvasThumbnail = ({
  canvas,
  lang,
  isEnhanced,
}: IIIFCanvasThumbnailProps) => {
  const thumbnailService = canvas.thumbnail.service;
  const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
  const smallestWidthImageDimensions = thumbnailService.sizes
    .sort((a, b) => a.width - b.width)
    .find(dimensions => dimensions.width > 100);
  return (
    <>
      {isEnhanced ? (
        <div
          style={{
            position: 'relative',
            paddingTop: smallestWidthImageDimensions
              ? `${(smallestWidthImageDimensions.height /
                  smallestWidthImageDimensions.width) *
                  100}%`
              : 0,
          }}
        >
          <LL small={true} />
          <div
            style={{
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <IIIFResponsiveImage
              width={
                smallestWidthImageDimensions
                  ? smallestWidthImageDimensions.width
                  : 30
              }
              src={urlTemplate({
                size: `${
                  smallestWidthImageDimensions
                    ? smallestWidthImageDimensions.width
                    : '!100'
                },`,
              })}
              srcSet={''}
              sizes={`${
                smallestWidthImageDimensions
                  ? smallestWidthImageDimensions.width
                  : 30
              }px`}
              alt={''}
              lang={lang}
              isLazy={true}
            />
          </div>
        </div>
      ) : (
        <IIIFResponsiveImage
          width={
            smallestWidthImageDimensions
              ? smallestWidthImageDimensions.width
              : 30
          }
          src={urlTemplate({
            size: `${
              smallestWidthImageDimensions
                ? smallestWidthImageDimensions.width
                : '!100'
            },`,
          })}
          srcSet={''}
          sizes={`${
            smallestWidthImageDimensions
              ? smallestWidthImageDimensions.width
              : 30
          }px`}
          alt={''}
          lang={lang}
          isLazy={false}
        />
      )}
    </>
  );
};

/* eslint-disable react/display-name */
const PaginatorButtons = (isTabbable: boolean, workId: string) => {
  return ({
    currentPage,
    totalPages,
    prevLink,
    nextLink,
  }: PaginatorRenderFunctionProps) => {
    return (
      <div
        className={classNames({
          'flex flex--column flex--v-center flex--h-center': true,
        })}
      >
        {prevLink && (
          <Control
            scroll={false}
            replace={true}
            link={prevLink}
            type="on-black"
            icon="arrow"
            text="Previous page"
            tabIndex={isTabbable ? '0' : '-1'}
            extraClasses={classNames({
              'icon--270': true,
            })}
            clickHandler={() => {
              trackEvent({
                category: 'Control',
                action: 'clicked work viewer previous page link',
                label: `${workId} | page: ${currentPage}`,
              });
            }}
          />
        )}
        {nextLink && (
          <Control
            scroll={false}
            replace={true}
            link={nextLink}
            type="on-black"
            icon="arrow"
            text="Next page"
            tabIndex={isTabbable ? '0' : '-1'}
            extraClasses={classNames({
              icon: true,
              'icon--90': true,
            })}
            clickHandler={() => {
              trackEvent({
                category: 'Control',
                action: 'clicked work viewer next page link',
                label: `${workId} | page: ${currentPage}`,
              });
            }}
          />
        )}
      </div>
    );
  };
};
/* eslint-enable react/display-name */

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
  const srcSet =
    urlTemplate &&
    imageSizes(2048)
      .map(width => {
        return `${urlTemplate({ size: `${width},` })} ${width}w`;
      })
      .join(',');
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
      <TitleContainer>
        <div className="title">
          <span className="part">{currentManifestLabel}</span>
          <NextLink {...workUrl({ ...params, id: workId })}>
            <a
              className={classNames({
                [font('hnm', 5)]: true,
                'flex-inline': true,
                'flex-v-center': true,
                'plain-link': true,
                'font-hover-yellow': true,
              })}
            >
              <TruncatedText as="h1">{title}</TruncatedText>
            </a>
          </NextLink>
        </div>
        {canvases && canvases.length > 1 && (
          <>{`${canvasIndex + 1 || ''} / ${(canvases && canvases.length) ||
            ''}`}</>
        )}
        {enhanced && (
          <div>
            {canvases && canvases.length > 1 && (
              <Button
                type="tertiary"
                extraClasses="btn--primary-black btn--small"
                icon={showThumbs ? 'detailView' : 'gridView'}
                text={showThumbs ? 'Detail view' : 'View all'}
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
            )}
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
            {parentManifest && parentManifest.manifests && (
              <ViewerExtraContent buttonText={currentManifestLabel || 'Choose'}>
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
      <IIIFViewerBackground>
        <LL />
        {/* conditionally show this */}
        {
          <noscript>
            <IIIFViewer>
              <IIIFViewerMain
                h={{ size: 's', properties: ['padding-left', 'padding-right'] }}
                fullWidth={!thumbnailsRequired}
              >
                <IIIFViewerImageWrapper>
                  {iiifImageLocationUrl && imageUrl && (
                    <IIIFResponsiveImage
                      width={800}
                      src={imageUrl}
                      srcSet={srcSet}
                      sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`}
                      extraClasses={classNames({
                        'block h-center': true,
                      })}
                      lang={lang}
                      alt={
                        (canvasOcr && canvasOcr.replace(/"/g, '')) ||
                        'no text alternative'
                      }
                      isLazy={false}
                    />
                  )}
                  {mainImageService['@id'] && currentCanvas && (
                    <IIIFResponsiveImage
                      width={800}
                      src={urlTemplate && urlTemplate({ size: '800,' })}
                      srcSet={srcSet}
                      sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`}
                      extraClasses={classNames({
                        'block h-center': true,
                      })}
                      lang={lang}
                      alt={
                        (canvasOcr && canvasOcr.replace(/"/g, '')) ||
                        'no text alternative'
                      }
                      isLazy={false}
                    />
                  )}
                </IIIFViewerImageWrapper>
                <IIIFViewerPaginatorButtons>
                  <Paginator
                    {...mainPaginatorProps}
                    render={PaginatorButtons(true, workId)}
                  />
                </IIIFViewerPaginatorButtons>
              </IIIFViewerMain>

              {thumbnailsRequired && (
                <StaticThumbnailsContainer>
                  {navigationCanvases &&
                    navigationCanvases.map((canvas, i) => (
                      <IIIFViewerThumb key={canvas['@id']}>
                        <Paginator
                          {...thumbsPaginatorProps}
                          render={({ rangeStart }) => (
                            <NextLink
                              {...itemUrl({
                                ...params,
                                workId,
                                page: pageIndex + 1,
                                sierraId,
                                langCode: lang,
                                canvas: pageSize * pageIndex + (i + 1),
                              })}
                              scroll={false}
                              replace
                              passHref
                            >
                              <IIIFViewerThumbLink>
                                <IIIFCanvasThumbnail
                                  isEnhanced={false}
                                  canvas={canvas}
                                  lang={lang}
                                />
                                <div>
                                  <IIIFViewerThumbNumber
                                    isActive={
                                      canvasIndex === rangeStart + i - 1
                                    }
                                  >
                                    <span className="visually-hidden">
                                      image{' '}
                                    </span>
                                    {rangeStart + i}
                                  </IIIFViewerThumbNumber>
                                </div>
                              </IIIFViewerThumbLink>
                            </NextLink>
                          )}
                        />
                      </IIIFViewerThumb>
                    ))}
                  <IIIFViewerPaginatorButtons isThumbs={true}>
                    <Paginator
                      {...thumbsPaginatorProps}
                      render={PaginatorButtons(true, workId)}
                    />
                  </IIIFViewerPaginatorButtons>
                </StaticThumbnailsContainer>
              )}
            </IIIFViewer>
          </noscript>
        }
        {/* enhanced javascript viewer */}
        {enhanced && (
          <IIIFViewer>
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
                    tabbableControls={!showThumbs || !thumbnailsRequired}
                    urlTemplate={urlTemplate}
                    presentationOnly={Boolean(canvasOcr)}
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
                    tabbableControls={!showThumbs || !thumbnailsRequired}
                    urlTemplate={urlTemplate}
                    presentationOnly={Boolean(canvasOcr)}
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
                      <IIIFViewerThumb key={canvas['@id']}>
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
