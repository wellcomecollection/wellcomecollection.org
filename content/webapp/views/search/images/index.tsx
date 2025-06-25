import Head from 'next/head';
import { useEffect } from 'react';
import styled from 'styled-components';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { pluralize } from '@weco/common/utils/grammar';
import { linkResolver, SEARCH_PAGES_FORM_ID } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space, {
  VerticalSpaceProperty,
} from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import CatalogueImageGallery from '@weco/content/components/CatalogueImageGallery';
import Pagination from '@weco/content/components/Pagination';
import SearchFilters from '@weco/content/components/SearchFilters';
import { withSearchLayout } from '@weco/content/components/SearchPageLayout';
import {
  ImagesProps,
  toLink,
} from '@weco/content/components/SearchPagesLink/Images';
import Sort from '@weco/content/components/Sort';
import useHotjar from '@weco/content/hooks/useHotjar';
import {
  CatalogueResultsList,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';
import { imagesFilters } from '@weco/content/services/wellcome/common/filters';
import { Query } from '@weco/content/types/search';
import { getActiveFiltersLabel, hasFilters } from '@weco/content/utils/search';
import SearchNoResults from '@weco/content/views/search/search.NoResults';

export type Props = {
  images: CatalogueResultsList<Image>;
  imagesRouteProps: ImagesProps;
  query: Query;
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

const ImagesSearchPage: NextPageWithLayout<Props> = withSearchLayout(
  ({ images, imagesRouteProps, query }) => {
    useHotjar(true);
    const { query: queryString } = query;
    const { setLink } = useSearchContext();

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
                  {
                    ...imagesRouteProps,
                    page: (imagesRouteProps.page || 1) - 1,
                  },
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
                    <CatalogueImageGallery
                      images={images.results}
                      variant="justified"
                    />
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
  }
);

export default ImagesSearchPage;
