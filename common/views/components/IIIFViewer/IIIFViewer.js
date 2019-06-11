// @flow
import { type IIIFCanvas } from '@weco/common/model/iiif';
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
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
  button {
    overflow: hidden;
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
    'relative flex flex--v-center': false,
    [spacing({ s: 2 }, { padding: ['bottom'] })]: false,
  }),
}))`
  width: 100px;
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
  }
`;

const IIIFViewerThumbLink = styled.a.attrs(props => ({
  className: classNames({
    'block h-center': true,
    [spacing({ s: 1 }, { padding: ['top', 'bottom', 'left', 'right'] })]: true,
  }),
}))`
  height: 100%;
  text-align: center;
  display: block;
`;

const IIIFViewerThumbNumber = styled.span.attrs(props => ({
  className: classNames({
    'line-height-1': true,
    'font-white': !props.isActive,
    'font-black': props.isActive,
    'bg-yellow': props.isActive,
    [font({ s: 'LR3' })]: true,
  }),
}))`
  padding: 3px 2px 0;
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
  right: ${props => props.theme.spacingUnit * 2}px;
  bottom: ${props =>
    !props.isThumbs ? `${props.theme.spacingUnit * 2}px` : 0};
  top: ${props => props.isThumbs && `${props.theme.spacingUnit}px`};

  ${props =>
    props.isThumbs &&
    `
    @media (min-width: ${props.theme.sizes.medium}px) {
      top: auto;
    bottom: ${props.theme.spacingUnit}px;
    right: auto;
    left: 50%;
    transform: translateX(-50%);
    div {
      flex-direction: row;
      .control {
        margin: 0;
      }
    }
    }
  `}
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
          <div style={{ display: 'block', position: 'absolute', top: 0 }}>
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

const PaginatorButtons = ({
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
          extraClasses={classNames({
            'icon--270': true,
            [spacing({ s: 1 }, { margin: ['bottom'] })]: true,
          })}
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
          extraClasses={classNames({
            icon: true,
            'icon--90': true,
          })}
        />
      )}
    </div>
  );
};

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
}: IIIFViewerProps) => {
  const [showThumbs, setShowThumbs] = useState(true);
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

  useEffect(() => {
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
          <>
            {`${canvasIndex + 1 || ''} / ${(canvases && canvases.length) ||
              ''}`}

            {enhanced && (
              <Button
                type="tertiary"
                extraClasses="btn--tertiary-black"
                icon={showThumbs ? 'detailView' : 'gridView'}
                text={showThumbs ? 'Detail view' : 'View all'}
                clickHandler={() => {
                  activeThumbnailRef &&
                    activeThumbnailRef.current &&
                    activeThumbnailRef.current.focus();
                  setShowThumbs(!showThumbs);
                }}
                ref={viewToggleRef}
              />
            )}
          </>
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
                <Paginator {...mainPaginatorProps} render={PaginatorButtons} />
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
                    render={PaginatorButtons}
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
                    tabbableControls={!showThumbs}
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
                    tabbableControls={!showThumbs}
                  />
                )}
              </IIIFViewerImageWrapper>
              <IIIFViewerPaginatorButtons>
                <Paginator {...mainPaginatorProps} render={PaginatorButtons} />
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
