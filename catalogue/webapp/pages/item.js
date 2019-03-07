// @flow
import { type Context } from 'next';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';
import { type IIIFManifest, type IIIFCanvas } from '@weco/common/model/iiif';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { itemUrl, workUrl } from '@weco/common/services/catalogue/urls';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Paginator from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import { classNames, spacing, font } from '@weco/common/utils/classnames';

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
      <Layout12>
        <Paginator
          currentPage={canvasIndex + 1}
          pageSize={1}
          totalResults={canvases.length}
          linkKey={'canvas'}
          link={itemUrl({
            workId,
            query,
            page: pageIndex + 1,
            canvas: canvasIndex + 1,
            workType,
            itemsLocationsLocationType,
            sierraId,
          })}
          render={({ currentPage, totalPages, prevLink, nextLink }) => {
            return (
              <div
                className={classNames({
                  'flex flex--v-center flex--h-center': true,
                  [spacing({ s: 1 }, { margin: ['top', 'bottom'] })]: true,
                })}
              >
                {prevLink && (
                  <NextLink {...prevLink} prefetch>
                    <a>
                      <Control
                        type="light"
                        icon="arrow"
                        extraClasses="icon--180"
                      />
                    </a>
                  </NextLink>
                )}
                <span
                  className={classNames({
                    [spacing({ s: 1 }, { margin: ['left', 'right'] })]: true,
                    [font({ s: 'LR3' })]: true,
                  })}
                >
                  {currentPage} of {totalPages}
                </span>
                {nextLink && (
                  <NextLink {...nextLink} prefetch>
                    <a>
                      <Control type="light" icon="arrow" extraClasses="icon" />
                    </a>
                  </NextLink>
                )}
              </div>
            );
          }}
        />
      </Layout12>
      <Layout12>
        <img
          className={classNames({
            'block h-center': true,
            [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
          })}
          style={{
            maxHeight: '80vh',
            width: 'auto',
          }}
          width={largestSize.width}
          height={largestSize.height}
          src={urlTemplate({
            size: `${largestSize.width},${largestSize.height}`,
          })}
        />
        <div className={classNames({ flex: true })}>
          {navigationCanvases.map((canvas, i) => (
            <div key={canvas['@id']}>
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
              >
                <a>
                  <IIIFCanvasThumbnail canvas={canvas} maxWidth={300} />
                </a>
              </NextLink>
            </div>
          ))}
        </div>
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
    pageSize = 5,
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
