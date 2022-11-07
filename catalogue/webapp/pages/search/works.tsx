import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
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
import { useContext, useEffect, useState } from 'react';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import WorksSearchResults from '@weco/catalogue/components/WorksSearchResults/WorksSearchResults';
import styled from 'styled-components';
import SearchPagination from '@weco/common/views/components/SearchPagination/SearchPagination';
import { useRouter } from 'next/router';
import Select from '@weco/common/views/components/Select/Select';

type Props = {
  works: CatalogueResultsList<Work>;
  worksRouteProps: WorksRouteProps;
  pageview: Pageview;
};

const ResultsPaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  const router = useRouter();
  const { setLink } = useContext(SearchContext);
  useEffect(() => {
    const link = toLink({ ...worksRouteProps }, 'works_search_context');
    setLink(link);
  }, [worksRouteProps]);

  const [isComponentMounted, setIsComponentMounted] = useState(false);
  useEffect(() => setIsComponentMounted(true), []);

  const [sortOrder, setSortOrder] = useState(router.query.sortOrder || '');

  useEffect(() => {
    if (router.query.sortOrder !== sortOrder) {
      const form = document.getElementById('searchPageForm');
      form?.dispatchEvent(
        new window.Event('submit', { cancelable: true, bubbles: true })
      );
    }
  }, [sortOrder]);

  if (works.totalResults === 0) return <p>nothing</p>;

  return (
    <>
      <h1 className="visually-hidden">Works Search Page</h1>

      {works.results.length > 0 && (
        <div className="container">
          <Space
            v={{
              size: 'l',
              properties: ['padding-top', 'padding-bottom'],
            }}
          >
            <ResultsPaginationWrapper aria-label="Sort Search Results">
              <div>
                <noscript>
                  <Space v={{ size: 's', properties: ['margin-bottom'] }}>
                    <fieldset className="">
                      <legend>Search result sorting</legend>
                      <span id="sort-label" className="">
                        Sort by:
                      </span>
                      <select
                        aria-labelledby="sort-label"
                        name="sort"
                        form="searchPageForm"
                      >
                        {[
                          {
                            value: '',
                            text: 'Relevance',
                          },
                          {
                            value: 'production.dates',
                            text: 'Production dates',
                          },
                        ].map(o => (
                          <option key={o.value} value={o.value}>
                            {o.text}
                          </option>
                        ))}
                      </select>
                      <br />
                      <span id="sort-order-label" className="">
                        Sort order:
                      </span>
                      <select
                        aria-labelledby="sort-order-label"
                        name="sortOrder"
                        form="searchPageForm"
                      >
                        {[
                          {
                            value: 'asc',
                            text: 'Ascending',
                          },
                          {
                            value: 'desc',
                            text: 'Descending',
                          },
                        ].map(o => (
                          <option key={o.value} value={o.value}>
                            {o.text}
                          </option>
                        ))}
                      </select>
                    </fieldset>
                  </Space>
                </noscript>
                {isComponentMounted && (
                  <Select
                    value={(sortOrder as string) || ''}
                    form="searchPageForm"
                    name="sortOrder"
                    label="sort results by:"
                    onChange={e => setSortOrder(e.currentTarget.value)}
                    options={[
                      {
                        value: '',
                        text: 'Relevance',
                      },
                      {
                        value: 'asc',
                        text: 'Oldest to newest',
                      },
                      {
                        value: 'desc',
                        text: 'Newest to oldest',
                      },
                    ]}
                    isPill
                    hideLabel
                  />
                )}
              </div>
              <SearchPagination totalPages={works?.totalPages} />
            </ResultsPaginationWrapper>
          </Space>
          <Space v={{ size: 'l', properties: ['padding-top'] }}>
            <main>
              <WorksSearchResults works={works} />
            </main>
          </Space>
        </div>
      )}

      {works.results.length === 0 && (
        <SearchNoResults
          query={query}
          hasFilters={Boolean(productionDatesFrom || productionDatesTo)}
        />
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
