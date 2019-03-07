// @flow
import { type Context } from 'next';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';
import { type IIIFManifest } from '@weco/common/model/iiif';
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
  pageIndex: number,
  itemsLocationsLocationType: string[],
  workType: string[],
  query: ?string,
|};

const ItemPage = ({
  workId,
  sierraId,
  manifest,
  pageIndex,
  itemsLocationsLocationType,
  workType,
  query,
}: Props) => {
  const canvases = manifest.sequences[0].canvases;
  const currentCanvas = canvases[pageIndex];
  const title = manifest.label;
  const service = currentCanvas.thumbnail.service;
  const urlTemplate = iiifImageTemplate(service['@id']);
  const largestSize = service.sizes[service.sizes.length - 1];

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
  const { workId, sierraId, page, query } = ctx.query;
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
    query,
  };
};

export default ItemPage;
