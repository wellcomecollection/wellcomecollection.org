// @flow
import { type Context } from 'next';
import { Fragment, useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import {
  type CatalogueApiError,
  type CatalogueResultsList,
  type Work,
  type Image,
} from '@weco/common/model/catalogue';
import { font, grid, classNames } from '@weco/common/utils/classnames';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import {
  type WorksRouteProps,
  worksLink,
  WorksRoute,
} from '@weco/common/services/catalogue/routes';
import {
  type CatalogueWorksApiProps,
  worksRouteToApiUrl,
  worksRouteToApiUrlWithDefaults,
  worksPropsToImagesProps,
} from '@weco/common/services/catalogue/api';
import Space from '@weco/common/views/components/styled/Space';
import ImageEndpointSearchResults from '../components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import StaticWorksContent from '../components/StaticWorksContent/StaticWorksContent';
import SearchForm from '../components/SearchForm/SearchForm';
import { getImages } from '../services/catalogue/images';
import { getWorks } from '../services/catalogue/works';
import { trackSearch } from '@weco/common/views/components/Tracker/Tracker';
import cookies from 'next-cookies';
import useSavedSearchState from '@weco/common/hooks/useSavedSearchState';
import WorkSearchResults from '../components/WorkSearchResults/WorkSearchResults';
import ImageSearchResults from '../components/ImageSearchResults/ImageSearchResults';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';

type Props = {|
  works: ?CatalogueResultsList<Work> | CatalogueApiError,
  images: ?CatalogueResultsList<Image> | CatalogueApiError,
  worksRouteProps: WorksRouteProps,
  unfilteredSearchResults: boolean,
  shouldGetWorks: boolean,
  apiProps: CatalogueWorksApiProps,
|};

const Works = ({
  works,
  images,
  worksRouteProps,
  unfilteredSearchResults,
  shouldGetWorks,
  apiProps,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [, setSavedSearchState] = useSavedSearchState(worksRouteProps);
  const results: ?CatalogueResultsList<Work | Image> | CatalogueApiError =
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
    function routeChangeStart(url: string) {
      setLoading(true);
    }
    function routeChangeComplete(url: string) {
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
  const { imagesEndpoint } = useContext(TogglesContext);

  if (results && results.type === 'Error') {
    return (
      <ErrorPage
        title={
          results.httpStatus === 500
            ? `We're experiencing technical difficulties at the moment. We're working to get this fixed.`
            : undefined
        }
        statusCode={results.httpStatus}
      />
    );
  }

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
        siteSection={'works'}
        imageUrl={null}
        imageAltText={null}
      >
        <Space
          v={{
            size: 'l',
            properties: ['padding-bottom'],
          }}
          className={classNames(['row'])}
        >
          <div className="container">
            {!works && (
              <div className="grid">
                <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                  <Space
                    v={{
                      size: 'm',
                      properties: ['margin-bottom'],
                    }}
                    className={classNames([
                      'flex flex--h-space-between flex--v-center flex--wrap',
                    ])}
                  >
                    <Space
                      as="h1"
                      v={{ size: 'm', properties: ['margin-bottom'] }}
                      className="h1"
                    >
                      Explore our collections
                    </Space>
                  </Space>
                </div>
              </div>
            )}

            <div className="grid">
              <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                <p
                  className={classNames({
                    [font('hnl', 4)]: true,
                    'visually-hidden': Boolean(works),
                  })}
                  id="search-form-description"
                >
                  Find thousands of freely licensed digital books, artworks,
                  photos and images of historical library materials and museum
                  objects.
                </p>

                <SearchForm
                  ariaDescribedBy="search-form-description"
                  shouldShowFilters={query !== ''}
                  worksRouteProps={worksRouteProps}
                  workTypeAggregations={
                    works && works.aggregations
                      ? works.aggregations.workType.buckets
                      : []
                  }
                />
              </div>
            </div>
          </div>
        </Space>

        {!results && <StaticWorksContent />}

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
                    <div className="flex flex--h-space-between flex--v-center">
                      <Fragment>
                        <Paginator
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
                  if (
                    works &&
                    works.type !== 'Error' &&
                    isImageSearch &&
                    !imagesEndpoint
                  ) {
                    return (
                      <ImageSearchResults works={works} apiProps={apiProps} />
                    );
                  }
                  if (
                    images &&
                    images.type !== 'Error' &&
                    isImageSearch &&
                    imagesEndpoint
                  ) {
                    return (
                      <ImageEndpointSearchResults
                        images={images}
                        apiProps={worksPropsToImagesProps(apiProps)}
                      />
                    );
                  }
                  if (works && works.type !== 'Error') {
                    return (
                      <WorkSearchResults
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
                      <div className="flex flex--h-space-between flex--v-center">
                        <Fragment>
                          <Paginator
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
          <Space
            v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
          >
            <div className="container">
              <div className="grid">
                <div className={grid({ s: 12, m: 10, l: 8, xl: 8 })}>
                  <p className={font('hnl', 2)}>
                    We couldn{`'`}t find anything that matched{' '}
                    <span
                      className={classNames({
                        [font('hnm', 2)]: true,
                      })}
                      style={{ fontWeight: '400' }}
                    >
                      {query}
                    </span>
                    {(productionDatesFrom || productionDatesTo) && (
                      <>
                        {' '}
                        <span>with the filters you have selected</span>
                      </>
                    )}
                    . Please try again.
                  </p>
                </div>
              </div>
            </div>
          </Space>
        )}
      </CataloguePageLayout>
    </Fragment>
  );
};

const IMAGES_LOCATION_TYPE = 'iiif-image';

Works.getInitialProps = async (ctx: Context): Promise<Props> => {
  const params = WorksRoute.fromQuery(ctx.query);
  const {
    unfilteredSearchResults,
    imagesEndpoint,
    archivesPrototype,
  } = ctx.query.toggles;
  const _queryType = cookies(ctx)._queryType;
  const isImageSearch = params.search === 'images';

  const apiPropsFn = unfilteredSearchResults
    ? worksRouteToApiUrl
    : worksRouteToApiUrlWithDefaults;

  const apiProps = archivesPrototype
    ? apiPropsFn(
        {
          ...params,
          itemsLocationsLocationType:
            isImageSearch && !imagesEndpoint
              ? [IMAGES_LOCATION_TYPE]
              : params.itemsLocationsLocationType,
        },
        {
          _queryType,
          aggregations: ['workType'],
          'items.locations.locationType': null,
          'items.locations.accessConditions.status': null,
        },
        true
      )
    : apiPropsFn(
        {
          ...params,
          itemsLocationsLocationType:
            isImageSearch && !imagesEndpoint
              ? [IMAGES_LOCATION_TYPE]
              : params.itemsLocationsLocationType,
        },
        {
          _queryType,
          aggregations: ['workType'],
        }
      );

  const hasQuery = !!(params.query && params.query !== '');
  const isEndpointImageSearch = isImageSearch && imagesEndpoint;

  const shouldGetWorks = hasQuery && !isEndpointImageSearch;
  const shouldGetImages = hasQuery && isEndpointImageSearch;

  const worksOrError = shouldGetWorks
    ? await getWorks({
        params: apiProps,
        toggles: ctx.query.toggles,
      })
    : null;

  // TODO: increase pageSize to 100 when `isImageSearch` (but only if `isEnhanced`)
  const imagesOrError = shouldGetImages
    ? await getImages({
        params: worksPropsToImagesProps(apiProps),
        toggles: ctx.query.toggles,
      })
    : null;

  return {
    works: worksOrError,
    images: imagesOrError,
    worksRouteProps: params,
    unfilteredSearchResults,
    shouldGetWorks,
    apiProps,
  };
};

export default Works;
