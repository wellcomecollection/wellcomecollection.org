// @flow
import { type Context } from 'next';
import { Fragment, useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import {
  type CatalogueApiError,
  type CatalogueResultsList,
} from '@weco/common/model/catalogue';
import { font, grid, spacing, classNames } from '@weco/common/utils/classnames';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import Icon from '@weco/common/views/components/Icon/Icon';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import BetaBar from '@weco/common/views/components/BetaBar/BetaBar';
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import SearchContext, {
  SearchProvider,
} from '../components/SearchContext/SearchContext';
import StaticWorksContent from '../components/StaticWorksContent/StaticWorksContent';
import SearchForm from '../components/SearchForm/SearchForm';
import { getWorks } from '../services/catalogue/works';
import WorkCard from '../components/WorkCard/WorkCard';

type Props = {|
  query: ?string,
  works: ?CatalogueResultsList | CatalogueApiError,
  page: ?number,
  workType: ?(string[]),
  itemsLocationsLocationType: ?(string[]),
|};

const WorksSearchProvider = ({
  works,
  query,
  page,
  workType,
  itemsLocationsLocationType,
}: Props) => (
  <SearchProvider
    initialState={{
      query: query || '',
      page: page || 1,
      workType,
      itemsLocationsLocationType,
    }}
  >
    <Works
      works={works}
      query={query}
      page={page}
      workType={workType}
      itemsLocationsLocationType={itemsLocationsLocationType}
    />
  </SearchProvider>
);

const Works = ({ works, query, page, itemsLocationsLocationType }: Props) => {
  const [loading, setLoading] = useState(false);
  const { setWorkType, workType } = useContext(SearchContext);

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
      <PageLayout
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
          text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`}
          cookieName="WC_wellcomeImagesRedirect"
        />

        <TogglesContext.Consumer>
          {({ booksRelease }) =>
            booksRelease && (
              <Layout12>
                <BetaBar />
              </Layout12>
            )
          }
        </TogglesContext.Consumer>

        <div
          className={classNames([
            'row bg-cream',
            spacing({ s: 3, m: 5 }, { padding: ['top'] }),
            spacing({ s: 3, m: 4, l: 6 }, { padding: ['bottom'] }),
          ])}
        >
          <div className="container">
            <div className="grid">
              <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                <div
                  className={classNames([
                    'flex flex--h-space-between flex--v-center flex--wrap',
                    spacing({ s: 2 }, { margin: ['bottom'] }),
                  ])}
                >
                  <TogglesContext.Consumer>
                    {({ booksRelease }) => (
                      <>
                        {booksRelease && !works && (
                          <h1
                            className={classNames([
                              font({ s: 'WB6', m: 'WB4' }),
                              spacing({ s: 2 }, { margin: ['bottom'] }),
                              spacing({ s: 4 }, { margin: ['right'] }),
                              spacing({ s: 0 }, { margin: ['top'] }),
                            ])}
                          >
                            Explore our collections
                          </h1>
                        )}
                        {!booksRelease && (
                          <h1
                            className={classNames([
                              font({ s: 'WB6', m: 'WB4' }),
                              spacing({ s: 2 }, { margin: ['bottom'] }),
                              spacing({ s: 4 }, { margin: ['right'] }),
                              spacing({ s: 0 }, { margin: ['top'] }),
                            ])}
                          >
                            Search our images
                          </h1>
                        )}
                      </>
                    )}
                  </TogglesContext.Consumer>

                  <TogglesContext.Consumer>
                    {({ booksRelease }) =>
                      !booksRelease && (
                        <div className="flex flex--v-center">
                          <Icon
                            name="underConstruction"
                            extraClasses={classNames({
                              [spacing({ s: 2 }, { margin: ['right'] })]: true,
                            })}
                          />
                          <p className="no-margin">
                            We’re improving how search works.{' '}
                            <a href="/works/progress">Find out more</a>.
                          </p>
                        </div>
                      )
                    }
                  </TogglesContext.Consumer>
                </div>
              </div>
            </div>

            <div className="grid">
              <div className={grid({ s: 12, m: 10, l: 8, xl: 8 })}>
                <TogglesContext.Consumer>
                  {({ booksRelease }) =>
                    booksRelease && (
                      <p
                        className={classNames({
                          [font({ s: 'HNL4', m: 'HNL3' })]: true,
                          'visually-hidden': Boolean(works),
                        })}
                        id="search-form-description"
                      >
                        Find thousands of freely licensed digital books,
                        artworks, photos and images of historical library
                        materials and museum objects.
                      </p>
                    )
                  }
                </TogglesContext.Consumer>

                <SearchForm
                  ariaDescribedBy="search-form-description"
                  compact={false}
                  works={works}
                />

                <TogglesContext.Consumer>
                  {({ booksRelease }) =>
                    !booksRelease && (
                      <p
                        className={classNames({
                          [spacing({ s: 4 }, { margin: ['top'] })]: true,
                          [font({ s: 'HNL4', m: 'HNL3' })]: true,
                          'visually-hidden': Boolean(works),
                        })}
                        id="search-form-description"
                      >
                        Find thousands of Creative Commons licensed images from
                        historical library materials and museum objects to
                        contemporary digital photographs.
                      </p>
                    )
                  }
                </TogglesContext.Consumer>
              </div>
            </div>
          </div>
        </div>

        {!works && <StaticWorksContent />}

        <TogglesContext.Consumer>
          {({ booksRelease }) =>
            booksRelease &&
            works && (
              <Layout12>
                <TabNav
                  large={true}
                  items={[
                    {
                      text: 'All',
                      link: worksUrl({
                        query,
                        workType: undefined,
                        itemsLocationsLocationType,
                        page: 1,
                      }),
                      selected: !workType,
                      onClick: event => {
                        setWorkType(undefined);
                      },
                    },
                    {
                      text: 'Books',
                      link: worksUrl({
                        query,
                        workType: ['a', 'v'],
                        itemsLocationsLocationType,
                        page: 1,
                      }),
                      selected: !!(
                        workType &&
                        (workType.indexOf('a') !== -1 &&
                          workType.indexOf('v') !== -1)
                      ),
                      onClick: event => {
                        setWorkType(['a', 'v']);
                      },
                    },
                    {
                      text: 'Pictures',
                      link: worksUrl({
                        query,
                        workType: ['k', 'q'],
                        itemsLocationsLocationType,
                        page: 1,
                      }),
                      selected: !!(
                        workType &&
                        (workType.indexOf('k') !== -1 &&
                          workType.indexOf('q') !== -1)
                      ),
                      onClick: event => {
                        setWorkType(['k', 'q']);
                      },
                    },
                  ]}
                />
              </Layout12>
            )
          }
        </TogglesContext.Consumer>

        {works && works.results.length > 0 && (
          <Fragment>
            <div
              className={`row ${spacing({ s: 3, m: 5 }, { padding: ['top'] })}`}
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
                            itemsLocationsLocationType,
                            page,
                          })}
                          onPageChange={async (event, newPage) => {
                            event.preventDefault();
                            const link = worksUrl({
                              query,
                              workType,
                              itemsLocationsLocationType,
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
            </div>

            <div
              className={`row ${spacing({ s: 4 }, { padding: ['top'] })}`}
              style={{ opacity: loading ? 0 : 1 }}
            >
              <div className="container">
                <div className="grid">
                  {works.results.map(result => (
                    <div
                      className={classNames({
                        [grid({ s: 12, m: 10, l: 8, xl: 8 })]: true,
                      })}
                      key={result.id}
                    >
                      <WorkCard
                        work={result}
                        query={query}
                        page={page}
                        workType={workType}
                        itemsLocationsLocationType={itemsLocationsLocationType}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`row ${spacing(
                  { s: 10 },
                  { padding: ['top', 'bottom'] }
                )}`}
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
                              itemsLocationsLocationType,
                              page,
                            })}
                            onPageChange={async (event, newPage) => {
                              event.preventDefault();
                              const link = worksUrl({
                                query,
                                workType,
                                itemsLocationsLocationType,
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
              </div>
            </div>
          </Fragment>
        )}

        {works && works.results.length === 0 && (
          <div className={`row ${spacing({ s: 4 }, { padding: ['top'] })}`}>
            <div className="container">
              <div className="grid">
                <div className={grid({ s: 12, m: 10, l: 8, xl: 8 })}>
                  <p className="h1">
                    We couldn{`'`}t find anything that matched{' '}
                    <span
                      className={classNames({
                        [font({ s: 'HNL1' })]: true,
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
          </div>
        )}
      </PageLayout>
    </Fragment>
  );
};

WorksSearchProvider.getInitialProps = async (ctx: Context): Promise<Props> => {
  const query = ctx.query.query;
  const page = ctx.query.page ? parseInt(ctx.query.page, 10) : 1;

  const {
    tabbedNavOnSearchForm = false,
    booksRelease = false,
    showCatalogueSearchFilters = false,
  } = ctx.query.toggles;
  const includeBooks =
    tabbedNavOnSearchForm || booksRelease || showCatalogueSearchFilters;

  const workTypeQuery = ctx.query.workType;
  const itemsLocationsLocationTypeQuery =
    ctx.query['items.locations.locationType'];

  const defaultWorkType = ['k', 'q'];
  const defaultItemsLocationsLocationType = ['iiif-image'];

  const defaultWorkTypeWithBooks = ['a', 'k', 'q', 'v'];
  const defaultItemsLocationsLocationTypeWithIIIFPresentation = [
    'iiif-image',
    'iiif-presentation',
  ];

  const workTypeFilter = workTypeQuery
    ? workTypeQuery.split(',').filter(Boolean)
    : includeBooks
    ? defaultWorkTypeWithBooks
    : defaultWorkType;

  const itemsLocationsLocationTypeFilter = itemsLocationsLocationTypeQuery
    ? itemsLocationsLocationTypeQuery.split(',').filter(Boolean)
    : includeBooks
    ? defaultItemsLocationsLocationTypeWithIIIFPresentation
    : defaultItemsLocationsLocationType;

  const filters = {
    workType: workTypeFilter,
    'items.locations.locationType': itemsLocationsLocationTypeFilter,
  };

  const worksOrError =
    query && query !== '' ? await getWorks({ query, page, filters }) : null;

  return {
    works: worksOrError,
    query,
    page,
    workType: workTypeQuery && workTypeQuery.split(',').filter(Boolean),
    itemsLocationsLocationType:
      itemsLocationsLocationTypeQuery &&
      itemsLocationsLocationTypeQuery.split(',').filter(Boolean),
  };
};

export default WorksSearchProvider;
