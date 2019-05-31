// @flow
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import Raven from 'raven-js';
import { classNames, spacing, font } from '@weco/common/utils/classnames';
import NextLink from 'next/link';
import { itemUrl } from '@weco/common/services/catalogue/urls';
import { type IIIFCanvas } from '@weco/common/model/iiif';
import Paginator, {
  type PaginatorRenderFunctionProps,
  type PropsWithoutRenderFunction as PaginatorPropsWithoutRenderFunction,
} from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer';
import {
  convertIiifUriToInfoUri,
  iiifImageTemplate,
} from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '../../../utils/image-sizes';

const IIIFViewerPaginatorButtons = styled.div.attrs(props => ({
  className: classNames({
    'flex absolute flex--h-center': true,
  }),
}))`
  right: ${props => props.theme.spacingUnit}px;
  bottom: ${props => (props.isThumbs ? '50%' : props.theme.spacingUnit + 'px')};
  transform: ${props => (props.isThumbs ? 'translateY(50%)' : null)};

  ${props =>
    props.isThumbs &&
    `
    @media (min-width: ${props.theme.sizes.medium}px) {
      bottom: ${props.theme.spacingUnit}px;
      left: 50%;
      transform: translateX(-50%) translateY(0%);

      .control__inner {
        transform: rotate(90deg);
      }
    }
  `}
`;

const IIIFViewerThumbNumber = styled.span.attrs(props => ({
  className: classNames({
    'line-height-1': true,
    'absolute bg-charcoal font-white': true,
    [font({ s: 'LR3' })]: true,
  }),
}))`
  top: ${props => props.theme.spacingUnit}px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 2px 0;
  z-index: 1;
`;

const IIIFViewerThumb = styled.div.attrs(props => ({
  // className: classNames({
  //   'relative flex flex--v-center': true,
  //   [spacing({ s: 1 }, { padding: ['top', 'right', 'bottom', 'left'] })]: true,
  // }),
}))`
  /* height: 100%;
  width: 20%;
  margin-right: ${props => props.theme.spacingUnit}px;

  &:last-child {
    margin: 0;
  }

  @media (min-width: ${props => props.theme.sizes.medium}px) {
    height: 25%;
    width: 100%;
    margin-right: 0;
  }*/
  width: 100px;
  height: 200px;
  float: left;
  img {
    display: block;
    margin: auto;
    max-height: 100%;
    max-width: 100%;
    width auto;
  }
`;
// TODO no js styling
const IIIFViewerThumbs = styled.div.attrs(props => ({
  // className: classNames({
  //   'flex flex--h-center relative bg-smoke': true,
  // }),
}))`
  /* height: 20%;
  width: 100%;
  padding: 0 100px 0 0; */

  /* @media (min-width: ${props => props.theme.sizes.medium}px) {
    height: 100%;
    flex-direction: column;
    width: 25%;
    padding: 0 0 ${props => props.theme.spacingUnit * 10}px;
  } */
  width: 100px;
  height: 100px;
  float: left;
`;

const IIIFViewerMain = styled.div.attrs(props => ({
  className: classNames({
    'relative bg-charcoal font-white': true,
    [spacing({ s: 4 }, { padding: ['top'] })]: true,
    [spacing({ s: 1 }, { padding: ['right', 'left'] })]: true,
    [spacing({ s: 10 }, { padding: ['bottom'] })]: true,
  }),
}))`
  height: 80%;
  width: 100%;

  @media (min-width: ${props => props.theme.sizes.medium}px) {
    height: 100%;
    width: ${props => (props.hasThumbs && !props.isEnhanced ? '75%' : '100%')};
  }
`;

const IIIFViewerXOfY = styled.span.attrs(props => ({
  className: classNames({
    'absolute font-white': true,
    [spacing({ s: 1 }, { margin: ['left', 'right'] })]: true,
    [font({ s: 'LR3' })]: true,
  }),
}))`
  top: ${props => props.theme.spacingUnit}px;
  left: 50%;
  transform: translateX(-50%);
`;

const IIIFViewerThumbLink = styled.a.attrs(props => ({
  className: classNames({
    'block h-center': true,
  }),
}))`
  height: 100%;

  .lazyload {
    display: block;
  }
  .lazyloaded {
    border: 3px solid
      ${props => (props.isActive ? props.theme.colors.white : 'transparent')};
    transition: border-color 200ms ease;
  }
`;
// TODO enhanced only fixed position and correct heights
const IIIFViewer = styled.div.attrs(props => ({
  className: classNames({
    'flex flex--wrap': true,
  }),
}))`
  position: fixed;
  top: 100px;
  height: calc(100vh - 100px);
  width: 100vw;
  flex-direction: row-reverse;

  .image-viewer__image img {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    overflow: scroll;
  }
`;

const IIIFViewerImageWrapper = styled.div.attrs(props => ({
  className: classNames({
    absolute: true,
  }),
}))`
  top: 30px;
  right: 0;
  bottom: 60px;
  left: 0;
  /* position: fixed;
  top: 100px;
  height: calc(100vh - 100px); */
`;

function scrollIntoViewIfOutOfView(container, index) {
  const itemToScroll = container.children.item(index);
  if (itemToScroll) {
    const inView = checkInView(container, itemToScroll, true);
    !inView && itemToScroll.scrollIntoView();
  }
}

function checkInView(container, element, includePartialView) {
  const containerTop = container.scrollTop;
  const containerBottom = containerTop + container.clientHeight;
  const elementTop = element.offsetTop;
  const elementBottom = elementTop + element.clientHeight;

  const completelyInView =
    elementTop >= containerTop && elementBottom <= containerBottom;
  let partiallyInView =
    includePartialView &&
    ((elementTop < containerTop && elementBottom > containerTop) ||
      (elementBottom > containerBottom && elementTop < containerBottom));

  return completelyInView || partiallyInView;
}

type IIIFCanvasThumbnailProps = {|
  canvas: IIIFCanvas,
  lang: string,
|};

const IIIFCanvasThumbnail = ({ canvas, lang }: IIIFCanvasThumbnailProps) => {
  const thumbnailService = canvas.thumbnail.service;
  const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
  const smallestWidthImageDimensions = thumbnailService.sizes
    .sort((a, b) => a.width - b.width)
    .find(dimensions => dimensions.width > 100);
  return (
    <>
      <img
        lang={lang}
        width={
          smallestWidthImageDimensions && smallestWidthImageDimensions.width
        }
        height={
          smallestWidthImageDimensions && smallestWidthImageDimensions.height
        }
        className={classNames({
          image: true,
          lazyload: true,
        })}
        onError={event =>
          Raven.captureException(new Error('IIIF image loading error'), {
            tags: {
              service: 'dlcs',
            },
          })
        }
        data-src={urlTemplate({
          size: `${
            smallestWidthImageDimensions
              ? smallestWidthImageDimensions.width
              : '!100'
          },`,
        })}
        alt={''}
      />
      <noscript>
        <img
          width={
            smallestWidthImageDimensions && smallestWidthImageDimensions.width
          }
          height={
            smallestWidthImageDimensions && smallestWidthImageDimensions.height
          }
          className={'image image--noscript'}
          src={urlTemplate({
            size: `${
              smallestWidthImageDimensions
                ? smallestWidthImageDimensions.width
                : '!100'
            },`,
          })}
          alt={''}
        />
      </noscript>
    </>
  );
};

const XOfY = ({ currentPage, totalPages }: PaginatorRenderFunctionProps) => (
  <IIIFViewerXOfY>
    {currentPage} of {totalPages}
  </IIIFViewerXOfY>
);

const PaginatorButtons = ({
  currentPage,
  totalPages,
  prevLink,
  nextLink,
}: PaginatorRenderFunctionProps) => {
  return (
    <div
      className={classNames({
        'flex flex--v-center flex--h-center': true,
      })}
    >
      {prevLink && (
        <Control
          scroll={false}
          replace={true}
          link={prevLink}
          type="light"
          icon="arrow"
          text="Previous page"
          extraClasses={classNames({
            [spacing({ s: 1 }, { margin: ['right'] })]: true,
            'icon--180': true,
          })}
        />
      )}
      {nextLink && (
        <Control
          scroll={false}
          replace={true}
          link={nextLink}
          type="light"
          icon="arrow"
          text="Next page"
          extraClasses={classNames({
            icon: true,
          })}
        />
      )}
    </div>
  );
};

type IIIFViewerProps = {|
  mainPaginatorProps: PaginatorPropsWithoutRenderFunction,
  thumbsPaginatorProps: PaginatorPropsWithoutRenderFunction,
  currentCanvas: ?IIIFCanvas,
  lang: string,
  canvasOcr: ?string,
  canvases: ?[],
  navigationCanvases: ?(IIIFCanvas[]),
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
  mainPaginatorProps,
  thumbsPaginatorProps,
  currentCanvas,
  lang,
  canvasOcr,
  canvases,
  navigationCanvases,
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
  const thumbContainer = useRef(null);

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
  const showThumbnails = navigationCanvases && navigationCanvases.length > 0;

  useEffect(() => {
    setEnhanced(true);
  }, []);

  useEffect(() => {
    thumbContainer.current &&
      scrollIntoViewIfOutOfView(thumbContainer.current, canvasIndex);
  });

  return (
    <IIIFViewer>
      <button
        style={{ position: 'absolute', top: '-50px' }}
        onClick={() => {
          setShowThumbs(!showThumbs);
        }}
      >
        toggle thumbs
      </button>
      <IIIFViewerMain hasThumbs={showThumbnails} isEnhanced={enhanced}>
        <Paginator {...mainPaginatorProps} render={XOfY} />
        <IIIFViewerImageWrapper>
          {iiifImageLocationUrl && imageUrl && (
            <ImageViewer
              infoUrl={iiifImageLocationUrl}
              src={imageUrl}
              id={imageUrl}
              width={800}
              srcSet={''}
              canvasOcr={null}
              lang={null}
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
              canvasOcr={canvasOcr}
              lang={lang}
            />
          )}
        </IIIFViewerImageWrapper>
        <IIIFViewerPaginatorButtons>
          <Paginator {...mainPaginatorProps} render={PaginatorButtons} />
        </IIIFViewerPaginatorButtons>
      </IIIFViewerMain>
      {/* TODO use styled component */}
      {enhanced && (
        <div
          style={{
            height: 'calc(100vh - 100px)',
            width: '100%',
            overflow: 'scroll',
            position: 'fixed',
            top: '100px',
            background: '#111111',
            transform: showThumbs ? 'translateY(0%)' : 'translateY(100%)',
            transition: 'transform 800ms ease',
            zIndex: 1,
          }}
          ref={thumbContainer}
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
                      isActive={isActive}
                      onClick={() => {
                        setShowThumbs(!showThumbs);
                      }}
                    >
                      <IIIFViewerThumbNumber>
                        <span className="visually-hidden">image </span>
                        {i + 1}
                      </IIIFViewerThumbNumber>
                      <IIIFCanvasThumbnail canvas={canvas} lang={lang} />
                    </IIIFViewerThumbLink>
                  </NextLink>
                </IIIFViewerThumb>
              );
            })}
        </div>
      )}
      {/* rename show static thumbs - or put in noscript? */}
      {showThumbnails && !enhanced && (
        <IIIFViewerThumbs>
          {imageUrl && (
            <IIIFViewerThumb key={imageUrl}>
              <Paginator
                {...thumbsPaginatorProps}
                render={({ rangeStart }) => (
                  <NextLink
                    {...itemUrl({
                      workId,
                      page: pageIndex + 1,
                      sierraId,
                      langCode: lang,
                      canvas: pageSize * pageIndex + 1,
                    })}
                    scroll={false}
                    replace
                    passHref
                  >
                    <IIIFViewerThumbLink isActive={true}>
                      <IIIFViewerThumbNumber>
                        <span className="visually-hidden">image </span>
                        {1}
                      </IIIFViewerThumbNumber>
                      <IIIFResponsiveImage
                        lang={lang}
                        width={100}
                        height={200}
                        src={imageUrl}
                        srcSet={''}
                        alt=""
                        sizes={`(min-width: 600px) 200px, 100px`}
                        isLazy={false}
                      />
                    </IIIFViewerThumbLink>
                  </NextLink>
                )}
              />
            </IIIFViewerThumb>
          )}
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
                      <IIIFViewerThumbLink
                        isActive={canvasIndex === rangeStart + i - 1}
                      >
                        <IIIFViewerThumbNumber>
                          <span className="visually-hidden">image </span>
                          {rangeStart + i}
                        </IIIFViewerThumbNumber>
                        <IIIFCanvasThumbnail canvas={canvas} lang={lang} />
                      </IIIFViewerThumbLink>
                    </NextLink>
                  )}
                />
              </IIIFViewerThumb>
            ))}
          <IIIFViewerPaginatorButtons isThumbs={true}>
            <Paginator {...thumbsPaginatorProps} render={PaginatorButtons} />
          </IIIFViewerPaginatorButtons>
        </IIIFViewerThumbs>
      )}
    </IIIFViewer>
  );
};

export default IIIFViewerComponent;
