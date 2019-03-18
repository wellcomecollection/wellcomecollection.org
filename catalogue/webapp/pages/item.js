// @flow
import { type Context } from 'next';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';
import { type IIIFManifest, type IIIFCanvas } from '@weco/common/model/iiif';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { itemUrl, workUrl } from '@weco/common/services/catalogue/urls';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Paginator, {
  type PaginatorRenderFunctionProps,
} from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import { classNames, spacing, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';

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
      bottom: ${props.theme.spacingUnit * 5}px;
      left: 50%;
      transform: translateX(-50%) translateY(0%) rotate(90deg);
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
    padding: 0 0 100px;
  }
`;

const IIIFViewerMain = styled.div.attrs(props => ({
  className: classNames({
    'relative bg-charcoal': true,
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
  height: 100vh;
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
  }
`;

type Props = {|
  workId: string,
  sierraId: string,
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
  const textContent = canvas.otherContent.find(
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
    return null;
  }
}

type IIIFCanvasThumbnailProps = {| canvas: IIIFCanvas, maxWidth: ?number |};

const IIIFCanvasThumbnail = ({
  canvas,
  maxWidth,
}: IIIFCanvasThumbnailProps) => {
  const thumbnailService = canvas.thumbnail.service;

  const size = maxWidth
    ? thumbnailService.sizes
        .filter(size => size.width <= maxWidth)
        // TODO: We could make this the next size up for responsive images perhaps
        .reduce((max, size, i, arr) => (size.width > max.width ? size : max))
    : thumbnailService.sizes[0];

  const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
  return (
    // TODO: add alt text
    <img
      width={size.width}
      height={size.height}
      src={urlTemplate({
        size: `${size.width},${size.height}`,
      })}
      alt=""
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
        <NextLink {...prevLink} scroll={false}>
          <a
            className={classNames({
              [spacing({ s: 1 }, { margin: ['right'] })]: true,
            })}
          >
            <Control type="light" icon="arrow" extraClasses="icon--180" />
          </a>
        </NextLink>
      )}
      {nextLink && (
        <NextLink {...nextLink} scroll={false}>
          <a>
            <Control type="light" icon="arrow" extraClasses="icon" />
          </a>
        </NextLink>
      )}
    </div>
  );
};

const ItemPage = ({
  workId,
  sierraId,
  manifest,
  pageSize,
  pageIndex,
  canvasIndex,
  canvasOcr,
  itemsLocationsLocationType,
  workType,
  query,
}: Props) => {
  const canvases = manifest.sequences[0].canvases;
  const currentCanvas = canvases[canvasIndex];
  const title = manifest.label;
  const service = currentCanvas.thumbnail.service;
  const urlTemplate = iiifImageTemplate(service['@id']);
  const largestSize = service.sizes[service.sizes.length - 1];
  const navigationCanvases = [...Array(pageSize)]
    .map((_, i) => pageSize * pageIndex + i)
    .map(i => canvases[i])
    .filter(Boolean);

  const sharedPaginatorProps = {
    totalResults: canvases.length,
    link: itemUrl({
      workId,
      query,
      page: pageIndex + 1,
      canvas: canvasIndex + 1,
      workType,
      itemsLocationsLocationType,
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
      url={{ pathname: `/works/${workId}/items` }}
      openGraphType={'website'}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection={'works'}
      imageUrl={'imageContentUrl'}
      imageAltText={''}
      hideNewsletterPromo={true}
    >
      <IIIFViewer>
        <IIIFViewerMain>
          <Paginator {...mainPaginatorProps} render={XOfY} />
          <img
            className={classNames({
              'block h-center': true,
              [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
            })}
            width={largestSize.width}
            height={largestSize.height}
            src={urlTemplate({
              size: `max`,
            })}
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
          {navigationCanvases.map((canvas, i) => (
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
                      canvas: pageSize * pageIndex + (i + 1),
                    })}
                    scroll={false}
                  >
                    <IIIFViewerThumbLink
                      isActive={canvasIndex === rangeStart + i - 1}
                    >
                      <IIIFViewerThumbNumber>
                        {rangeStart + i}
                      </IIIFViewerThumbNumber>
                      <IIIFCanvasThumbnail canvas={canvas} maxWidth={300} />
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
      <Layout12>
        <h1
          className={classNames({
            [font({ s: 'HNM3', m: 'HNM2', l: 'HNM1' })]: true,
          })}
        >
          {title}
        </h1>
        <NextLink
          {...workUrl({
            id: workId,
            page: null,
            query: null,
          })}
        >
          <a>Overview</a>
        </NextLink>
      </Layout12>
    </PageLayout>
  );
};

ItemPage.getInitialProps = async (ctx: Context): Promise<Props> => {
  const {
    workId,
    sierraId,
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

  const canvases = manifest.sequences[0].canvases;
  const currentCanvas = canvases[canvasIndex];
  const canvasOcr = await getCanvasOcr(currentCanvas);

  return {
    workId,
    sierraId,
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
