// @flow
import { type IIIFCanvas, type IIIFManifest } from '@weco/common/model/iiif';
import {
  type Work,
  type CatalogueApiError,
} from '@weco/common/model/catalogue';
import {
  getDownloadOptionsFromImageUrl,
  getDownloadOptionsFromManifest,
} from '@weco/common/utils/works';
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import getLicenseInfo from '@weco/common/utils/get-license-info';
import { itemUrl, workUrl } from '@weco/common/services/catalogue/urls';
import { classNames, spacing, font } from '@weco/common/utils/classnames';
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
import Router from 'next/router';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';

const TitleContainer = styled.div.attrs(props => ({
  className: classNames({
    'flex flex--v-center': true,
    [font({ s: 'HNL5' })]: true,
  }),
}))`
  justify-content: space-between;
  height: 64px;
  background: ${props => props.theme.colors.coal};
  color: ${props => props.theme.colors.smoke};
  padding: ${props => `0 ${props.theme.spacingUnit * 2}px`};
  @media (min-width: ${props => props.theme.sizes.large}px) {
    padding: ${props => `0 ${props.theme.spacingUnit * 4}px`};
  }
  h1 {
    margin: 0;
  }
  a {
    max-width: 30%;
  }
  button {
    overflow: hidden;
    display: inline-block;
    .icon {
      margin: 0;
      @media (min-width: ${props => props.theme.sizes.medium}px) {
        margin-right: ${props => `${props.theme.spacingUnit}px`};
      }
    }
    .btn__text {
      position: absolute;
      right: 100%;
      @media (min-width: ${props => props.theme.sizes.medium}px) {
        position: static;
      }
    }
    @media (min-width: ${props => props.theme.sizes.medium}px) {
      width: 130px;
    }
  }
`;

const IIIFViewerBackground = styled.div`
  background: ${props => props.theme.colors.charcoal};
  height: calc(100vh - 149px);
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
  position: ${props => props.isFixed && 'fixed'};
  top: ${props => props.isFixed && '149px'};
  height: calc(
    100% - 149px
  ); /* using 100vh causes problems with browser chrome on mobile */
  width: 100vw;
  flex-direction: row-reverse;

  noscript & {
    height: calc(100vh - 149px);
  }

  noscript & img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
`;

const IIIFViewerMain = styled.div.attrs(props => ({
  className: classNames({
    'relative bg-charcoal font-white': true,
    [spacing({ s: 4 }, { padding: ['top'] })]: true,
    [spacing({ s: 1 }, { padding: ['right', 'left'] })]: true,
    [spacing({ s: 10 }, { padding: ['bottom'] })]: true,
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

const IIIFViewerThumb = styled.div.attrs(props => ({
  className: classNames({
    [spacing({ s: 2, m: 4, l: 6 }, { margin: ['left', 'right'] })]: true,
  }),
}))`
  width: 130px;
  noscript & {
    height: 100%;
    width: 20%;

    @media (min-width: ${props => props.theme.sizes.medium}px) {
      height: 25%;
      width: 100%;
      margin-right: 0;
    }
  }

  a {
    text-decoration: none;
  }

  img {
    display: block;
    width: 100%;
  }
`;

const IIIFViewerThumbLink = styled.a.attrs(props => ({
  className: classNames({
    'block h-center': true,
    [spacing({ s: 1 }, { margin: ['top'] })]: true,
    [spacing({ s: 6 }, { margin: ['bottom'] })]: true,
  }),
}))`
  height: 100%;
  text-align: center;
  display: block;
`;

const IIIFViewerThumbNumber = styled.span.attrs(props => ({
  className: classNames({
    'line-height-1': true,
    'inline-block': true,
    'font-white': !props.isActive,
    'font-black': props.isActive,
    'bg-yellow': props.isActive,
    [font({ s: 'HNL4' })]: true,
    [spacing({ s: 2 }, { margin: ['top'] })]: true,
  }),
}))`
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
  @media (min-width: ${props => props.theme.sizes.medium}px) {
    flex-direction: column;
    height: 100%;
    width: 25%;
    border-top: none;
    border-right: 1px solid ${props => props.theme.colors.pewter};
    padding: 0 0 ${props => props.theme.spacingUnit * 10}px;
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
  height: 100%;
  width: 100%;
  overflow: scroll;
  position: absolute;
  background: ${props => props.theme.colors.charcoal};
  padding: ${props => props.theme.spacingUnit}px;
  transform: ${props =>
    props.showThumbs ? 'translateY(0%)' : 'translateY(100%)'};
  transition: transform 800ms ease;
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
  right: ${props => (props.isGroupedWithControls ? undefined : '12px')};
  left: ${props => (props.isGroupedWithControls ? '12px' : undefined)};
  bottom: ${props => (props.isGroupedWithControls ? undefined : '12px')};
  top: ${props => (props.isGroupedWithControls ? '12px' : undefined)};
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
          isLazy={true}
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
  query: ?string,
  workType: ?(string[]),
  itemsLocationsLocationType: ?(string[]),
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
  query,
  workType,
  itemsLocationsLocationType,
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

  const urlTemplate =
    mainImageService['@id'] && iiifImageTemplate(mainImageService['@id']);
  const srcSet =
    urlTemplate &&
    imageSizes(2048)
      .map(width => {
        return `${urlTemplate({ size: `${width},` })} ${width}w`;
      })
      .join(',');
  const thumbnailsRequired =
    navigationCanvases && navigationCanvases.length > 1;

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
  useEffect(() => {
    setShowThumbs(Router.query.isOverview);
    setEnhanced(true);
  }, []);

  useEffect(() => {
    thumbnailContainer.current &&
      scrollIntoViewIfOutOfView(thumbnailContainer.current, canvasIndex);
  }, [canvasIndex]);

  return (
    <>
      <TitleContainer>
        <NextLink
          {...workUrl({
            id: workId,
          })}
        >
          <a
            className={classNames({
              [font({ s: 'HNM5', m: 'HNM4' })]: true,
              'flex-inline': true,
              'flex-v-center': true,
              'plain-link': true,
              'font-hover-yellow': true,
            })}
          >
            <TruncatedText as="h1">{title}</TruncatedText>
          </a>
        </NextLink>
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
          </div>
        )}
      </TitleContainer>
      <IIIFViewerBackground>
        <LL />
        <noscript>
          <IIIFViewer>
            <IIIFViewerMain fullWidth={!thumbnailsRequired}>
              <IIIFViewerImageWrapper>
                {iiifImageLocationUrl && imageUrl && (
                  <IIIFResponsiveImage
                    width={800}
                    src={imageUrl}
                    srcSet={srcSet}
                    sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`}
                    extraClasses={classNames({
                      'block h-center': true,
                      [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
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
                      [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
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
                                  isActive={canvasIndex === rangeStart + i - 1}
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

        {/* enhanced javascript viewer */}
        {enhanced && (
          <IIIFViewer isFixed={true}>
            <IIIFViewerMain fullWidth={true} aria-live="polite">
              <IIIFViewerImageWrapper aria-hidden={showThumbs}>
                {canvasOcr && <p className="visually-hidden">{canvasOcr}</p>}
                {iiifImageLocationUrl && imageUrl && (
                  <ImageViewer
                    infoUrl={iiifImageLocationUrl}
                    src={imageUrl}
                    id={imageUrl}
                    width={800}
                    srcSet={''}
                    lang={null}
                    tabbableControls={!showThumbs || !thumbnailsRequired}
                  />
                )}
                {mainImageService['@id'] && currentCanvas && (
                  <ImageViewer
                    id="item-page"
                    infoUrl={convertIiifUriToInfoUri(mainImageService['@id'])}
                    src={urlTemplate && urlTemplate({ size: '640,' })}
                    srcSet={srcSet}
                    width={currentCanvas.width}
                    height={currentCanvas.height}
                    lang={lang}
                    tabbableControls={!showThumbs || !thumbnailsRequired}
                  />
                )}
              </IIIFViewerImageWrapper>
              <TogglesContext.Consumer>
                {({ groupImageControlsWithPagination }) => (
                  <IIIFViewerPaginatorButtons
                    isGroupedWithControls={groupImageControlsWithPagination}
                  >
                    <Paginator
                      {...mainPaginatorProps}
                      render={PaginatorButtons(!showThumbs, workId)}
                    />
                  </IIIFViewerPaginatorButtons>
                )}
              </TogglesContext.Consumer>
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
