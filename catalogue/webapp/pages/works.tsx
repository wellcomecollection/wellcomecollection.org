// @flow
import { Fragment, useEffect, useState } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import {
  CatalogueResultsList,
  Work,
  Image,
} from '@weco/common/model/catalogue';
import { grid, classNames } from '@weco/common/utils/classnames';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import {
  GlobalContextData,
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import {
  WorksRouteProps,
  worksLink,
  WorksRoute,
} from '@weco/common/services/catalogue/routes';
import {
  CatalogueWorksApiProps,
  worksRouteToApiUrl,
  worksPropsToImagesProps,
} from '@weco/common/services/catalogue/ts_api';
import Space from '@weco/common/views/components/styled/Space';
import ImageEndpointSearchResults from '../components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import { getImages } from '../services/catalogue/images';
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
import { parseUrlParams } from '@weco/common/utils/serialise-url';

type Props = {
  works?: CatalogueResultsList<Work>;
  images?: CatalogueResultsList<Image>;
  worksRouteProps: WorksRouteProps;
  shouldGetWorks: boolean;
  apiProps: CatalogueWorksApiProps;
  globalContextData: GlobalContextData;
} & WithGlobalContextData &
  WithPageview;

const Works: NextPage<Props> = ({
  works,
  images,
  worksRouteProps,
  apiProps,
  globalContextData,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [, setSavedSearchState] = useSavedSearchState(worksRouteProps);
  const results: CatalogueResultsList<Work | Image> | undefined =
    works || images;

  const {
    query,
    page,
    productionDatesFrom,
    productionDatesTo,
  } = worksRouteProps;

  useEffect(() => {
    trackSearch(apiProps, {
      totalResults: results && results.totalResults ? results.totalResults : 0,
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

  const isImageSearch = worksRouteProps.search === 'images';

  return (
    <Fragment>
      <Head>
        {results && results.prevPage && (
          <link
            rel="prev"
            href={convertUrlToString(
              worksLink(
                { ...worksRouteProps, page: (page || 1) - 1 },
                'meta_link'
              ).as
            )}
          />
        )}
        {results && results.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              worksLink({ ...worksRouteProps, page: page + 1 }, 'meta_link').as
            )}
          />
        )}
      </Head>

      <CataloguePageLayout
        title={`${query ? `${query} | ` : ''}Catalogue search`}
        description="Search the Wellcome Collection catalogue"
        url={worksLink({ ...worksRouteProps }, 'canonical_link').as}
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
            {!results && <SearchTitle />}

            <div className="grid">
              <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                <SearchTabs
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
                    works && works.aggregations ? works.aggregations : undefined
                  }
                  showSortBy={Boolean(results)}
                />
              </div>
            </div>
          </div>
        </Space>

        {results && results.results.length > 0 && (
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
                          pageSize={results.pageSize}
                          totalResults={results.totalResults}
                          link={worksLink(
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
                            const link = worksLink(state, 'search/paginator');
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
                {(() => {
                  if (images && isImageSearch) {
                    return (
                      <ImageEndpointSearchResults
                        images={images}
                        apiProps={worksPropsToImagesProps(apiProps)}
                      />
                    );
                  }
                  if (works) {
                    return (
                      <WorksSearchResults
                        works={works}
                        worksRouteProps={worksRouteProps}
                        apiProps={apiProps}
                      />
                    );
                  }
                })()}
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
                            pageSize={results.pageSize}
                            totalResults={results.totalResults}
                            link={worksLink(
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
                              const link = worksLink(state, 'search/paginator');
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

        {results && results.results.length === 0 && (
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
> = async context => {
  const globalContextData = getGlobalContextData(context);
  const parsedParams = parseUrlParams(context.query);
  const params = WorksRoute.fromQuery(parsedParams);
  const { enableColorFiltering } = globalContextData.toggles;
  const _queryType = cookies(context)._queryType;
  const isImageSearch = params.search === 'images';
  const aggregations = [
    'workType',
    'locationType',
    'genres',
    'languages',
    'subjects',
  ];
  const worksApiProps = worksRouteToApiUrl(params, {
    _queryType,
    aggregations,
  });

  const hasQuery = !!(params.query && params.query !== '');

  const shouldGetWorks = hasQuery && !isImageSearch;
  const shouldGetImages = hasQuery && isImageSearch;
  const works = shouldGetWorks
    ? await getWorks({
        params: worksApiProps,
        toggles: globalContextData.toggles,
      })
    : undefined;

    console.log(' WORKS DETAILS *********************************');
    console.log(works);
    console.log(' WORKS DETAILS *********************************');
  if (works && works.type === 'Error') {
    return appError(context, works.httpStatus, 'Works API error');
  }

  // TODO: increase pageSize to 100 when `isImageSearch` (but only if `isEnhanced`)
  const imagesApiProps = {
    ...worksPropsToImagesProps(worksApiProps),
    color: enableColorFiltering ? params.imagesColor : undefined,
  };
  const images = shouldGetImages
    ? await getImages({
        params: imagesApiProps,
        toggles: globalContextData.toggles,
      })
    : undefined;

  if (images && images.type === 'Error') {
    return appError(context, images.httpStatus, 'Images API error');
  }

  // This logic is wonky, but it'll be removed once we have the
  // `/images` endpoint.
  const pageviewProperties =
    shouldGetWorks && works
      ? { totalResults: works.totalResults }
      : shouldGetImages && images
      ? { totalResults: images.totalResults }
      : {};

  return {
    props: removeUndefinedProps({
      works,
      images,
      worksRouteProps: params,
      shouldGetWorks,
      apiProps: worksApiProps,
      globalContextData,
      pageview: {
        // This is just like this for now until we move to the `/images` endpoint
        name: isImageSearch ? 'images' : 'works',
        properties: pageviewProperties,
      },
    }),
  };
};

export default Works;
