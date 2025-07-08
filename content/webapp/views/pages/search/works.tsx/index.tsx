import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import styled from 'styled-components';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { pluralize } from '@weco/common/utils/grammar';
import { linkResolver, SEARCH_PAGES_FORM_ID } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import Pagination from '@weco/content/views/components/Pagination';
import SearchFilters from '@weco/content/views/components/SearchFilters';
import { withSearchLayout } from '@weco/content/views/components/SearchPageLayout';
import {
  toLink,
  WorksProps as WorksRouteProps,
} from '@weco/content/views/components/SearchPagesLink/Works';
import Sort from '@weco/content/views/components/Sort';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';
import { WellcomeResultList } from '@weco/content/services/wellcome';
import {
  WorkAggregations,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { worksFilters } from '@weco/content/services/wellcome/common/filters';
import { Query } from '@weco/content/types/search';
import { getActiveFiltersLabel, hasFilters } from '@weco/content/utils/search';
import SearchNoResults from '@weco/content/views/pages/search/search.NoResults';

export type Props = {
  works: WellcomeResultList<WorkBasic, WorkAggregations>;
  worksRouteProps: WorksRouteProps;
  query: Query;
  apiToolbarLinks: ApiToolbarLink[];
};

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const WorksSearchPage: NextPageWithLayout<Props> = withSearchLayout(
  ({ works, worksRouteProps, query }) => {
    const { query: queryString } = query;

    const { setLink } = useSearchContext();
    const pathname = usePathname();
    useEffect(() => {
      const link = toLink(
        { ...worksRouteProps },
        `works_search_context_${pathname}`
      );
      setLink(link);
    }, [worksRouteProps]);

    const filters = worksFilters({ works, props: worksRouteProps });

    const hasNoResults = works.totalResults === 0;
    const hasActiveFilters = hasFilters({
      filters: [
        ...filters.map(f => f.id),
        // production.dates is one dropdown but two properties, so we're specifying them in their individual format
        'production.dates.from',
        'production.dates.to',
      ],
      queryParams: query,
    });

    const activeFiltersLabels = getActiveFiltersLabel({ filters });

    return (
      <>
        <Head>
          {works.prevPage && (
            <link
              rel="prev"
              href={convertUrlToString(
                toLink(
                  { ...worksRouteProps, page: (worksRouteProps.page || 1) - 1 },
                  `search/paginator_${pathname}`
                ).as
              )}
            />
          )}
          {works.nextPage && (
            <link
              rel="next"
              href={convertUrlToString(
                toLink(
                  { ...worksRouteProps, page: worksRouteProps.page + 1 },
                  `search/paginator_${pathname}`
                ).as
              )}
            />
          )}
        </Head>

        <Space $v={{ size: 'l', properties: ['padding-bottom'] }}>
          <Container>
            {(!hasNoResults || (hasNoResults && hasActiveFilters)) && (
              <>
                <Space
                  $v={{
                    size: 'l',
                    properties: ['padding-top', 'padding-bottom'],
                  }}
                >
                  <SearchFilters
                    query={queryString}
                    linkResolver={params =>
                      linkResolver({ params, pathname: '/search/works' })
                    }
                    searchFormId={SEARCH_PAGES_FORM_ID}
                    changeHandler={() => {
                      const form =
                        document.getElementById(SEARCH_PAGES_FORM_ID);
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
              </>
            )}

            {hasNoResults ? (
              <SearchNoResults
                query={queryString}
                hasFilters={hasActiveFilters}
              />
            ) : (
              <>
                <PaginationWrapper $verticalSpacing="l">
                  <span role="status">
                    {pluralize(works.totalResults, 'result')}
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
                        // Default value to be left empty so it's not added to the URL query
                        { value: '', text: 'Relevance' },
                        {
                          value: 'production.dates.asc',
                          text: 'Oldest to newest',
                        },
                        {
                          value: 'production.dates.desc',
                          text: 'Newest to oldest',
                        },
                      ]}
                      jsLessOptions={{
                        sort: [
                          { value: '', text: 'Relevance' },
                          {
                            value: 'production.dates',
                            text: 'Production dates',
                          },
                        ],
                        sortOrder: [
                          { value: 'asc', text: 'Ascending' },
                          { value: 'desc', text: 'Descending' },
                        ],
                      }}
                      defaultValues={{
                        sort: worksRouteProps.sort,
                        sortOrder: worksRouteProps.sortOrder,
                      }}
                    />

                    <Pagination
                      totalPages={works.totalPages}
                      ariaLabel="Catalogue search pagination"
                      isHiddenMobile
                    />
                  </SortPaginationWrapper>
                </PaginationWrapper>

                <main>
                  <WorksSearchResults works={works.results} />
                </main>

                <PaginationWrapper $verticalSpacing="l" $alignRight>
                  <Pagination
                    totalPages={works.totalPages}
                    ariaLabel="Catalogue search pagination"
                  />
                </PaginationWrapper>
              </>
            )}
          </Container>
        </Space>
      </>
    );
  }
);

export default WorksSearchPage;
