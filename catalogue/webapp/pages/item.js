// @flow
import { type Context } from 'next';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { itemUrl } from '@weco/common/services/catalogue/urls';

import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
type Props = {|
  workId: string,
  sierraId: string,
  manifest: {},
  pageIndex: number,
  itemsLocationsLocationType: string[],
  workType: string[],
|};

const ItemPage = ({
  workId,
  sierraId,
  manifest,
  pageIndex,
  itemsLocationsLocationType,
  workType,
}: Props) => {
  const canvases = manifest.sequences[0].canvases;
  const currentCanvas = canvases[pageIndex];
  const service = currentCanvas.thumbnail.service;
  const urlTemplate = iiifImageTemplate(service['@id']);
  const title = manifest.label;

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
      <h1>{title}</h1>

      <Paginator
        currentPage={pageIndex + 1}
        pageSize={1}
        totalResults={canvases.length}
        link={itemUrl({
          workId,
          query: '',
          page: pageIndex - 1,
          workType,
          itemsLocationsLocationType,
          sierraId,
        })}
        onPageChange={async (event, newPage) => {
          event.preventDefault();

          const link = itemUrl({
            workId,
            query: '',
            workType,
            itemsLocationsLocationType,
            page: newPage,
            sierraId,
          });
          Router.push(link.href, link.as).then(() => window.scrollTo(0, 0));
        }}
      />
      <img
        width={service.sizes[1].width}
        height={service.sizes[1].height}
        src={urlTemplate({
          size: `${service.sizes[1].width},${service.sizes[1].height}`,
        })}
      />
    </PageLayout>
  );
};

ItemPage.getInitialProps = async (ctx: Context): Promise<Props> => {
  const { workId, sierraId, page } = ctx.query;
  const pageIndex = page ? parseInt(page, 10) - 1 : 0;
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
    itemsLocationsLocationType,
    workType,
  };
};

export default ItemPage;
