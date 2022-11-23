import { useContext, useEffect } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import styled from 'styled-components';

import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps, appError } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getSearchLayout } from 'components/SearchPageLayout/SearchPageLayout';
import { CatalogueResultsList, Work } from '@weco/common/model/catalogue';
import {
  fromQuery,
  toLink,
  WorksProps as WorksRouteProps,
} from '@weco/common/views/components/WorksLink/WorksLink';
import { Pageview } from '@weco/common/services/conversion/track';
import { getWorks } from '@weco/catalogue/services/catalogue/works';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import WorksSearchResults from '@weco/catalogue/components/WorksSearchResults/WorksSearchResults';
import SearchPagination from '@weco/common/views/components/SearchPagination/SearchPagination';
import Sort from '@weco/catalogue/components/Sort/Sort';
import { font } from '@weco/common/utils/classnames';
import SearchFilters from '@weco/common/views/components/SearchFilters/SearchFilters';
import { worksFilters } from '@weco/common/services/catalogue/filters';
import { propsToQuery } from '@weco/common/utils/routes';

type Props = {
  works: CatalogueResultsList<Work>;
  worksRouteProps: WorksRouteProps;
  pageview: Pageview;
};

// TODO work on layout further in
// https://github.com/wellcomecollection/wellcomecollection.org/issues/8863
const PaginationWrapper = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: font('intb', 5),
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const BottomPaginationWrapper = styled(PaginationWrapper)`
  justify-content: flex-end;
`;

export const CatalogueSearchPage: NextPageWithLayout<Props> = ({
  works,
  worksRouteProps,
}) => {
  const {
    query,
    'production.dates.from': productionDatesFrom,
    'production.dates.to': productionDatesTo,
  } = worksRouteProps;

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

  return (
    <>
      <h1 className="visually-hidden">Works Search Page</h1>

      <div className="container">
        <SearchFilters
          query={query}
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

      {works.totalResults === 0 && (
        <SearchNoResults
          query={query}
          hasFilters={Boolean(productionDatesFrom || productionDatesTo)}
        />
      )}

      {works.totalResults > 0 && (
        <div className="container">
          <PaginationWrapper aria-label="Sort Search Results">
            {works.totalResults > 0 && (
              <span>{`${works.totalResults} result${
                works.totalResults > 1 ? 's' : ''
              }`}</span>
            )}

            <SortPaginationWrapper>
              <Sort
                formId="searchPageForm"
                options={[
                  { value: '', text: 'Relevance' },
                  { value: 'production.dates.asc', text: 'Oldest to newest' },
                  { value: 'production.dates.desc', text: 'Newest to oldest' },
                ]}
                jsLessOptions={{
                  sort: [
                    { value: '', text: 'Relevance' },
                    { value: 'production.dates', text: 'Production dates' },
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

              <SearchPagination totalPages={works?.totalPages} isHiddenMobile />
            </SortPaginationWrapper>
          </PaginationWrapper>

          <main>
            <WorksSearchResults works={works} />
          </main>

          <BottomPaginationWrapper aria-label="Bottom pagination">
            <SearchPagination totalPages={works?.totalPages} />
          </BottomPaginationWrapper>
        </div>
      )}
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

    const props = fromQuery(context.query);

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
      ...props,
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
        worksRouteProps: props,
        serverData,
        pageview: {
          name: 'works',
          properties: works ? { totalResults: works.totalResults } : {},
        },
      }),
    };
  };
export default CatalogueSearchPage;
