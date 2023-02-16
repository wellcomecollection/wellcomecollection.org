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
import SearchFilters from '@weco/common/views/components/SearchFilters';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Divider from '@weco/common/views/components/Divider/Divider';
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
import { hasFilters } from '@weco/common/utils/search';
import { AppErrorProps, appError } from '@weco/common/services/app';
import { pluralize } from '@weco/common/utils/grammar';

// Types
import { CatalogueResultsList, Work } from '@weco/common/model/catalogue';
import { Query } from '@weco/catalogue/types/search';

type Props = {
  works: CatalogueResultsList<Work>;
  worksRouteProps: WorksRouteProps;
  query: Query;
  pageview: Pageview;
};

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const DividerWrapper = styled.div`
  ${props =>
    `
      margin: 0 -${props.theme.containerPadding.small}px; 
      transition: margin ${props => props.theme.transitionProperties};

    ${props.theme.media('medium')(`
        margin: 0 calc(-${props.theme.containerPadding.medium}px + 1rem); 
    `)}

    ${props.theme.media('large')(`
        margin: 0 calc(-${props.theme.containerPadding.large}px + 1rem);
    `)}

    ${props.theme.media('xlarge')(`
        margin-right: 0; 
    `)}
  `}
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

  const filters = worksFilters({ works, props: worksRouteProps });

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

  const hasNoResults = works.totalResults === 0;

  return (
    <>
      <Head>
        {works.prevPage && (
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
        {works.nextPage && (
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

      <Space
        className="container"
        v={{ size: 'l', properties: ['padding-bottom'] }}
      >
        <Space v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}>
          <SearchFilters
            query={queryString}
            linkResolver={linkResolver}
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
            isNewStyle
          />
        </Space>

        <DividerWrapper>
          <Divider lineColor="neutral.300" />
        </DividerWrapper>

        {hasNoResults ? (
          <SearchNoResults
            query={queryString}
            hasFilters={hasFilters({
              filters: [
                ...filters.map(f => f.id),
                // production.dates is one dropdown but two properties, so we're specifying them in their individual format
                'production.dates.from',
                'production.dates.to',
              ],
              queryParams: Object.keys(query).map(p => p),
            })}
          />
        ) : (
          <>
            <PaginationWrapper verticalSpacing="l">
              <span>{pluralize(works.totalResults, 'result')}</span>

              <SortPaginationWrapper>
                <Sort
                  formId="search-page-form"
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

            <PaginationWrapper verticalSpacing="l" alignRight>
              <Pagination
                totalPages={works.totalPages}
                ariaLabel="Catalogue search pagination"
              />
            </PaginationWrapper>
          </>
        )}
      </Space>
    </>
  );
};

CatalogueSearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);

    if (!serverData.toggles.searchPage) {
      return { notFound: true };
    }

    const query = context.query;
    const params = fromQuery(query);

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
