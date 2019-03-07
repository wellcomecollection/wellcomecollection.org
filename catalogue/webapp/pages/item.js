// @flow
import { type Context } from 'next';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import NextLink from 'next/link';
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
        {/* TODO: this div is here as it's annoyingly floating to the right */}
        <div>
          <Paginator
            currentPage={pageIndex + 1}
            pageSize={pageSize}
            totalResults={canvases.length}
            link={itemUrl({
              workId,
              query,
              page: pageIndex - 1,
              workType,
              itemsLocationsLocationType,
              sierraId,
              canvas: canvasIndex + 1,
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
                canvas: canvasIndex + 1,
              });

              Router.push(link.href, link.as).then(() => window.scrollTo(0, 0));
            }}
          />
        </div>

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
