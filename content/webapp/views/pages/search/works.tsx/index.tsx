import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import styled from 'styled-components';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import { useToggles } from '@weco/common/server-data/Context';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { formatNumber, pluralize } from '@weco/common/utils/grammar';
import { linkResolver, SEARCH_PAGES_FORM_ID } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import {
  WellcomeApiError,
  WellcomeResultList,
} from '@weco/content/services/wellcome';
import {
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
  works2?: WellcomeResultList<WorkBasic, WorkAggregations> | WellcomeApiError;
  works3?: WellcomeResultList<WorkBasic, WorkAggregations> | WellcomeApiError;
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
    const { semanticSearchPrototype, semanticSearchComparison } = useToggles();

    // Extract error messages if works2/works3 are errors
    const works2Error =
      works2 && 'type' in works2 && works2.type === 'Error'
        ? works2.description || works2.label
        : undefined;
    const works3Error =
      works3 && 'type' in works3 && works3.type === 'Error'
        ? works3.description || works3.label
        : undefined;

    // Get actual result data (not errors)
    const works2Data =
      works2 && (!('type' in works2) || works2.type !== 'Error')
        ? works2
        : undefined;
    const works3Data =
      works3 && (!('type' in works3) || works3.type !== 'Error')
        ? works3
        : undefined;

    const { setLink } = useSearchContext();
    useEffect(() => {
      const link = toSearchWorksLink({ ...worksRouteProps });
      setLink(link);
    }, [worksRouteProps]);

    // Use the correct works data for filters based on selected alternative
    let worksForFilters = works;
    if (semanticSearchPrototype || semanticSearchComparison) {
      const searchIn = query.searchIn;
      if (searchIn === 'alternative2' && works2Data) {
        worksForFilters = works2Data;
      } else if (searchIn === 'alternative3' && works3Data) {
        worksForFilters = works3Data;
      }
    }

    const filters = worksFilters({
      works: worksForFilters,
      props: worksRouteProps,
    });

    const hasNoResults = (() => {
      if (semanticSearchPrototype) {
        const searchIn = query.searchIn || 'alternative1';
        if (searchIn === 'alternative2') {
          return !works2Error && (!works2Data || works2Data.totalResults === 0);
        } else if (searchIn === 'alternative3') {
          return !works3Error && (!works3Data || works3Data.totalResults === 0);
        } else {
          return works.totalResults === 0;
        }
      } else if (semanticSearchComparison) {
        return (
          works.totalResults === 0 &&
          (!works2Data || works2Data.totalResults === 0) &&
          (!works3Data || works3Data.totalResults === 0) &&
          !works2Error &&
          !works3Error
        );
      } else {
        return works.totalResults === 0;
      }
    })();
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
          {(semanticSearchPrototype || semanticSearchComparison) && (
            <>
              <meta name="robots" content="noindex, nofollow" />
              <link
                rel="canonical"
                href={convertUrlToString(
                  toSearchWorksLink({
                    ...worksRouteProps,
                    // Ensure the canonical points to the non-experimental variant
                    searchIn: undefined,
                  }).href
                )}
              />
            </>
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
            ) : semanticSearchComparison &&
              worksRouteProps.searchIn === 'all' ? (
              <>
                {(() => {
                  // Use totalPages from the result set with the most results
                  const resultSets = [
                    { results: works.totalResults, pages: works.totalPages },
                    works2Data
                      ? {
                          results: works2Data.totalResults,
                          pages: works2Data.totalPages,
                        }
                      : null,
                    works3Data
                      ? {
                          results: works3Data.totalResults,
                          pages: works3Data.totalPages,
                        }
                      : null,
                  ].filter(
                    (set): set is { results: number; pages: number } =>
                      set !== null
                  );

                  const maxResultsSet = resultSets.reduce((max, current) =>
                    current.results > max.results ? current : max
                  );

                  const totalPages = maxResultsSet.pages;

                  return (
                    <>
                      <PaginationWrapper $verticalSpacing="md">
                        <span role="status">
                          Results:{' '}
                          {works &&
                            `${formatNumber(works.totalResults)} works ${works2Data || works3Data ? '(alternative 1)' : ''}`}
                          {works2Data &&
                            ` | ${formatNumber(works2Data.totalResults)} works (alternative 2)`}
                          {works3Data &&
                            ` | ${formatNumber(works3Data.totalResults)} works (alternative 3)`}
                        </span>
                        <Pagination
                          totalPages={totalPages}
                          ariaLabel="search pagination"
                        />
                      </PaginationWrapper>

                      <main>
                        <PrototypeSearchResults
                          works={works}
                          works2={works2Data}
                          works3={works3Data}
                          works2Error={works2Error}
                          works3Error={works3Error}
                          currentPage={worksRouteProps.page}
                        />

                        <PaginationWrapper $verticalSpacing="md" $alignRight>
                          <Pagination
                            totalPages={totalPages}
                            ariaLabel="search pagination"
                          />
                        </PaginationWrapper>
                      </main>
                    </>
                  );
                })()}
              </>
            ) : (
              <>
                {(() => {
                  // TODO: Remove this entire block when semanticSearchPrototype toggle is removed
                  // This handles individual API selection in prototype mode
                  // Use worksRouteProps.searchIn which has server-side defaults applied
                  const searchIn = worksRouteProps.searchIn || 'alternative1';
                  const selectedWorksData =
                    searchIn === 'alternative2'
                      ? works2Data || {
                          results: [],
                          totalPages: 0,
                          totalResults: 0,
                        }
                      : searchIn === 'alternative3'
                        ? works3Data || {
                            results: [],
                            totalPages: 0,
                            totalResults: 0,
                          }
                        : works;

                  const selectedError =
                    searchIn === 'alternative2'
                      ? works2Error
                      : searchIn === 'alternative3'
                        ? works3Error
                        : undefined;

                  const {
                    results: selectedWorks,
                    totalPages: selectedTotalPages,
                    totalResults: selectedTotalResults,
                  } = selectedWorksData;

                  if (selectedError) {
                    return (
                      <>
                        <Space
                          $v={{
                            size: 'md',
                            properties: ['padding-top', 'padding-bottom'],
                          }}
                        >
                          <div role="alert" aria-live="assertive">
                            <p>
                              Alternative search temporarily unavailable —
                              please try again.
                            </p>
                            <strong>Error:</strong> {selectedError}
                          </div>
                        </Space>
                      </>
                    );
                  }

                  return (
                    <>
                      <PaginationWrapper $verticalSpacing="md">
                        <span role="status">
                          {pluralize(selectedTotalResults, 'result')}
                          {activeFiltersLabels.length > 0 && (
                            <span className="visually-hidden">
                              {' '}
                              filtered with: {activeFiltersLabels.join(', ')}
                            </span>
                          )}
                        </span>

                        <SortPaginationWrapper>
                          {!semanticSearchPrototype && (
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
                          )}

                          <Pagination
                            totalPages={selectedTotalPages}
                            ariaLabel="Catalogue search pagination"
                            isHiddenMobile
                          />
                        </SortPaginationWrapper>
                      </PaginationWrapper>

                      <main>
                        <WorksSearchResults works={selectedWorks} />
                      </main>

                      <PaginationWrapper $verticalSpacing="md" $alignRight>
                        <Pagination
                          totalPages={selectedTotalPages}
                          ariaLabel="Catalogue search pagination"
                        />
                      </PaginationWrapper>
                    </>
                  );
                })()}
              </>
            )}
          </Container>
        </Space>
      </>
    );
  }
);

export default WorksSearchPage;
