// @flow
import { type Context } from 'next';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import { type IIIFManifest, type IIIFCanvas } from '@weco/common/model/iiif';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { itemUrl } from '@weco/common/services/catalogue/urls';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import { classNames } from '@weco/common/utils/classnames';

type Props = {|
  workId: string,
  sierraId: string,
  manifest: IIIFManifest,
  pageIndex: number,
  pageSize: number,
  itemsLocationsLocationType: string[],
  workType: string[],
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

  console.info(maxWidth, size, thumbnailService.sizes);

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
  pageIndex,
  pageSize,
  itemsLocationsLocationType,
  workType,
  query,
}: Props) => {
  const canvases = manifest.sequences[0].canvases;
  const currentCanvas = canvases[pageIndex];
  const service = currentCanvas.thumbnail.service;
  const urlTemplate = iiifImageTemplate(service['@id']);
  const title = manifest.label;
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
        <h1>{title}</h1>

        <Paginator
          currentPage={pageIndex + 1}
          pageSize={1}
          totalResults={canvases.length}
          link={itemUrl({
            workId,
            query,
            page: pageIndex - 1,
            workType,
            itemsLocationsLocationType,
            sierraId,
          })}
          onPageChange={async (event, newPage) => {
            event.preventDefault();

            const link = itemUrl({
              workId,
              query,
              workType,
              itemsLocationsLocationType,
              page: newPage,
              sierraId,
            });

            Router.push(link.href, link.as).then(() => window.scrollTo(0, 0));
          }}
        />

        <div className={classNames({ flex: true })}>
          {navigationCanvases.map(canvas => (
            <IIIFCanvasThumbnail
              key={canvas['@id']}
              canvas={canvas}
              maxWidth={300}
            />
          ))}
        </div>

        <img
          width={largestSize.width}
          height={largestSize.height}
          src={urlTemplate({
            size: `${largestSize.width},${largestSize.height}`,
          })}
        />
      </Layout12>
    </PageLayout>
  );
};

ItemPage.getInitialProps = async (ctx: Context): Promise<Props> => {
  const { workId, sierraId, query, page = 1, pageSize = 5 } = ctx.query;
  const pageIndex = page - 1;
  const manifest = await (await fetch(
    `https://wellcomelibrary.org/iiif/${sierraId}/manifest`
  )).json();
  const itemsLocationsLocationType =
    'items.locations.locationType' in ctx.query
      ? ctx.query['items.locations.locationType'].split(',')
      : ['iiif-image'];

  const { showCatalogueSearchFilters = false } = ctx.query.toggles;

  const defaultWorkType = ['k', 'q'];
  const workTypeQuery = ctx.query.workType;
  const workType = !showCatalogueSearchFilters
    ? defaultWorkType
    : !workTypeQuery
    ? []
    : workTypeQuery.split(',').filter(Boolean);

  return {
    workId,
    sierraId,
    manifest,
    pageIndex,
    pageSize,
    itemsLocationsLocationType,
    workType,
    query,
  };
};

export default ItemPage;
