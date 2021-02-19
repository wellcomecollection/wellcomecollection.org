// @flow
import { Fragment, useEffect, useState } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { CatalogueResultsList, Work } from '@weco/common/model/catalogue';
import { grid, classNames } from '@weco/common/utils/classnames';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { toHtmlId } from '@weco/common/utils/string';
import {
  GlobalContextData,
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import {
  CatalogueWorksApiProps,
  worksRouteToApiUrl,
} from '@weco/common/services/catalogue/ts_api';
import Space from '@weco/common/views/components/styled/Space';
import { getWorks } from '../services/catalogue/works';
import { trackSearch } from '@weco/common/views/components/Tracker/Tracker';
import cookies from 'next-cookies';
import useSavedSearchState from '@weco/common/hooks/useSavedSearchState';
import WorksSearchResults from '../components/WorksSearchResults/WorksSearchResults';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import SearchNoResults from '../components/SearchNoResults/SearchNoResults';
import { removeUndefinedProps } from '@weco/common/utils/json';
import SearchTitle from '../components/SearchTitle/SearchTitle';
import { GetServerSideProps, NextPage } from 'next';
import {
  appError,
  AppErrorProps,
  WithPageview,
} from '@weco/common/views/pages/_app';
import {
  fromQuery,
  toLink,
  WorksProps,
} from '@weco/common/views/components/WorksLink/WorksLink';
import {
  CheckboxFilter,
  DateRangeFilter,
} from '@weco/common/views/components/SearchFilters/SearchFilters';
import { quoteVal } from '@weco/common/utils/csv';

type Props = {
  works?: CatalogueResultsList<Work>;
  worksRouteProps: WorksProps;
  shouldGetWorks: boolean;
  apiProps: CatalogueWorksApiProps;
  globalContextData: GlobalContextData;
} & WithGlobalContextData &
  WithPageview;

const Works: NextPage<Props> = ({
  works,
  worksRouteProps,
  apiProps,
  globalContextData,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [, setSavedSearchState] = useSavedSearchState(worksRouteProps);

  const {
    query,
    page,
    productionDatesFrom,
    productionDatesTo,
  } = worksRouteProps;

  useEffect(() => {
    trackSearch(apiProps, {
      totalResults: works?.totalResults ?? 0,
      source: Router.query.source || 'unspecified',
    });
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

  const productionDatesFilter: DateRangeFilter = {
    type: 'dateRange',
    id: 'production.dates',
    label: 'Dates',
    from: {
      key: 'productionDatesFrom',
      id: 'production.dates.from',
      value: productionDatesFrom ?? undefined,
    },
    to: {
      key: 'productionDatesTo',
      id: 'production.dates.to',
      value: productionDatesTo ?? undefined,
    },
  };

  const workTypeFilter: CheckboxFilter = {
    type: 'checkbox',
    key: 'workType',
    id: 'workType',
    label: 'Formats',
    options:
      works?.aggregations?.workType.buckets.map((bucket) => ({
        id: bucket.data.id,
        value: bucket.data.id,
        count: bucket.count,
        label: bucket.data.label,
        selected: worksRouteProps.workType.includes(bucket.data.id),
      })) || [],
  };

  const subjectsFilter: CheckboxFilter = {
    type: 'checkbox',
    key: 'subjectsLabel',
    id: 'subjects.label',
    label: 'Subjects',
    options:
      works?.aggregations?.subjects?.buckets.map((bucket) => ({
        id: toHtmlId(bucket.data.label),
        value: quoteVal(bucket.data.label),
        count: bucket.count,
        label: bucket.data.label,
        selected: worksRouteProps.subjectsLabel.includes(bucket.data.label),
      })) || [],
  };

  const genresFilter: CheckboxFilter = {
    type: 'checkbox',
    key: 'genresLabel',
    id: 'genres.label',
    label: 'Genres',
    options:
      works?.aggregations?.genres?.buckets.map((bucket) => ({
        id: toHtmlId(bucket.data.label),
        value: quoteVal(bucket.data.label),
        count: bucket.count,
        label: bucket.data.label,
        selected: worksRouteProps.genresLabel.includes(bucket.data.label),
      })) || [],
  };

  const contributorsFilter: CheckboxFilter = {
    type: 'checkbox',
    key: 'contributorsAgentLabel',
    id: 'contributors.agent.label',
    label: 'Contributors',
    options:
      works?.aggregations?.contributors?.buckets.map((bucket) => ({
        id: toHtmlId(bucket.data.agent.label),
        value: quoteVal(bucket.data.agent.label),
        count: bucket.count,
        label: bucket.data.agent.label,
        selected: worksRouteProps.contributorsAgentLabel.includes(
          bucket.data.agent.label
        ),
      })) || [],
  };

  const languagesFilter: CheckboxFilter = {
    type: 'checkbox',
    key: 'languages',
    id: 'languages',
    label: 'Languages',
    options:
      works?.aggregations?.languages?.buckets.map((bucket) => ({
        id: bucket.data.id,
        value: bucket.data.id,
        count: bucket.count,
        label: bucket.data.label,
        selected: worksRouteProps.languages.includes(bucket.data.id),
      })) || [],
  };

  const filters = [
    productionDatesFilter,
    workTypeFilter,
    subjectsFilter,
    genresFilter,
    contributorsFilter,
    languagesFilter,
  ];

  return (
    <Fragment>
      <Head>
        {works?.prevPage && (
          <link
            rel="prev"
            href={convertUrlToString(
              toLink({ ...worksRouteProps, page: (page || 1) - 1 }).as
            )}
          />
        )}
        {works?.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              toLink({ ...worksRouteProps, page: page + 1 }).as
            )}
          />
        )}
      </Head>

      <CataloguePageLayout
        title={`${query ? `${query} | ` : ''}Catalogue search`}
        description="Search the Wellcome Collection catalogue"
        url={toLink({ ...worksRouteProps }).as}
        openGraphType={'website'}
        jsonLd={{ '@type': 'WebPage' }}
        siteSection={'collections'}
        imageUrl={undefined}
        imageAltText={undefined}
        globalContextData={globalContextData}
      >
        <Space
          v={{
            size: 'l',
            properties: ['padding-bottom'],
          }}
          className={classNames(['row'])}
        >
          <div className="container">
            {!works && <SearchTitle />}

            <div className="grid">
              <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                <Space v={{ size: 'l', properties: ['margin-top'] }}>
                  <SearchTabs
                    worksFilters={filters}
                    imagesFilters={[]}
                    worksRouteProps={worksRouteProps}
                    imagesRouteProps={{
                      ...worksRouteProps,
                      locationsLicense: null,
                      color: null,
                    }}
                    workTypeAggregations={
                      works && works.aggregations
                        ? works.aggregations.workType.buckets
                        : []
                    }
                    shouldShowDescription={query === ''}
                    shouldShowFilters={true}
                    aggregations={
                      works && works.aggregations
                        ? works.aggregations
                        : undefined
                    }
                    showSortBy={Boolean(works)}
                  />
                </Space>
              </div>
            </div>
          </div>
        </Space>

        {works && works.results.length > 0 && (
          <Fragment>
            <Space v={{ size: 'l', properties: ['padding-top'] }}>
              <div className="container">
                <div className="grid">
                  <div
                    className={classNames({
                      [grid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
                    })}
                  >
                    <div className="flex flex--h-space-between flex--v-center flex--wrap">
                      <Fragment>
                        <Paginator
                          query={query}
                          showPortal={true}
                          currentPage={page || 1}
                          pageSize={works.pageSize}
                          totalResults={works.totalResults}
                          link={toLink({
                            ...worksRouteProps,
                            source: 'search/paginator',
                          })}
                          onPageChange={async (event, newPage) => {
                            event.preventDefault();
                            const state = {
                              ...worksRouteProps,
                              page: newPage,
                            };
                            const link = toLink({
                              ...state,
                              source: 'search/paginator',
                            });
                            setSavedSearchState(state);
                            Router.push(link.href, link.as).then(() =>
                              window.scrollTo(0, 0)
                            );
                          }}
                          hideMobilePagination={true}
                        />
                      </Fragment>
                    </div>
                  </div>
                </div>
              </div>
            </Space>

            <Space
              v={{
                size: 'l',
                properties: ['padding-top'],
              }}
              style={{ opacity: loading ? 0 : 1 }}
            >
              <div className="container">
                {works && (
                  <WorksSearchResults
                    works={works}
                    worksRouteProps={worksRouteProps}
                    apiProps={apiProps}
                  />
                )}
              </div>

              <Space
                v={{
                  size: 'l',
                  properties: ['padding-top', 'padding-bottom'],
                }}
              >
                <div className="container">
                  <div className="grid">
                    <div
                      className={classNames({
                        [grid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
                      })}
                    >
                      <div className="flex flex--h-space-between flex--v-center flex--wrap">
                        <Fragment>
                          <Paginator
                            query={query}
                            currentPage={page || 1}
                            pageSize={works.pageSize}
                            totalResults={works.totalResults}
                            link={toLink({
                              ...worksRouteProps,
                              source: 'search/paginator',
                            })}
                            onPageChange={async (event, newPage) => {
                              event.preventDefault();
                              const state = {
                                ...worksRouteProps,
                                page: newPage,
                              };
                              const link = toLink({
                                ...state,
                                source: 'search/paginator',
                              });
                              setSavedSearchState(state);
                              Router.push(link.href, link.as).then(() =>
                                window.scrollTo(0, 0)
                              );
                            }}
                            hideMobileTotalResults={true}
                          />
                        </Fragment>
                      </div>
                    </div>
                  </div>
                </div>
              </Space>
            </Space>
          </Fragment>
        )}

        {works && works.results.length === 0 && (
          <SearchNoResults
            query={query}
            hasFilters={Boolean(productionDatesFrom || productionDatesTo)}
          />
        )}
      </CataloguePageLayout>
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async (context) => {
  const globalContextData = getGlobalContextData(context);
  const props = fromQuery(context.query);

  const { searchMoreFilters } = globalContextData.toggles;
  const defaultAggregations = ['workType', 'locationType'];
  const moreFiltersAggregations = [
    'genres',
    'languages',
    'subjects',
    'contributors',
  ];

  const aggregations = searchMoreFilters
    ? [...defaultAggregations, ...moreFiltersAggregations]
    : defaultAggregations;

  const _queryType = cookies(context)._queryType;

  const worksApiProps = worksRouteToApiUrl(props, {
    _queryType,
    aggregations,
  });

  const shouldGetWorks = !!(props.query && props.query !== '');

  const works = shouldGetWorks
    ? await getWorks({
        params: worksApiProps,
        toggles: globalContextData.toggles,
      })
    : undefined;

  if (works && works.type === 'Error') {
    return appError(context, works.httpStatus, works.description);
  }

  return {
    props: removeUndefinedProps({
      works,
      worksRouteProps: props,
      shouldGetWorks,
      apiProps: worksApiProps,
      globalContextData,
      pageview: {
        name: 'works',
        properties: works ? { totalResults: works.totalResults } : {},
      },
    }),
  };
};

export default Works;
