// @flow
import { type IIIFCanvas } from '@weco/common/model/iiif';
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import Raven from 'raven-js';
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
import Icon from '@weco/common/views/components/Icon/Icon';

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
        margin-right: ${props => `0 ${props.theme.spacingUnit}px`};
      }
    }
    .btn__text {
      position: absolute;
      left: 100%;
      @media (min-width: ${props => props.theme.sizes.medium}px) {
        position: static;
      }
    }
    @media (min-width: ${props => props.theme.sizes.medium}px) {
      width: 130px;
    }
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
`;

const IIIFViewer = styled.div.attrs(props => ({
  className: classNames({
    'flex flex--wrap': true,
  }),
}))`
  position: ${props => props.isFixed && 'fixed'};
  top: ${props => props.isFixed && '149px'};
  height: calc(100vh - 149px);
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
  height: calc(100vh - 149px);
  width: 100%;
  overflow: scroll;
  position: fixed;
  top: 149px;
  background: ${props => props.theme.colors.charcoal};
  padding: ${props => props.theme.spacingUnit}px;
  transform: ${props =>
    props.showThumbs ? 'translateY(0%)' : 'translateY(100%)'};
  transition: transform 800ms ease;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;

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
    const inView = checkInView(container, itemToScroll, false);
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
  title,
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
  const thumbnailContainer = useRef(null);

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
  });

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
            })}
          >
            <Icon name="arrowSmall" extraClasses="icon--smoke icon--180" />
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
                  setShowThumbs(!showThumbs);
                }}
              />
            )}
          </>
        )}
      </TitleContainer>
      <noscript>
        <IIIFViewer>
          <IIIFViewerMain fullWidth={!thumbnailsRequired}>
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
                            <IIIFCanvasThumbnail canvas={canvas} lang={lang} />
                            <div>
                              <IIIFViewerThumbNumber
                                isActive={canvasIndex === rangeStart + i - 1}
                              >
                                <span className="visually-hidden">image </span>
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
          <IIIFViewerMain fullWidth={true}>
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

          {thumbnailsRequired && (
            <>
              {/* TODO use styled component */}
              <ScrollingThumbnailContainer
                ref={thumbnailContainer}
                showThumbs={showThumbs}
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
                            onClick={() => {
                              setShowThumbs(!showThumbs);
                            }}
                          >
                            <IIIFCanvasThumbnail canvas={canvas} lang={lang} />
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
            </>
          )}
        </IIIFViewer>
      )}
    </>
  );
};

export default IIIFViewerComponent;
