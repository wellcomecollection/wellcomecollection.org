import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import Head from 'next/head';

import CataloguePageLayout from '@weco/catalogue/components/CataloguePageLayout/CataloguePageLayout';
import Pagination from '@weco/common/views/components/Pagination/Pagination';
import Space from '@weco/common/views/components/styled/Space';
import ImageEndpointSearchResults from '@weco/catalogue/components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import SearchTitle from '@weco/catalogue/components/SearchTitle/SearchTitle';
import {
  fromQuery,
  ImagesProps,
  toLink,
} from '@weco/common/views/components/ImagesLink/ImagesLink';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';

import { grid } from '@weco/common/utils/classnames';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { getImages } from '@weco/catalogue/services/catalogue/images';
import { imagesFilters } from '@weco/common/services/catalogue/filters';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { pluralize } from '@weco/common/utils/grammar';
import { Pageview } from '@weco/common/services/conversion/track';
import { CatalogueResultsList, Image } from '@weco/common/model/catalogue';

type Props = {
  images?: CatalogueResultsList<Image>;
  imagesRouteProps: ImagesProps;
  pageview: Pageview;
};

const Images: NextPage<Props> = ({ images, imagesRouteProps }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { query, page, color } = imagesRouteProps;
  useEffect(() => {
    function routeChangeStart() {
      setIsLoading(true);
    }
    function routeChangeComplete() {
      setIsLoading(false);
    }
    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      Router.events.off('routeChangeComplete', routeChangeComplete);
    };
  }, []);

  const filters = images
    ? imagesFilters({ images, props: imagesRouteProps })
    : [];

  const { setLink } = useContext(SearchContext);
  useEffect(() => {
    const link = toLink({ ...imagesRouteProps }, 'images_search_context');
    setLink(link);
  }, [imagesRouteProps]);

  return (
    <>
      <Head>
        {images?.prevPage && (
          <link
            rel="prev"
            href={convertUrlToString(
              toLink({ ...imagesRouteProps, page: (page || 1) - 1 }, 'unknown')
                .as
            )}
          />
        )}
        {images?.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              toLink({ ...imagesRouteProps, page: page + 1 }, 'unknown').as
            )}
          />
        )}
      </Head>
      <CataloguePageLayout
        title={`${query ? `${query} | ` : ''}Image search`}
        description={pageDescriptions.images}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        url={toLink({ ...imagesRouteProps, source: 'canonical_link' }).as}
        openGraphType="website"
        jsonLd={{ '@type': 'WebPage' }}
        siteSection="collections"
        image={undefined}
        apiToolbarLinks={
          images
            ? [
                {
                  id: 'catalogue-api-query',
                  label: 'Catalogue API query',
                  link: images._requestUrl,
                },
              ]
            : []
        }
      >
        <Space v={{ size: 'l', properties: ['padding-bottom'] }}>
          <div className="container">
            <SearchTitle isVisuallyHidden={Boolean(images)} />

            <div className="grid">
              <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                <Space v={{ size: 'l', properties: ['margin-top'] }}>
                  <SearchTabs
                    query={imagesRouteProps.query}
                    sort={undefined}
                    sortOrder={undefined}
                    shouldShowDescription={query === ''}
                    activeTabIndex={1}
                    shouldShowFilters={true}
                    showSortBy={Boolean(images)}
                    imagesFilters={filters}
                    worksFilters={[]}
                  />
                </Space>
              </div>
            </div>
          </div>
        </Space>

        {images?.results && images.results.length > 0 && (
          <>
            <Space v={{ size: 'l', properties: ['padding-top'] }}>
              <div className="container">
                <PaginationWrapper>
                  <span>{pluralize(images.totalResults, 'result')}</span>
                  <Pagination
                    totalPages={images.totalPages}
                    ariaLabel="Image search pagination"
                    isLoading={isLoading}
                    isHiddenMobile
                  />
                </PaginationWrapper>
              </div>
            </Space>

            <Space v={{ size: 'l', properties: ['padding-top'] }}>
              <div className="container">
                <ImageEndpointSearchResults images={images.results} />
              </div>

              <Space
                v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
              >
                <div className="container">
                  <PaginationWrapper alignRight>
                    <Pagination
                      totalPages={images.totalPages}
                      ariaLabel="Image search pagination"
                      isLoading={isLoading}
                    />
                  </PaginationWrapper>
                </div>
              </Space>
            </Space>
          </>
        )}

        {images?.results.length === 0 && (
          <SearchNoResults query={query} hasFilters={!!color} />
        )}
      </CataloguePageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const params = fromQuery(context.query);

    /**
     * This is here due to the noscript colour element
     * the value provided by the native element will
     * include the "#" symbol.
     */
    if (params.color) {
      params.color = params.color.replace('#', '');
    }
    const aggregations = [
      'locations.license',
      'source.genres.label',
      'source.subjects.label',
      'source.contributors.agent.label',
    ];
    const apiProps = {
      ...params,
      aggregations,
    };
    const images = await getImages({
      params: apiProps,
      toggles: serverData.toggles,
      pageSize: 30,
    });

    if (images && images.type === 'Error') {
      return appError(context, images.httpStatus, 'Images API error');
    }

    return {
      props: removeUndefinedProps({
        serverData,
        images,
        imagesRouteProps: params,
        pageview: {
          name: 'images',
          properties: images
            ? {
                totalResults: images.totalResults,
              }
            : {},
        },
      }),
    };
  };

export default Images;
