import { useContext, useEffect } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getCookie } from 'cookies-next';
import styled from 'styled-components';

// Components
import Space from '@weco/common/views/components/styled/Space';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import WorksSearchResults from '@weco/catalogue/components/WorksSearchResults/WorksSearchResults';
import Pagination from '@weco/common/views/components/Pagination/Pagination';
import Sort from '@weco/catalogue/components/Sort/Sort';
import SearchFilters from '@weco/common/views/components/SearchFilters/SearchFilters';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import {
  fromQuery,
  toLink,
  WorksProps as WorksRouteProps,
} from '@weco/common/views/components/WorksLink/WorksLink';

// Utils & Helpers
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { Pageview } from '@weco/common/services/conversion/track';
import { getWorks } from '@weco/catalogue/services/catalogue/works';
import { worksFilters } from '@weco/common/services/catalogue/filters';
import { propsToQuery } from '@weco/common/utils/routes';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { hasFilters } from '@weco/catalogue/utils/search';
import { AppErrorProps, appError } from '@weco/common/services/app';
import { pluralize } from '@weco/common/utils/grammar';

// Types
import { CatalogueResultsList, Work } from '@weco/common/model/catalogue';
import { Query } from '@weco/catalogue/types/search';

type Props = {
  works?: CatalogueResultsList<Work>;
  worksRouteProps: WorksRouteProps;
  query: Query;
  pageview: Pageview;
};

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const CatalogueSearchPage: NextPageWithLayout<Props> = ({
  works,
  worksRouteProps,
  query,
}) => {
  const { query: queryString } = query;

  const { setLink } = useContext(SearchContext);
  useEffect(() => {
    const link = toLink({ ...worksRouteProps }, 'works_search_context');
    setLink(link);
  }, [worksRouteProps]);

  // If there is no query, return an empty page
  if (!queryString) {
    return (
      <Space
        v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
      ></Space>
    );
  }

  const filters = works ? worksFilters({ works, props: worksRouteProps }) : [];

  const linkResolver = params => {
    const queryWithSource = propsToQuery(params);
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { source = undefined, ...queryWithoutSource } = {
      ...queryWithSource,
    };

    const as = {
      pathname: '/search/works',
      query: queryWithoutSource as ParsedUrlQuery,
    };

    const href = {
      pathname: '/search/works',
      query: queryWithSource,
    };

    return { href, as };
  };

  return (
    <>
      <Head>
        {works?.prevPage && (
          <link
            rel="prev"
            href={convertUrlToString(
              toLink(
                { ...worksRouteProps, page: (worksRouteProps.page || 1) - 1 },
                'unknown'
              ).as
            )}
          />
        )}
        {works?.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              toLink(
                { ...worksRouteProps, page: worksRouteProps.page + 1 },
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

        {works && (
          <>
            {works.totalResults === 0 ? (
              <SearchNoResults
                query={queryString}
                hasFilters={hasFilters({
                  filters: filters.map(f => f.id),
                  queryParams: Object.keys(query).map(p => p),
                })}
              />
            ) : (
              <>
                <PaginationWrapper verticalSpacing="l">
                  <span>{pluralize(works.totalResults, 'result')}</span>

                  <SortPaginationWrapper>
                    <Sort
                      formId="searchPageForm"
                      options={[
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
                      totalPages={works?.totalPages}
                      ariaLabel="Catalogue search pagination"
                      isHiddenMobile
                    />
                  </SortPaginationWrapper>
                </PaginationWrapper>

                <main>
                  <WorksSearchResults works={works} />
                </main>

                <PaginationWrapper verticalSpacing="l" alignRight>
                  <Pagination
                    totalPages={works?.totalPages}
                    ariaLabel="Catalogue search pagination"
                  />
                </PaginationWrapper>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

CatalogueSearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const query = context.query;

    if (!serverData.toggles.searchPage) {
      return { notFound: true };
    }

    const params = fromQuery(context.query);

    // Stop here if no query has been entered
    if (!params.query) {
      return {
        props: removeUndefinedProps({
          worksRouteProps: params,
          serverData,
          query,
          pageview: {
            name: 'works',
            properties: { totalResults: 0 },
          },
        }),
      };
    }

    const aggregations = [
      'workType',
      'availabilities',
      'genres.label',
      'languages',
      'subjects.label',
      'contributors.agent.label',
    ];

    const _queryType = getCookie('_queryType') as string | undefined;

    const worksApiProps = {
      ...params,
      _queryType,
      aggregations,
    };

    const works = await getWorks({
      params: worksApiProps,
      pageSize: 25,
      toggles: serverData.toggles,
    });

    if (works.type === 'Error') {
      return appError(
        context,
        works.httpStatus,
        works.description || works.label
      );
    }

    return {
      props: removeUndefinedProps({
        works,
        worksRouteProps: params,
        serverData,
        query,
        pageview: {
          name: 'works',
          properties: works ? { totalResults: works.totalResults } : {},
        },
      }),
    };
  };
export default CatalogueSearchPage;
