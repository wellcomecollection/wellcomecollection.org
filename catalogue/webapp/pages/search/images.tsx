import { useEffect, useContext } from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import Head from 'next/head';

// Components
import ImageEndpointSearchResults from '@weco/catalogue/components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import Space from '@weco/common/views/components/styled/Space';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';
import Pagination from '@weco/common/views/components/Pagination/Pagination';
import SearchFilters from '@weco/catalogue/components/SearchFilters';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';

// Utils & Helpers
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { getImages } from '@weco/catalogue/services/catalogue/images';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import {
  fromQuery,
  ImagesProps,
  toLink,
} from '@weco/common/views/components/ImagesLink/ImagesLink';
import { getServerData } from '@weco/common/server-data';
import { getSearchLayout } from 'components/SearchPageLayout/SearchPageLayout';
import { imagesFilters } from '@weco/common/services/catalogue/filters';
import { hasFilters, linkResolver } from '@weco/common/utils/search';
import { pluralize } from '@weco/common/utils/grammar';

// Types
import { CatalogueResultsList, Image } from '@weco/common/model/catalogue';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { Query } from '@weco/catalogue/types/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';

type Props = {
  images: CatalogueResultsList<Image>;
  imagesRouteProps: ImagesProps;
  query: Query;
  pageview: Pageview;
  apiToolbarLinks: ApiToolbarLink[];
};

const Wrapper = styled(Space).attrs<{ hasNoResults: boolean }>(props => ({
  v: { size: 'xl', properties: [props.hasNoResults ? '' : 'margin-bottom'] },
}))<{ hasNoResults: boolean }>`
  ${props =>
    props.hasNoResults
      ? ``
      : `
        background-color: ${props.theme.color('black')};
        color: ${props.theme.color('white')};
        `}
`;

const ImagesSearchPage: NextPageWithLayout<Props> = ({
  images,
  imagesRouteProps,
  query,
}) => {
  const { query: queryString } = query;
  const { setLink } = useContext(SearchContext);

  useEffect(() => {
    const link = toLink({ ...imagesRouteProps }, 'images_search_context');
    setLink(link);
  }, [imagesRouteProps]);

  const filters = imagesFilters({ images, props: imagesRouteProps });

  const hasNoResults = images.totalResults === 0;
  const hasActiveFilters = hasFilters({
    filters: filters.map(f => f.id),
    queryParams: Object.keys(query),
  });

  return (
    <>
      <Head>
        {images.prevPage && (
          <link
            rel="prev"
            href={convertUrlToString(
              toLink(
                { ...imagesRouteProps, page: (imagesRouteProps.page || 1) - 1 },
                'unknown'
              ).as
            )}
          />
        )}
        {images.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              toLink(
                { ...imagesRouteProps, page: imagesRouteProps.page + 1 },
                'unknown'
              ).as
            )}
          />
        )}
      </Head>

      {(!hasNoResults || (hasNoResults && hasActiveFilters)) && (
        <div className="container">
          <Space
            v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
          >
            <SearchFilters
              query={queryString}
              linkResolver={params =>
                linkResolver({ params, pathname: '/search/images' })
              }
              searchFormId="search-page-form"
              changeHandler={() => {
                const form = document.getElementById('search-page-form');
                form &&
                  form.dispatchEvent(
                    new window.Event('submit', {
                      cancelable: true,
                      bubbles: true,
                    })
                  );
              }}
              filters={filters}
              hasNoResults={hasNoResults}
            />
          </Space>
        </div>
      )}

      <Wrapper hasNoResults={hasNoResults}>
        <Space
          className="container"
          v={{ size: 'l', properties: ['padding-bottom'] }}
        >
          {hasNoResults ? (
            <SearchNoResults
              query={queryString}
              hasFilters={hasActiveFilters}
            />
          ) : (
            <>
              <PaginationWrapper verticalSpacing="l">
                <span>{pluralize(images.totalResults, 'result')}</span>
                <Pagination
                  totalPages={images.totalPages}
                  ariaLabel="Image search pagination"
                  hasDarkBg
                  isHiddenMobile
                />
              </PaginationWrapper>

              <main>
                <ImageEndpointSearchResults images={images.results} />
              </main>

              <PaginationWrapper verticalSpacing="l" alignRight>
                <Pagination
                  totalPages={images.totalPages}
                  ariaLabel="Image search pagination"
                  hasDarkBg
                />
              </PaginationWrapper>
            </>
          )}
        </Space>
      </Wrapper>
    </>
  );
};

ImagesSearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const query = context.query;
    const params = fromQuery(query);

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

    if (images.type === 'Error') {
      return appError(context, images.httpStatus, 'Images API error');
    }

    return {
      props: removeUndefinedProps({
        images,
        imagesRouteProps: params,
        serverData,
        query,
        pageview: {
          name: 'images',
          properties: { totalResults: images.totalResults },
        },
        apiToolbarLinks: [
          {
            id: 'catalogue-api',
            label: 'Catalogue API query',
            link: images._requestUrl,
          },
        ],
      }),
    };
  };
export default ImagesSearchPage;
