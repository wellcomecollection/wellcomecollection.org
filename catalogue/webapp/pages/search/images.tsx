import { ParsedUrlQuery } from 'querystring';
import { useEffect, ReactElement, useContext } from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import Head from 'next/head';

// Components
import ImageEndpointSearchResults from '@weco/catalogue/components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import Space from '@weco/common/views/components/styled/Space';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';
import SearchPagination from '@weco/common/views/components/SearchPagination/SearchPagination';
import SearchFilters from '@weco/common/views/components/SearchFilters/SearchFilters';

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
import { propsToQuery } from '@weco/common/utils/routes';
import { hasFilters } from '@weco/common/utils/search';
import { pluralize } from '@weco/common/utils/grammar';
import { font } from '@weco/common/utils/classnames';

// Types
import { CatalogueResultsList, Image } from '@weco/common/model/catalogue';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { Query } from '@weco/common/model/search';

type Props = {
  images?: CatalogueResultsList<Image>;
  imagesRouteProps: ImagesProps;
  urlQuery: Query;
  pageview: Pageview;
};

const Wrapper = styled(Space).attrs({
  v: { size: 'xl', properties: ['margin-bottom'] },
})`
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
`;

const PaginationWrapper = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: font('intb', 5),
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BottomPaginationWrapper = styled(PaginationWrapper)`
  justify-content: flex-end;
`;

const ImagesSearchPage: NextPageWithLayout<Props> = ({
  images,
  imagesRouteProps,
  urlQuery,
}): ReactElement<Props> => {
  const { query: queryString } = urlQuery;

  const { setLink } = useContext(SearchContext);
  useEffect(() => {
    const link = toLink({ ...imagesRouteProps }, 'images_search_context');
    setLink(link);
  }, [imagesRouteProps]);

  // If there is no query, return an empty page
  if (!queryString) {
    return (
      <Space
        v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
      ></Space>
    );
  }

  const filters = images
    ? imagesFilters({ images, props: imagesRouteProps })
    : [];

  const linkResolver = params => {
    const queryWithSource = propsToQuery(params);
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { source = undefined, ...queryWithoutSource } = {
      ...queryWithSource,
    };

    const as = {
      pathname: '/search/images',
      query: queryWithoutSource as ParsedUrlQuery,
    };

    const href = {
      pathname: '/search/images',
      query: queryWithSource,
    };

    return { href, as };
  };

  return (
    <>
      <Head>
        {images?.prevPage && (
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
        {images?.nextPage && (
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

      <div className="container">
        <SearchFilters
          query={queryString}
          linkResolver={linkResolver}
          searchFormId="searchPageForm"
          changeHandler={() => {
            const form = document.getElementById('searchPageForm');
            form &&
              form.dispatchEvent(
                new window.Event('submit', {
                  cancelable: true,
                  bubbles: true,
                })
              );
          }}
          filters={filters}
        />
      </div>

      {images && (
        <>
          {images?.totalResults === 0 ? (
            <SearchNoResults
              query={queryString}
              hasFilters={hasFilters({
                filters: filters.map(f => f.id),
                queryParams: Object.keys(urlQuery).map(p => p),
              })}
            />
          ) : (
            <Wrapper>
              <div className="container">
                <PaginationWrapper>
                  <span>{pluralize(images.totalResults, 'result')}</span>
                  <SearchPagination totalPages={images?.totalPages} darkBg />
                </PaginationWrapper>

                <main>
                  <ImageEndpointSearchResults images={images} />
                </main>

                <BottomPaginationWrapper>
                  <SearchPagination totalPages={images?.totalPages} darkBg />
                </BottomPaginationWrapper>
              </div>
            </Wrapper>
          )}
        </>
      )}
    </>
  );
};

ImagesSearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const urlQuery = context.query;

    if (!serverData.toggles.searchPage) {
      return { notFound: true };
    }

    const params = fromQuery(urlQuery);

    // Stop here if no query has been entered
    if (!params.query) {
      return {
        props: removeUndefinedProps({
          imagesRouteProps: params,
          serverData,
          urlQuery,
          pageview: {
            name: 'images',
            properties: { totalResults: 0 },
          },
        }),
      };
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
        images,
        imagesRouteProps: params,
        serverData,
        urlQuery,
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

export default ImagesSearchPage;
