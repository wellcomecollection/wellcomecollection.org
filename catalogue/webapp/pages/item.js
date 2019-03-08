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

const ItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.colors.smoke};
  flex-direction: row-reverse;

  .main {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80%;
    width: 100%;
    padding: 24px 6px 60px;

    @media (min-width: 600px) {
      height: 100%;
      width: 75%;
    }
  }

  .thumbs {
    position: relative;
    display: flex;
    justify-content: center;
    height: 20%;
    width: 100%;
    background: ${props => props.theme.colors.charcoal};
    padding: 0 100px 0 0;

    @media (min-width: 600px) {
      height: 100%;
      flex-direction: column;
      width: 25%;
      padding: 0 0 100px;
    }

    .paginator-buttons {
      left: auto;
      right: 6px;
      bottom: 50%;
      transform: translateX(0%) translateY(50%);

      @media (min-width: 600px) {
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(0%) rotate(90deg);
      }
    }
  }

  .thumb {
    position: relative;
    padding: 10px;
    display: flex;
    align-items: center;
    background: ${props => props.theme.colors.charcoal};
    height: 100%;
    width: 20%;
    margin-right: 10px;

    &:last-child {
      margin: 0;
    }

    @media (min-width: 600px) {
      height: 25%;
      width: 100%;
      margin-right: 0;
    }
  }

  .thumb-number {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    padding: 3px 2px 0;
    background: ${props => props.theme.colors.black};
    color: ${props => props.theme.colors.white};
  }
  .main-x-of-y {
    top: 6px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .paginator-buttons {
    flex-direction: column;
    align-items: center;
    display: flex;
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
  }

  .thumb-link {
    display: flex;
    align-items: center;
    height: 100%;
    margin: 0 auto;

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
    <img
      width={size.width}
      height={size.height}
      src={urlTemplate({
        size: `${size.width},${size.height}`,
      })}
    />
  );
};

const MainXofY = ({
  currentPage,
  totalPages,
}: PaginatorRenderFunctionProps) => (
  <span
    className={classNames({
      'main-x-of-y': true,
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
    <div className="paginator-buttons">
      <div
        className={classNames({
          'flex flex--v-center flex--h-center': true,
        })}
      >
        {prevLink && (
          <NextLink {...prevLink} prefetch scroll={false}>
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
          <NextLink {...nextLink} prefetch scroll={false}>
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

  const mainPaginatorProps = {
    currentPage: canvasIndex + 1,
    pageSize: 1,
    totalResults: canvases.length,
    linkKey: 'canvas',
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

  const thumbsPaginatorProps = {
    currentPage: pageIndex + 1,
    pageSize: pageSize,
    totalResults: canvases.length,
    linkKey: 'page',
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
      <ItemContainer>
        <div className="main">
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

        <div className="thumbs">
          {navigationCanvases.map((canvas, i) => (
            <div key={canvas['@id']} className="thumb">
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
                        'thumb-link': true,
                        'is-active': canvasIndex === rangeStart + i - 1,
                      })}
                    >
                      <span
                        className={classNames({
                          'thumb-number': true,
                          'line-height-1': true,
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
      </ItemContainer>
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
