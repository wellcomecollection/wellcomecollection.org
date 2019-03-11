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

const IIIFViewer = styled.div`
  width: 100vw;
  height: 100vh;
  flex-direction: row-reverse;

  .iiif-viewer__main {
    height: 80%;
    width: 100%;

    @media (min-width: ${props => props.theme.sizes.medium}px) {
      height: 100%;
      width: 75%;
    }
  }

  .iiif-viewer__thumbs {
    height: 20%;
    width: 100%;
    padding: 0 100px 0 0;

    @media (min-width: ${props => props.theme.sizes.medium}px) {
      height: 100%;
      flex-direction: column;
      width: 25%;
      padding: 0 0 100px;
    }

    .iiif-viewer__paginator-buttons {
      left: auto;
      right: ${props => props.theme.spacingUnit}px;
      bottom: 50%;
      transform: translateX(0%) translateY(50%);

      @media (min-width: ${props => props.theme.sizes.medium}px) {
        bottom: ${props => props.theme.spacingUnit * 5}px;
        left: 50%;
        transform: translateX(-50%) translateY(0%) rotate(90deg);
      }
    }
  }

  .iiif-viewer__thumb {
    height: 100%;
    width: 20%;
    margin-right: ${props => props.theme.spacingUnit}px;

    &:last-child {
      margin: 0;
    }

    @media (min-width: 600px) {
      height: 25%;
      width: 100%;
      margin-right: 0;
    }
  }

  .iiif-viewer__thumb-number {
    top: ${props => props.theme.spacingUnit}px;
    left: 50%;
    transform: translateX(-50%);
    padding: 3px 2px 0;
  }

  .iiif-viewer__main-x-of-y {
    top: ${props => props.theme.spacingUnit}px;
    left: 50%;
    transform: translateX(-50%);
  }

  .iiif-viewer__paginator-buttons {
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
  }

  .iiif-viewer__thumb-link {
    height: 100%;

    img {
      border: 3px solid transparent;
      transition: border-color 200ms ease;
    }

    &.is-active img {
      border-color: ${props => props.theme.colors.white};
    }
  }

  img {
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
  itemsLocationsLocationType: ?(string[]),
  workType: ?(string[]),
  query: ?string,
|};

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

const MainXofY = ({
  currentPage,
  totalPages,
}: PaginatorRenderFunctionProps) => (
  <span
    className={classNames({
      'iiif-viewer__main-x-of-y': true,
      'absolute font-white': true,
      [spacing({ s: 1 }, { margin: ['left', 'right'] })]: true,
      [font({ s: 'LR3' })]: true,
    })}
  >
    {currentPage} of {totalPages}
  </span>
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
        'iiif-viewer__paginator-buttons': true,
        'flex--column flex absolute flex--h-center': true,
      })}
    >
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
      <IIIFViewer
        className={classNames({
          'flex flex--wrap': true,
        })}
      >
        <div
          className={classNames({
            'iiif-viewer__main': true,
            'flex flex--v-center flex--h-center relative bg-charcoal': true,
            [spacing({ s: 4 }, { padding: ['top'] })]: true,
            [spacing({ s: 1 }, { padding: ['right', 'left'] })]: true,
            [spacing({ s: 10 }, { padding: ['bottom'] })]: true,
          })}
        >
          <Paginator {...mainPaginatorProps} render={MainXofY} />
          <img
            className={classNames({
              'block h-center': true,
              [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
            })}
            width={largestSize.width}
            height={largestSize.height}
            src={urlTemplate({
              size: `${largestSize.width},${largestSize.height}`,
            })}
          />
          <Paginator {...mainPaginatorProps} render={PaginatorButtons} />
        </div>

        <div
          className={classNames({
            'iiif-viewer__thumbs': true,
            'flex flex--h-center relative bg-smoke': true,
          })}
        >
          {navigationCanvases.map((canvas, i) => (
            <div
              key={canvas['@id']}
              className={classNames({
                'relative flex flex--v-center': true,
                'iiif-viewer__thumb': true,
                [spacing(
                  { s: 1 },
                  { padding: ['top', 'right', 'bottom', 'left'] }
                )]: true,
              })}
            >
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
                    <a
                      className={classNames({
                        'iiif-viewer__thumb-link': true,
                        'flex flex--v-center h-center': true,
                        'is-active': canvasIndex === rangeStart + i - 1,
                      })}
                    >
                      <span
                        className={classNames({
                          'iiif-viewer__thumb-number': true,
                          'line-height-1': true,
                          'absolute bg-charcoal font-white': true,
                          [font({ s: 'LR3' })]: true,
                        })}
                      >
                        {rangeStart + i}
                      </span>
                      <IIIFCanvasThumbnail canvas={canvas} maxWidth={300} />
                    </a>
                  </NextLink>
                )}
              />
            </div>
          ))}
          <Paginator {...thumbsPaginatorProps} render={PaginatorButtons} />
        </div>
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
          <a>View overview</a>
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

  return {
    workId,
    sierraId,
    manifest,
    pageSize,
    pageIndex,
    canvasIndex,
    // TODO: add these back in, it's just makes it easier to check the URLs
    itemsLocationsLocationType: null,
    workType: null,
    query,
  };
};

export default ItemPage;
