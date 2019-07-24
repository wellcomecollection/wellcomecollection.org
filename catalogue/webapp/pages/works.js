// @flow
import { type Context } from 'next';
import { Fragment, useEffect, useState, useContext } from 'react';
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
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import BetaBar from '@weco/common/views/components/BetaBar/BetaBar';
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import CatalogueSearchContext from '@weco/common/views/components/CatalogueSearchContext/CatalogueSearchContext';
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
import VerticalSpace from '@weco/common/views/components/styled/VerticalSpace';

type Props = {|
  query: ?string,
  works: ?CatalogueResultsList | CatalogueApiError,
  page: ?number,
  workType: ?(string[]),
|};

const WorksSearchProvider = ({ works, query, page, workType }: Props) => (
  <Works works={works} query={query} page={page} workType={workType} />
);

const Works = ({ works }: Props) => {
  const [loading, setLoading] = useState(false);
  const { query, page, workType, _queryType } = useContext(
    CatalogueSearchContext
  );
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

  return (
    <Fragment>
      <Head>
        {works && works.prevPage && (
          <link
            rel="prev"
            href={convertUrlToString(
              worksUrl({ query, page: (page || 1) - 1 }).as
            )}
          />
        )}
        {works && works.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(worksUrl({ query, page: page + 1 }).as)}
          />
        )}
      </Head>

      <CataloguePageLayout
        title={`${query ? `${query} | ` : ''}Catalogue search`}
        description="Search through the Wellcome Collection image catalogue"
        url={worksUrl({ query, page }).as}
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

        <VerticalSpace
          size="l"
          properties={['padding-top', 'padding-bottom']}
          className={classNames(['row bg-cream'])}
        >
          <div className="container">
            <div className="grid">
              <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                <VerticalSpace
                  size="m"
                  className={classNames([
                    'flex flex--h-space-between flex--v-center flex--wrap',
                  ])}
                >
                  <>
                    {!works && (
                      <VerticalSpace as="h1" size="m" className="h1">
                        Explore our collections
                      </VerticalSpace>
                    )}
                  </>
                </VerticalSpace>
              </div>
            </div>

            <div className="grid">
              <div className={grid({ s: 12, m: 10, l: 8, xl: 8 })}>
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
        </VerticalSpace>

        {!works && <StaticWorksContent />}

        {works && (
          <Layout12>
            <TogglesContext.Consumer>
              {({ audioVideoInSearch }) => {
                const items = [
                  {
                    text: 'All',
                    link: worksUrl({
                      query,
                      workType: undefined,
                      page: 1,
                    }),
                    selected: !workType,
                  },
                  {
                    text: 'Books',
                    link: worksUrl({
                      query,
                      workType: ['a', 'v'],
                      page: 1,
                    }),
                    selected: !!(
                      workType &&
                      (workType.indexOf('a') !== -1 &&
                        workType.indexOf('v') !== -1)
                    ),
                  },
                  {
                    text: 'Pictures',
                    link: worksUrl({
                      query,
                      workType: ['k', 'q'],
                      page: 1,
                    }),
                    selected: !!(
                      workType &&
                      (workType.indexOf('k') !== -1 &&
                        workType.indexOf('q') !== -1)
                    ),
                  },
                ];
                if (audioVideoInSearch) {
                  items.push({
                    text: 'Audio/Video',
                    link: worksUrl({
                      query,
                      workType: ['f', 's'],
                      page: 1,
                    }),
                    selected: !!(
                      workType &&
                      (workType.indexOf('f') !== -1 &&
                        workType.indexOf('s') !== -1)
                    ),
                  });
                }
                return <TabNav items={items} />;
              }}
            </TogglesContext.Consumer>
          </Layout12>
        )}

        {works && works.results.length > 0 && (
          <Fragment>
            <VerticalSpace size="l" properties={['padding-top']}>
              <div className="container">
                <div className="grid">
                  <div
                    className={classNames({
                      [grid({ s: 12, m: 10, l: 8, xl: 8 })]: true,
                    })}
                  >
                    <div className="flex flex--h-space-between flex--v-center">
                      <Fragment>
                        <Paginator
                          currentPage={page || 1}
                          pageSize={works.pageSize}
                          totalResults={works.totalResults}
                          link={worksUrl({
                            query,
                            workType,
                            page,
                          })}
                          onPageChange={async (event, newPage) => {
                            event.preventDefault();
                            const link = worksUrl({
                              query,
                              workType,
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
            </VerticalSpace>

            <VerticalSpace
              size="l"
              properties={['padding-top']}
              style={{ opacity: loading ? 0 : 1 }}
            >
              <div className="container">
                <div className="grid">
                  {works.results.map((result, i) => (
                    <div
                      key={result.id}
                      className={classNames({
                        [grid({ s: 12, m: 10, l: 8, xl: 8 })]: true,
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
                        <WorkCard work={result} />
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

              <VerticalSpace
                size="l"
                properties={['padding-top', 'padding-bottom']}
              >
                <div className="container">
                  <div className="grid">
                    <div
                      className={classNames({
                        [grid({ s: 12, m: 10, l: 8, xl: 8 })]: true,
                      })}
                    >
                      <div className="flex flex--h-space-between flex--v-center">
                        <Fragment>
                          <Paginator
                            currentPage={page || 1}
                            pageSize={works.pageSize}
                            totalResults={works.totalResults}
                            link={worksUrl({
                              query,
                              workType,
                              page,
                            })}
                            onPageChange={async (event, newPage) => {
                              event.preventDefault();
                              const link = worksUrl({
                                query,
                                workType,
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
              </VerticalSpace>
            </VerticalSpace>
          </Fragment>
        )}

        {works && works.results.length === 0 && (
          <VerticalSpace size="l" properties={['padding-top']}>
            <div className="container">
              <div className="grid">
                <div className={grid({ s: 12, m: 10, l: 8, xl: 8 })}>
                  <p className="h1">
                    We couldn{`'`}t find anything that matched{' '}
                    <span
                      className={classNames({
                        [font('hnl', 2)]: true,
                      })}
                      style={{ fontWeight: '400' }}
                    >
                      {query}
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </VerticalSpace>
        )}
      </CataloguePageLayout>
    </Fragment>
  );
};

WorksSearchProvider.getInitialProps = async (ctx: Context): Promise<Props> => {
  const query = ctx.query.query;
  const page = ctx.query.page ? parseInt(ctx.query.page, 10) : 1;

  const {
    useStageApi,
    searchCandidateQueryMsm,
    searchCandidateQueryBoost,
    searchCandidateQueryMsmBoost,
    audioVideoInSearch,
  } = ctx.query.toggles;
  const toggledQueryType = searchCandidateQueryMsm
    ? 'msm'
    : searchCandidateQueryBoost
    ? 'boost'
    : searchCandidateQueryMsmBoost
    ? 'msmboost'
    : null;
  const workTypeQuery = ctx.query.workType;
  const _queryType = ctx.query._queryType || toggledQueryType;
  const defaultWorkType = ['a', 'k', 'q', 'v'];
  const workTypeFilter = workTypeQuery
    ? workTypeQuery.split(',').filter(Boolean)
    : audioVideoInSearch
    ? defaultWorkType.concat(['f', 's'])
    : defaultWorkType;

  const filters = {
    workType: workTypeFilter,
    'items.locations.locationType': ['iiif-image', 'iiif-presentation'],
    _queryType,
  };

  const worksOrError =
    query && query !== ''
      ? await getWorks({
          query,
          page,
          filters,
          env: useStageApi ? 'stage' : 'prod',
        })
      : null;

  return {
    works: worksOrError,
    query,
    page,
    workType: workTypeQuery && workTypeQuery.split(',').filter(Boolean),
  };
};

export default WorksSearchProvider;
