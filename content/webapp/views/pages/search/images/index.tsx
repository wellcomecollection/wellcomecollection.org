import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import styled from 'styled-components';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import { usePhasedFlags } from '@weco/common/server-data/Context';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { pluralize } from '@weco/common/utils/grammar';
import { linkResolver, SEARCH_PAGES_FORM_ID } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import {
  CatalogueResultsList,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';
import { imagesFilters } from '@weco/content/services/wellcome/common/filters';
import { Query } from '@weco/content/types/search';
import { getActiveFiltersLabel, hasFilters } from '@weco/content/utils/search';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';
import Pagination from '@weco/content/views/components/Pagination';
import SearchFilters from '@weco/content/views/components/SearchFilters';
import {
  ImagesProps,
  toSearchImagesLink,
} from '@weco/content/views/components/SearchPagesLink/Images';
import Sort from '@weco/content/views/components/Sort';
import { withSearchLayout } from '@weco/content/views/layouts/SearchPageLayout';
import SearchNoResults from '@weco/content/views/pages/search/search.NoResults';
import { phaseIsAtLeast } from '@weco/toggles';

import ImagesResultsWithSidebar from './images.ResultsWithSidebar';

export type Props = {
  images: CatalogueResultsList<Image>;
  imagesRouteProps: ImagesProps;
  query: Query;
  apiToolbarLinks: ApiToolbarLink[];
};

type WrapperProps = {
  $hasNoResults: boolean;
  $hasSidebarLayout: boolean;
};
const Wrapper = styled(Space).attrs<WrapperProps>(props => ({
  $v: {
    size: 'xl',
    properties:
      props.$hasNoResults || props.$hasSidebarLayout ? [] : ['margin-bottom'],
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

const ImagesSearchPage: NextPage<Props> = withSearchLayout(
  ({ images, imagesRouteProps, query }) => {
    const { query: queryString } = query;
    const { setLink } = useSearchContext();
    const { imageSidebarPhases } = usePhasedFlags();
    const showImageSidebar = phaseIsAtLeast(imageSidebarPhases, 'phase1');

    useEffect(() => {
      const link = toSearchImagesLink({ ...imagesRouteProps });
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
    const hasSidebarLayout = showImageSidebar && !hasNoResults;

    // Sits in the dark results area normally; in the light area above it
    // when the image sidebar is on.
    const renderResultsHeader = (isOnDark: boolean) => (
      <PaginationWrapper $verticalSpacing="md">
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
            darkBg={isOnDark}
          />

          <Pagination
            totalPages={images.totalPages}
            ariaLabel="Image search pagination"
            isOnDark={isOnDark}
            isHiddenMobile
          />
        </SortPaginationWrapper>
      </PaginationWrapper>
    );

    const bottomPagination = (
      <PaginationWrapper $verticalSpacing="md" $alignRight>
        <Pagination
          totalPages={images.totalPages}
          ariaLabel="Image search pagination"
          isOnDark
        />
      </PaginationWrapper>
    );

    const resultsArea = hasNoResults ? (
      <Container>
        <SearchNoResults query={queryString} hasFilters={hasActiveFilters} />
      </Container>
    ) : hasSidebarLayout ? (
      <ImagesResultsWithSidebar images={images.results}>
        {bottomPagination}
      </ImagesResultsWithSidebar>
    ) : (
      <Container>
        {renderResultsHeader(true)}

        <main>
          <CatalogueImageGallery images={images.results} variant="justified" />
        </main>

        {bottomPagination}
      </Container>
    );

    return (
      <>
        <Head>
          {images.prevPage && (
            <link
              rel="prev"
              href={convertUrlToString(
                toSearchImagesLink({
                  ...imagesRouteProps,
                  page: (imagesRouteProps.page || 1) - 1,
                }).href
              )}
            />
          )}
          {images.nextPage && (
            <link
              rel="next"
              href={convertUrlToString(
                toSearchImagesLink({
                  ...imagesRouteProps,
                  page: imagesRouteProps.page + 1,
                }).href
              )}
            />
          )}
        </Head>

        {(!hasNoResults || (hasNoResults && hasActiveFilters)) && (
          <Container>
            <Space
              $v={{
                size: 'md',
                properties: ['padding-top', 'padding-bottom'],
              }}
            >
              <SearchFilters
                query={queryString}
                linkResolver={params =>
                  linkResolver({ params, pathname: '/search/images' })
                }
                searchFormId={SEARCH_PAGES_FORM_ID}
                changeHandler={() => {
                  const form = document.getElementById(SEARCH_PAGES_FORM_ID);
                  if (form) {
                    // Set data attribute to indicate this is a filter change, not a query change
                    form.dataset.gtmIsFilterChange = 'true';
                    form.dispatchEvent(
                      new window.Event('submit', {
                        cancelable: true,
                        bubbles: true,
                      })
                    );
                    // Remove the attribute after dispatch
                    delete form.dataset.gtmIsFilterChange;
                  }
                }}
                filters={filters}
                hasNoResults={hasNoResults}
              />
            </Space>
          </Container>
        )}

        {hasSidebarLayout && (
          <Container>{renderResultsHeader(false)}</Container>
        )}

        <Wrapper
          $hasNoResults={hasNoResults}
          $hasSidebarLayout={hasSidebarLayout}
        >
          <Space
            $v={{
              size: 'md',
              properties: hasSidebarLayout ? [] : ['padding-bottom'],
            }}
          >
            {resultsArea}
          </Space>
        </Wrapper>
      </>
    );
  }
);

export default ImagesSearchPage;
