import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import styled from 'styled-components';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import { useToggles } from '@weco/common/server-data/Context';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { pluralize } from '@weco/common/utils/grammar';
import { linkResolver, SEARCH_PAGES_FORM_ID } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import { WellcomeResultList } from '@weco/content/services/wellcome';
import {
  CatalogueResultsList,
  Concept,
  Image,
  WorkAggregations,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { worksFilters } from '@weco/content/services/wellcome/common/filters';
import { Query } from '@weco/content/types/search';
import { getActiveFiltersLabel, hasFilters } from '@weco/content/utils/search';
import Pagination from '@weco/content/views/components/Pagination';
import PrototypeSearchResults from '@weco/content/views/components/PrototypeSearchResults';
import SearchFilters from '@weco/content/views/components/SearchFilters';
import {
  toSearchWorksLink,
  WorksProps as WorksRouteProps,
} from '@weco/content/views/components/SearchPagesLink/Works';
import Sort from '@weco/content/views/components/Sort';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';
import { withSearchLayout } from '@weco/content/views/layouts/SearchPageLayout';
import SearchNoResults from '@weco/content/views/pages/search/search.NoResults';

export type Props = {
  works: WellcomeResultList<WorkBasic, WorkAggregations>;
  works2?: CatalogueResultsList<Concept> | null; // TODO this is temporary until we switch to semantic search APIs, when this will become a different set of works results
  works3?: CatalogueResultsList<Image> | null; // TODO this is temporary until we switch to semantic search APIs, when this will become a different set of works results
  worksRouteProps: WorksRouteProps;
  query: Query;
  apiToolbarLinks: ApiToolbarLink[];
};

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const WorksSearchPage: NextPage<Props> = withSearchLayout(
  ({ works, works2, works3, worksRouteProps, query }) => {
    const { query: queryString } = query;
    const { semanticSearchPrototype } = useToggles();

    const { setLink } = useSearchContext();
    useEffect(() => {
      const link = toSearchWorksLink({ ...worksRouteProps });
      setLink(link);
    }, [worksRouteProps]);

    const filters = worksFilters({ works, props: worksRouteProps });

    const hasNoResults = semanticSearchPrototype
      ? works.totalResults === 0 &&
        (!works2 || works2.totalResults === 0) &&
        (!works3 || works3.totalResults === 0)
      : works.totalResults === 0;
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
                toSearchWorksLink({
                  ...worksRouteProps,
                  page: (worksRouteProps.page || 1) - 1,
                }).href
              )}
            />
          )}
          {works.nextPage && (
            <link
              rel="next"
              href={convertUrlToString(
                toSearchWorksLink({
                  ...worksRouteProps,
                  page: worksRouteProps.page + 1,
                }).href
              )}
            />
          )}
        </Head>

        <Space $v={{ size: 'md', properties: ['padding-bottom'] }}>
          <Container>
            {!semanticSearchPrototype &&
              (!hasNoResults || (hasNoResults && hasActiveFilters)) && (
                <>
                  <Space
                    $v={{
                      size: 'md',
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
                </>
              )}

            {hasNoResults ? (
              <SearchNoResults
                query={queryString}
                hasFilters={hasActiveFilters}
              />
            ) : semanticSearchPrototype ? (
              <>
                <PaginationWrapper $verticalSpacing="md">
                  <span role="status">
                    Results:{' '}
                    {works.totalResults > 0 && `${works.totalResults} works`}
                    {works2 &&
                      works2.totalResults > 0 &&
                      `${works.totalResults > 0 ? ', ' : ''}${works2.totalResults} works (variant 2)`}
                    {works3 &&
                      works3.totalResults > 0 &&
                      `${works.totalResults > 0 || (works2 && works2.totalResults > 0) ? ', ' : ''}${works3.totalResults} works (variant 3)`}
                  </span>
                </PaginationWrapper>

                <main>
                  <PrototypeSearchResults
                    works={works}
                    works2={works2}
                    works3={works3}
                    currentPage={worksRouteProps.page}
                  />

                  <PaginationWrapper $verticalSpacing="md" $alignRight>
                    <Pagination
                      totalPages={Math.max(
                        works.totalPages,
                        works2?.totalPages || 0,
                        works3?.totalPages || 0
                      )}
                      ariaLabel="search pagination"
                    />
                  </PaginationWrapper>
                </main>
              </>
            ) : (
              <>
                <PaginationWrapper $verticalSpacing="md">
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

                <PaginationWrapper $verticalSpacing="md" $alignRight>
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
