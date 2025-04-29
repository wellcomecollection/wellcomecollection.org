import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { pluralize } from '@weco/common/utils/grammar';
import { serialiseProps } from '@weco/common/utils/json';
import { linkResolver, SEARCH_PAGES_FORM_ID } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import SearchContext from '@weco/common/views/components/SearchContext';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space, {
  VerticalSpaceProperty,
} from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import ImageEndpointSearchResults from '@weco/content/components/ImageEndpointSearchResults';
import Pagination from '@weco/content/components/Pagination';
import SearchFilters from '@weco/content/components/SearchFilters';
import SearchNoResults from '@weco/content/components/SearchNoResults';
import { getSearchLayout } from '@weco/content/components/SearchPageLayout';
import {
  fromQuery,
  ImagesProps,
  toLink,
} from '@weco/content/components/SearchPagesLink/Images';
import Sort from '@weco/content/components/Sort';
import useHotjar from '@weco/content/hooks/useHotjar';
import { emptyResultList } from '@weco/content/services/wellcome';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import {
  CatalogueResultsList,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';
import { imagesFilters } from '@weco/content/services/wellcome/common/filters';
import { Query } from '@weco/content/types/search';
import { getActiveFiltersLabel, hasFilters } from '@weco/content/utils/search';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { looksLikeSpam } from '@weco/content/utils/spam-detector';

type Props = {
  images: CatalogueResultsList<Image>;
  imagesRouteProps: ImagesProps;
  query: Query;
  pageview: Pageview;
  apiToolbarLinks: ApiToolbarLink[];
};

type WrapperProps = {
  $hasNoResults: boolean;
};
const Wrapper = styled(Space).attrs<WrapperProps>(props => ({
  $v: {
    size: 'xl',
    properties: [props.$hasNoResults ? '' : 'margin-bottom'].filter(
      Boolean
    ) as VerticalSpaceProperty[],
  },
}))<WrapperProps>`
  ${props =>
    props.$hasNoResults
      ? ``
      : `
        background-color: ${props.theme.color('black')};
        color: ${props.theme.color('white')};
        `}
`;

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const ImagesSearchPage: NextPageWithLayout<Props> = ({
  images,
  imagesRouteProps,
  query,
}) => {
  useHotjar(true);
  const { query: queryString } = query;
  const { setLink } = useContext(SearchContext);

  useEffect(() => {
    const link = toLink({ ...imagesRouteProps }, 'images_search_context');
    setLink(link);
  }, [imagesRouteProps]);

  const filters = imagesFilters({ images, props: imagesRouteProps });

  const hasNoResults = images.totalResults === 0;
  const hasActiveFilters = hasFilters({
    filters: [
      ...filters.map(f => f.id),
      // as in /works.tsx, production.dates is one dropdown but two properties, so we're specifying them in their individual format
      'source.production.dates.from',
      'source.production.dates.to',
    ],
    queryParams: query,
  });

  const activeFiltersLabels = getActiveFiltersLabel({ filters });

  return (
    <>
      <Head>
        {images.prevPage && (
          <link
            rel="prev"
            href={convertUrlToString(
              toLink(
                { ...imagesRouteProps, page: (imagesRouteProps.page || 1) - 1 },
                'search/paginator'
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
                'search/paginator'
              ).as
            )}
          />
        )}
      </Head>

      {(!hasNoResults || (hasNoResults && hasActiveFilters)) && (
        <Container>
          <Space
            $v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
          >
            <SearchFilters
              query={queryString}
              linkResolver={params =>
                linkResolver({ params, pathname: '/search/images' })
              }
              searchFormId={SEARCH_PAGES_FORM_ID}
              changeHandler={() => {
                const form = document.getElementById(SEARCH_PAGES_FORM_ID);
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
        </Container>
      )}

      <Wrapper $hasNoResults={hasNoResults}>
        <Space $v={{ size: 'l', properties: ['padding-bottom'] }}>
          <Container>
            {hasNoResults ? (
              <SearchNoResults
                query={queryString}
                hasFilters={hasActiveFilters}
              />
            ) : (
              <>
                <PaginationWrapper $verticalSpacing="l">
                  <span role="status">
                    {pluralize(images.totalResults, 'result')}
                    {activeFiltersLabels.length > 0 && (
                      <span className="visually-hidden">
                        {' '}
                        filtered with: {activeFiltersLabels.join(', ')}
                      </span>
                    )}
                  </span>

                  <SortPaginationWrapper>
                    <Sort
                      formId={SEARCH_PAGES_FORM_ID}
                      options={[
                        {
                          value: '',
                          text: 'Relevance',
                        },
                        {
                          value: 'source.production.dates.asc',
                          text: 'Oldest to newest',
                        },
                        {
                          value: 'source.production.dates.desc',
                          text: 'Newest to oldest',
                        },
                      ]}
                      jsLessOptions={{
                        sort: [
                          {
                            value: '',
                            text: 'Relevance',
                          },
                          {
                            value: 'source.production.dates',
                            text: 'Production dates',
                          },
                        ],
                        sortOrder: [
                          { value: 'asc', text: 'Ascending' },
                          { value: 'desc', text: 'Descending' },
                        ],
                      }}
                      defaultValues={{
                        sort: imagesRouteProps.sort,
                        sortOrder: imagesRouteProps.sortOrder,
                      }}
                      darkBg
                    />

                    <Pagination
                      totalPages={images.totalPages}
                      ariaLabel="Image search pagination"
                      hasDarkBg
                      isHiddenMobile
                    />
                  </SortPaginationWrapper>
                </PaginationWrapper>

                <main>
                  <ImageEndpointSearchResults images={images.results} />
                </main>

                <PaginationWrapper $verticalSpacing="l" $alignRight>
                  <Pagination
                    totalPages={images.totalPages}
                    ariaLabel="Image search pagination"
                    hasDarkBg
                  />
                </PaginationWrapper>
              </>
            )}
          </Container>
        </Space>
      </Wrapper>
    </>
  );
};

ImagesSearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const query = context.query;
  const params = fromQuery(query);

  const defaultProps = serialiseProps({
    imagesRouteProps: params,
    serverData,
    query,
  });

  // If the request looks like spam, return a 400 error and skip actually fetching
  // the data from the APIs.
  //
  // Users will still see a meaningful error page with instructions about tweaking
  // their query/telling us if they expected results, but they won't be causing load
  // on our back-end APIs.
  //
  // The status code will also allow us to filter out spam-like requests from our analytics.
  if (looksLikeSpam(query.query)) {
    context.res.statusCode = 400;
    return {
      props: serialiseProps({
        ...defaultProps,
        pageview: {
          name: 'images',
          properties: {
            looksLikeSpam: 'true',
          },
        },
        images: emptyResultList(),
        apiToolbarLinks: [],
      }),
    };
  }

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
    return appError(
      context,
      images.httpStatus,
      images.description || images.label || 'Images API error'
    );
  }

  return {
    props: serialiseProps({
      ...defaultProps,
      images,
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
