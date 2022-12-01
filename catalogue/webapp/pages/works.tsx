import { useEffect, useState, useContext } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import { getCookie } from 'cookies-next';

import { grid } from '@weco/common/utils/classnames';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import CataloguePageLayout from '@weco/catalogue/components/CataloguePageLayout/CataloguePageLayout';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import Space from '@weco/common/views/components/styled/Space';
import { getWorks } from '@weco/catalogue/services/catalogue/works';
import WorksSearchResults from '@weco/catalogue/components/WorksSearchResults/WorksSearchResults';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import { removeUndefinedProps } from '@weco/common/utils/json';
import SearchTitle from '@weco/catalogue/components/SearchTitle/SearchTitle';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import {
  fromQuery,
  toLink,
  WorksProps as WorksRouteProps,
} from '@weco/common/views/components/WorksLink/WorksLink';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';
import { worksFilters } from '@weco/common/services/catalogue/filters';
import { getServerData } from '@weco/common/server-data';
import { CatalogueResultsList, Work } from '@weco/common/model/catalogue';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { hasFilters } from '@weco/catalogue/utils/search';
import { Query } from '@weco/catalogue/types/search';

type Props = {
  works: CatalogueResultsList<Work>;
  worksRouteProps: WorksRouteProps;
  query: Query;
  pageview: Pageview;
};

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Works: NextPage<Props> = ({ works, worksRouteProps, query }) => {
  const [loading, setLoading] = useState(false);

  // TODO do we actually need query AND worksRouteProps...
  const { query: queryString } = query;

  const { setLink } = useContext(SearchContext);
  useEffect(() => {
    const link = toLink({ ...worksRouteProps }, 'works_search_context');
    setLink(link);
  }, [worksRouteProps]);

  useEffect(() => {
    function routeChangeStart() {
      setLoading(true);
    }
    function routeChangeComplete() {
      setLoading(false);
    }
    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      Router.events.off('routeChangeComplete', routeChangeComplete);
    };
  }, []);

  const filters = worksFilters({ works, props: worksRouteProps });
  const url = toLink({ ...worksRouteProps }, 'unknown').as;
  const isWorksLanding = url.query ? Object.keys(url.query).length === 0 : true;

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

      <CataloguePageLayout
        title={`${queryString ? `${queryString} | ` : ''}Catalogue search`}
        description={pageDescriptions.works}
        url={url}
        openGraphType="website"
        jsonLd={{ '@type': 'WebPage' }}
        siteSection="collections"
        // TODO: Why do we remove the 'main' role here?
        excludeRoleMain={true}
        apiToolbarLinks={[
          {
            id: 'catalogue-api-query',
            label: 'Catalogue API query',
            link: works._requestUrl,
          },
        ]}
      >
        <Space v={{ size: 'l', properties: ['padding-bottom'] }}>
          <div className="container">
            {/* Showing the h1 on `/works` (without a query string) in an attempt to
            have Google use it as the link text in sitelinks
            https://github.com/wellcomecollection/wellcomecollection.org/issues/7297 */}
            <SearchTitle isVisuallyHidden={Boolean(works) && !isWorksLanding} />
            <div className="grid">
              <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                <Space v={{ size: 'l', properties: ['margin-top'] }}>
                  <SearchTabs
                    query={worksRouteProps.query}
                    worksFilters={filters}
                    imagesFilters={[]}
                    shouldShowDescription={queryString === ''}
                    shouldShowFilters={true}
                  />
                </Space>
              </div>
            </div>
          </div>
        </Space>

        {works.results.length === 0 ? (
          <SearchNoResults
            query={queryString || ''}
            hasFilters={hasFilters({
              filters: filters.map(f => f.id),
              queryParams: Object.keys(query).map(p => p),
            })}
          />
        ) : (
          <>
            <Space v={{ size: 'l', properties: ['padding-top'] }}>
              <div className="container">
                <div className="grid">
                  <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                    <PaginationWrapper>
                      <Paginator
                        hasSort
                        query={worksRouteProps}
                        showPortal={true}
                        currentPage={worksRouteProps.page}
                        totalPages={works.totalPages}
                        totalResults={works.totalResults}
                        link={toLink(
                          {
                            ...worksRouteProps,
                          },
                          'search/paginator'
                        )}
                        onPageChange={async (event, newPage) => {
                          event.preventDefault();
                          const state = {
                            ...worksRouteProps,
                            page: newPage,
                          };
                          const link = toLink(
                            {
                              ...state,
                            },
                            'search/paginator'
                          );

                          Router.push(link.href, link.as).then(() =>
                            window.scrollTo(0, 0)
                          );
                        }}
                        hideMobilePagination={true}
                      />
                    </PaginationWrapper>
                  </div>
                </div>
              </div>
            </Space>

            <Space
              v={{ size: 'l', properties: ['padding-top'] }}
              style={{ opacity: loading ? 0 : 1 }}
            >
              <div className="container" role="main">
                <WorksSearchResults works={works} />
              </div>
              <Space
                v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
              >
                <div className="container">
                  <div className="grid">
                    <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                      <div className="flex flex--h-space-between flex--v-center flex--wrap">
                        <Paginator
                          query={worksRouteProps}
                          currentPage={worksRouteProps.page}
                          totalPages={works.totalPages}
                          totalResults={works.totalResults}
                          link={toLink(
                            { ...worksRouteProps },
                            'search/paginator'
                          )}
                          onPageChange={async (event, newPage) => {
                            event.preventDefault();
                            const state = { ...worksRouteProps, page: newPage };

                            const link = toLink(
                              { ...state },
                              'search/paginator'
                            );

                            Router.push(link.href, link.as).then(() =>
                              window.scrollTo(0, 0)
                            );
                          }}
                          hideMobileTotalResults={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Space>
            </Space>
          </>
        )}
      </CataloguePageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
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
        query,
        serverData,
        pageview: {
          name: 'works',
          properties: works ? { totalResults: works.totalResults } : {},
        },
      }),
    };
  };

export default Works;
