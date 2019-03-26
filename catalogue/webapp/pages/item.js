// @flow
import { type Context } from 'next';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';
import { type IIIFManifest, type IIIFCanvas } from '@weco/common/model/iiif';
import { itemUrl, workUrl } from '@weco/common/services/catalogue/urls';
import { getDownloadOptionsFromManifest } from '@weco/common/utils/works';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Paginator, {
  type PaginatorRenderFunctionProps,
} from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import { classNames, spacing, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Raven from 'raven-js';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import TruncatedText from '@weco/common/views/components/TruncatedText/TruncatedText';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';

const IIIFViewerPaginatorButtons = styled.div.attrs(props => ({
  className: classNames({
    'flex absolute flex--h-center': true,
  }),
}))`
  left: ${props => (props.isThumbs ? 'auto' : '50%')};
  right: ${props => props.theme.spacingUnit}px;
  bottom: ${props => (props.isThumbs ? '50%' : props.theme.spacingUnit + 'px')};
  transform: ${props =>
    props.isThumbs ? 'translateY(50%)' : 'translateX(-50%)'};

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
  className: classNames({
    'relative flex flex--v-center': true,
    [spacing({ s: 1 }, { padding: ['top', 'right', 'bottom', 'left'] })]: true,
  }),
}))`
  height: 100%;
  width: 20%;
  margin-right: ${props => props.theme.spacingUnit}px;

  &:last-child {
    margin: 0;
  }

  @media (min-width: ${props => props.theme.sizes.medium}px) {
    height: 25%;
    width: 100%;
    margin-right: 0;
  }
`;

const IIIFViewerThumbs = styled.div.attrs(props => ({
  className: classNames({
    'flex flex--h-center relative bg-smoke': true,
  }),
}))`
  height: 20%;
  width: 100%;
  padding: 0 100px 0 0;

  @media (min-width: ${props => props.theme.sizes.medium}px) {
    height: 100%;
    flex-direction: column;
    width: 25%;
    padding: 0 0 ${props => props.theme.spacingUnit * 10}px;
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
  height: 80%;
  width: 100%;

  @media (min-width: ${props => props.theme.sizes.medium}px) {
    height: 100%;
    width: 75%;
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

  img {
    border: 3px solid
      ${props => (props.isActive ? props.theme.colors.white : 'transparent')};
    transition: border-color 200ms ease;
  }
`;

const IIIFViewer = styled.div.attrs(props => ({
  className: classNames({
    'flex flex--wrap': true,
  }),
}))`
  width: 100vw;
  height: 90vh;
  flex-direction: row-reverse;

  img {
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

type Props = {|
  workId: string,
  sierraId: string,
  langCode: string,
  manifest: IIIFManifest,
  pageSize: number,
  pageIndex: number,
  canvasIndex: number,
  canvasOcr: ?string,
  itemsLocationsLocationType: ?(string[]),
  workType: ?(string[]),
  query: ?string,
|};

async function getCanvasOcr(canvas) {
  const textContent =
    canvas.otherContent &&
    canvas.otherContent.find(
      content =>
        content['@type'] === 'sc:AnnotationList' &&
        content.label === 'Text of this page'
    );
  const textService = textContent && textContent['@id'];
  try {
    const textJson = await fetch(textService);
    const text = await textJson.json();
    const textString = text.resources
      .filter(resource => {
        return resource.resource['@type'] === 'cnt:ContentAsText';
      })
      .map(resource => resource.resource.chars)
      .join(' ');
    return textString.length > 0 ? textString : null;
  } catch (e) {
    Raven.captureException(e);
    return null;
  }
}

type IIIFCanvasThumbnailProps = {|
  canvas: IIIFCanvas,
  maxWidth: ?number,
  lang: string,
|};

const IIIFCanvasThumbnail = ({
  canvas,
  maxWidth,
  lang,
}: IIIFCanvasThumbnailProps) => {
  const thumbnailService = canvas.thumbnail.service;

  return (
    <IIIFResponsiveImage
      lang={lang}
      width={canvas.width}
      height={canvas.height}
      imageService={thumbnailService}
      alt=""
      sizes={`(min-width: 600px) 200px, 100px`}
    />
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

const ItemPage = ({
  workId,
  sierraId,
  langCode,
  manifest,
  pageSize,
  pageIndex,
  canvasIndex,
  canvasOcr,
  itemsLocationsLocationType,
  workType,
  query,
}: Props) => {
  const canvases = manifest.sequences && manifest.sequences[0].canvases;
  const currentCanvas = canvases && canvases[canvasIndex];
  const title = manifest.label;
  const mainImageService =
    currentCanvas && currentCanvas.images[0].resource.service
      ? {
          '@id': currentCanvas.images[0].resource.service['@id'],
        }
      : null;
  const downloadOptions = getDownloadOptionsFromManifest(manifest);
  const pdfRendering =
    downloadOptions.find(option => option.label === 'Download PDF') || null;
  const navigationCanvases =
    canvases &&
    [...Array(pageSize)]
      .map((_, i) => pageSize * pageIndex + i)
      .map(i => canvases[i])
      .filter(Boolean);

  const sharedPaginatorProps = {
    totalResults: canvases && canvases.length,
    link: itemUrl({
      workId,
      query,
      page: pageIndex + 1,
      canvas: canvasIndex + 1,
      workType,
      itemsLocationsLocationType,
      langCode,
      sierraId,
    }),
  };

  const mainPaginatorProps = {
    currentPage: canvasIndex + 1,
    pageSize: 1,
    linkKey: 'canvas',
    ...sharedPaginatorProps,
  };

  const thumbsPaginatorProps = {
    currentPage: pageIndex + 1,
    pageSize: pageSize,
    linkKey: 'page',
    ...sharedPaginatorProps,
  };

  return (
    <PageLayout
      title={''}
      description={''}
      url={{ pathname: `/works/${workId}/items`, query: { sierraId } }}
      openGraphType={'website'}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection={'works'}
      imageUrl={'imageContentUrl'}
      imageAltText={''}
      hideNewsletterPromo={true}
    >
      <Layout12>
        <div
          className={classNames({
            [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
            [spacing({ s: 6 }, { padding: ['top'] })]: true,
          })}
        >
          <TruncatedText
            text={title}
            as="h1"
            className={classNames({
              [font({ s: 'HNM3', m: 'HNM2', l: 'HNM1' })]: true,
            })}
            title={title}
            lang={langCode}
          >
            {title}
          </TruncatedText>
          <NextLink
            {...workUrl({
              id: workId,
              page: pageIndex + 1,
              query,
            })}
          >
            <a
              className={classNames({
                [font({ s: 'HNM5', m: 'HNM4' })]: true,
              })}
            >
              Overview
            </a>
          </NextLink>
        </div>
        {!pdfRendering && !mainImageService && (
          <div
            className={classNames({
              [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
            })}
          >
            <BetaMessage
              message="We are currently unable to show this work online, but will be
        working on making it available."
            />
          </div>
        )}
      </Layout12>
      {pdfRendering && !mainImageService && (
        <iframe
          title={`PDF: ${title}`}
          src={pdfRendering['@id']}
          style={{
            width: '90vw',
            height: '90vh',
            margin: '0 auto 24px ',
            display: 'block',
            border: 'none',
          }}
        />
      )}

      {mainImageService && (
        <IIIFViewer>
          <IIIFViewerMain>
            <Paginator {...mainPaginatorProps} render={XOfY} />
            <IIIFResponsiveImage
              width={currentCanvas ? currentCanvas.width : 0}
              height={currentCanvas ? currentCanvas.height : 0}
              imageService={mainImageService}
              sizes={`(min-width: 860px) 800px, 100vw)`}
              extraClasses={classNames({
                'block h-center': true,
                [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
              })}
              lang={langCode}
              alt={
                (canvasOcr && canvasOcr.replace(/"/g, '')) ||
                'no text alternative is available for this image'
              }
            />

            <IIIFViewerPaginatorButtons>
              <Paginator {...mainPaginatorProps} render={PaginatorButtons} />
            </IIIFViewerPaginatorButtons>
          </IIIFViewerMain>

          <IIIFViewerThumbs>
            {navigationCanvases &&
              navigationCanvases.map((canvas, i) => (
                <IIIFViewerThumb key={canvas['@id']}>
                  <Paginator
                    {...thumbsPaginatorProps}
                    render={({ rangeStart }) => (
                      <NextLink
                        {...itemUrl({
                          workId,
                          query,
                          workType,
                          itemsLocationsLocationType,
                          page: pageIndex + 1,
                          sierraId,
                          langCode,
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
                          <IIIFCanvasThumbnail
                            canvas={canvas}
                            maxWidth={300}
                            lang={langCode}
                          />
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
        </IIIFViewer>
      )}
    </PageLayout>
  );
};

ItemPage.getInitialProps = async (ctx: Context): Promise<Props> => {
  const {
    workId,
    sierraId,
    langCode,
    query,
    page = 1,
    pageSize = 4,
    canvas = 1,
  } = ctx.query;
  const pageIndex = page - 1;
  const canvasIndex = canvas - 1;
  const manifest = await (await fetch(
    `https://wellcomelibrary.org/iiif/${sierraId}/manifest`
  )).json();

  const canvases = manifest.sequences && manifest.sequences[0].canvases;
  const currentCanvas = canvases && canvases[canvasIndex];
  const canvasOcr = currentCanvas ? await getCanvasOcr(currentCanvas) : null;

  return {
    workId,
    sierraId,
    langCode,
    manifest,
    pageSize,
    pageIndex,
    canvasIndex,
    canvasOcr,
    // TODO: add these back in, it's just makes it easier to check the URLs
    itemsLocationsLocationType: null,
    workType: null,
    query,
  };
};

export default ItemPage;
