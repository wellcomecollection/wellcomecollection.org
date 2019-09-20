// @flow
import { type Context } from 'next';
import { Fragment, useEffect, useState } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import {
  type CatalogueApiError,
  type CatalogueResultsList,
} from '@weco/common/model/catalogue';
import { font, grid, classNames } from '@weco/common/utils/classnames';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import { searchQueryParams } from '@weco/common/services/catalogue/search-params';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import BetaBar from '@weco/common/views/components/BetaBar/BetaBar';
import {
  trackSearch,
  SearchEventNames,
} from '@weco/common/views/components/Tracker/Tracker';
import RelevanceRater from '@weco/common/views/components/RelevanceRater/RelevanceRater';
import MessageBar from '@weco/common/views/components/MessageBar/MessageBar';
import StaticWorksContent from '../components/StaticWorksContent/StaticWorksContent';
import SearchForm from '../components/SearchForm/SearchForm';
import { getWorks } from '../services/catalogue/works';
import WorkCard from '../components/WorkCard/WorkCard';
import Space from '@weco/common/views/components/styled/Space';
import { formatDateForApi } from '@weco/common/utils/dates';
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import {
  onlineLocations,
  inLibraryLocations,
} from '@weco/common/views/components/FilterDrawerRefine/accessLocations';

type Props = {|
  works: ?CatalogueResultsList | CatalogueApiError,
|};

const globalDefaultWorkType = ['a', 'k', 'q', 'v', 'f', 's'];

const Works = ({ works }: Props) => {
  const [loading, setLoading] = useState(false);
  const params = searchQueryParams();
  const {
    query,
    workType,
    page,
    productionDatesFrom,
    productionDatesTo,
    _isFilteringBySubcategory,
    _queryType,
  } = params;

  const trackEvent = () => {
    if (query && query !== '') {
      const event = {
        event: SearchEventNames.Search,
        data: {
          query,
          page,
          workType,
          _queryType,
        },
      };
      trackSearch(event);
    }
  };

  // We have to have this for the initial page load, and have it on the router
  // change as the page doesnt actually re-render when the URL parameters change.
  useEffect(() => {
    trackEvent();
  }, []);

  useEffect(() => {
    function routeChangeStart(url: string) {
      setLoading(true);
    }
    function routeChangeComplete(url: string) {
      setLoading(false);
      trackEvent();
    }
    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      Router.events.off('routeChangeComplete', routeChangeComplete);
    };
  }, []);

  if (works && works.type === 'Error') {
    return (
      <ErrorPage
        title={
          works.httpStatus === 500
            ? `We're experiencing technical difficulties at the moment. We're working to get this fixed.`
            : undefined
        }
        statusCode={works.httpStatus}
      />
    );
  }

  const workTypes = [
    {
      title: 'Books',
      materialTypes: [
        { title: 'books', letter: 'a' },
        { title: 'e-books', letter: 'v' },
      ],
    },
    {
      title: 'Pictures',
      materialTypes: [
        { title: 'pictures', letter: 'k' },
        { title: 'digital images', letter: 'q' },
      ],
    },
    {
      title: 'Audio/Visual',
      materialTypes: [
        { title: 'e-videos', letter: 'f' },
        { title: 'e-sound', letter: 's' },
      ],
    },
  ];

  function arraysEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every(t => arr2.includes(t));
  }

  return (
    <Fragment>
      <Head>
        {works && works.prevPage && (
          <link
            rel="prev"
            href={convertUrlToString(
              worksUrl({ ...params, query, page: (page || 1) - 1 }).as
            )}
          />
        )}
        {works && works.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              worksUrl({ ...params, query, page: page + 1 }).as
            )}
          />
        )}
      </Head>

      <CataloguePageLayout
        title={`${query ? `${query} | ` : ''}Catalogue search`}
        description="Search through the Wellcome Collection image catalogue"
        url={worksUrl({ ...params, query, page }).as}
        openGraphType={'website'}
        jsonLd={{ '@type': 'WebPage' }}
        siteSection={'works'}
        imageUrl={null}
        imageAltText={null}
      >
        <InfoBanner
          text={[
            {
              type: 'paragraph',
              text: `Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`,
              spans: [],
            },
          ]}
          cookieName="WC_wellcomeImagesRedirect"
        />

        <Layout12>
          <TogglesContext.Consumer>
            {({ useStageApi }) =>
              useStageApi && (
                <MessageBar tagText="Dev alert">
                  You are using the stage catalogue API - data mileage may vary!
                </MessageBar>
              )
            }
          </TogglesContext.Consumer>
          <BetaBar />
        </Layout12>

        <Space
          v={{
            size: 'l',
            properties: ['padding-top', 'padding-bottom'],
          }}
          className={classNames(['row bg-cream'])}
        >
          <div className="container">
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
                  <>
                    {!works && (
                      <Space
                        as="h1"
                        v={{ size: 'm', properties: ['margin-bottom'] }}
                        className="h1"
                      >
                        Explore our collections
                      </Space>
                    )}
                  </>
                </Space>
              </div>
            </div>

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
                  compact={false}
                />
              </div>
            </div>
          </div>
        </Space>

        <TogglesContext.Consumer>
          {({ refineFiltersPrototype }) => (
            <>
              {!refineFiltersPrototype && works && (
                <Layout12>
                  <TabNav
                    items={[
                      {
                        text: 'All',
                        link: worksUrl({
                          ...params,
                          page: 1,
                          workType: globalDefaultWorkType,
                        }),
                        selected:
                          !!workType &&
                          arraysEqual(globalDefaultWorkType, workType),
                      },
                    ].concat(
                      workTypes.map(t => {
                        return {
                          text: t.title,
                          link: worksUrl({
                            ...params,
                            workType: t.materialTypes.map(m => m.letter),
                            page: 1,
                          }),
                          selected:
                            !!workType &&
                            arraysEqual(
                              t.materialTypes.map(m => m.letter),
                              workType
                            ),
                        };
                      })
                    )}
                  />
                </Layout12>
              )}
            </>
          )}
        </TogglesContext.Consumer>

        {!works && <StaticWorksContent />}

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
                    <div className="flex flex--h-space-between flex--v-center">
                      <Fragment>
                        <Paginator
                          currentPage={page || 1}
                          pageSize={works.pageSize}
                          totalResults={works.totalResults}
                          link={worksUrl({
                            ...params,
                          })}
                          onPageChange={async (event, newPage) => {
                            event.preventDefault();
                            const link = worksUrl({
                              ...params,
                              page: newPage,
                            });
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
                <div className="grid">
                  {works.results.map((result, i) => (
                    <div
                      key={result.id}
                      className={classNames({
                        [grid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
                      })}
                    >
                      <div
                        onClick={() => {
                          const event = {
                            event: SearchEventNames.SearchResultSelected,
                            data: {
                              id: result.id,
                              position: i,
                              query,
                              page,
                              workType,
                              _queryType,
                            },
                          };
                          trackSearch(event);
                        }}
                      >
                        <WorkCard
                          work={result}
                          params={{
                            ...params,
                          }}
                        />
                      </div>
                      <TogglesContext.Consumer>
                        {({ relevanceRating }) =>
                          relevanceRating && (
                            <RelevanceRater
                              id={result.id}
                              position={i}
                              query={query}
                              page={page}
                              workType={workType}
                              _queryType={_queryType}
                            />
                          )
                        }
                      </TogglesContext.Consumer>
                    </div>
                  ))}
                </div>
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
                            pageSize={works.pageSize}
                            totalResults={works.totalResults}
                            link={worksUrl({
                              ...params,
                            })}
                            onPageChange={async (event, newPage) => {
                              event.preventDefault();
                              const link = worksUrl({
                                page: newPage,
                                ...params,
                              });
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

        {works && works.results.length === 0 && (
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
                    {(_isFilteringBySubcategory ||
                      productionDatesFrom ||
                      productionDatesTo) && (
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

Works.getInitialProps = async (ctx: Context): Promise<Props> => {
  const query = ctx.query.query;
  const productionDatesFrom = formatDateForApi(ctx.query.productionDatesFrom);
  const productionDatesTo = formatDateForApi(ctx.query.productionDatesTo);
  const page = ctx.query.page ? parseInt(ctx.query.page, 10) : 1;

  const {
    useStageApi,
    unfilteredSearchResults,
    refineFiltersPrototype,
  } = ctx.query.toggles;
  const workTypeQuery = ctx.query.workType;
  const _queryType = ctx.query._queryType;
  const defaultWorkType = unfilteredSearchResults ? [] : globalDefaultWorkType;
  const workTypeFilter = workTypeQuery
    ? workTypeQuery.split(',').filter(Boolean)
    : defaultWorkType;
  const locationTypeQuery = ctx.query['items.locations.locationType'];
  const locationTypeFilter = locationTypeQuery
    ? locationTypeQuery.split(',').filter(Boolean)
    : [...onlineLocations, ...inLibraryLocations];

  const filters = {
    workType: workTypeFilter,
    'items.locations.locationType':
      unfilteredSearchResults || refineFiltersPrototype
        ? locationTypeFilter.map(code => encodeURIComponent(code))
        : onlineLocations,
    _queryType,
    ...(productionDatesFrom ? { productionDatesFrom } : {}),
    ...(productionDatesTo ? { productionDatesTo } : {}),
  };

  const shouldGetWorks = query && query !== '';

  const worksOrError = shouldGetWorks
    ? await getWorks({
        query,
        page,
        filters,
        env: useStageApi ? 'stage' : 'prod',
      })
    : null;

  return {
    works: worksOrError,
  };
};

export default Works;
