// @flow
import { type Context } from 'next';
import { Fragment, useEffect, useState } from 'react';
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
import WorkPromo from '@weco/common/views/components/WorkPromo/WorkPromo';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { workUrl, worksUrl } from '@weco/common/services/catalogue/urls';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import StaticWorksContent from '../components/StaticWorksContent/StaticWorksContent';
import SearchForm from '../components/SearchForm/SearchForm';
import { getWorks } from '../services/catalogue/works';
import WorkCard from '../components/WorkCard/WorkCard';
import BetaBar from '@weco/common/views/components/BetaBar/BetaBar';

type Props = {|
  query: ?string,
  works: ?CatalogueResultsList | CatalogueApiError,
  page: ?number,
  workType: string[],
  itemsLocationsLocationType: string[],
  showCatalogueSearchFilters: boolean,
|};

export const Works = ({
  works,
  query,
  page,
  workType,
  itemsLocationsLocationType,
  showCatalogueSearchFilters,
}: Props) => {
  const [loading, setLoading] = useState(false);
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
          {({ betaBar }) =>
            betaBar && (
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
                  <h1
                    className={classNames([
                      font({ s: 'WB6', m: 'WB4' }),
                      spacing({ s: 2 }, { margin: ['bottom'] }),
                      spacing({ s: 4 }, { margin: ['right'] }),
                      spacing({ s: 0 }, { margin: ['top'] }),
                    ])}
                  >
                    {showCatalogueSearchFilters
                      ? 'Search our collections'
                      : 'Search our images'}
                  </h1>
                  <TogglesContext.Consumer>
                    {({ betaBar }) =>
                      !betaBar && (
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
                <SearchForm
                  initialQuery={query || ''}
                  initialWorkType={workType}
                  initialItemsLocationsLocationType={itemsLocationsLocationType}
                  ariaDescribedBy="search-form-description"
                  compact={false}
                  works={works}
                />
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
                {works && (
                  <p
                    className={classNames([
                      spacing({ s: 2 }, { margin: ['top', 'bottom'] }),
                      font({ s: 'LR3', m: 'LR2' }),
                    ])}
                  >
                    {works.totalResults !== 0 ? works.totalResults : 'No'}{' '}
                    results for &apos;{query}&apos;
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {!works && <StaticWorksContent />}

        {works && works.results.length > 0 && (
          <Fragment>
            <div
              className={`row ${spacing({ s: 3, m: 5 }, { padding: ['top'] })}`}
            >
              <div className="container">
                <div className="grid">
                  <div className="grid__cell">
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
                  <TogglesContext.Consumer>
                    {({ genericWorkCard }) => {
                      return genericWorkCard
                        ? works.results.map(result => (
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
                                itemsLocationsLocationType={
                                  itemsLocationsLocationType
                                }
                              />
                            </div>
                          ))
                        : works.results.map(result => (
                            <div
                              key={result.id}
                              className={grid({ s: 6, m: 4, l: 3, xl: 2 })}
                            >
                              <WorkPromo
                                id={result.id}
                                image={{
                                  contentUrl: result.thumbnail
                                    ? result.thumbnail.url
                                    : 'https://via.placeholder.com/1600x900?text=%20',
                                  width: 300,
                                  height: 300,
                                  alt: '',
                                }}
                                datePublished={
                                  result.createdDate && result.createdDate.label
                                }
                                title={result.title}
                                link={workUrl({ id: result.id, query, page })}
                              />
                            </div>
                          ));
                    }}
                  </TogglesContext.Consumer>
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
                    <div className="grid__cell">
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

Works.getInitialProps = async (ctx: Context): Promise<Props> => {
  const query = ctx.query.query;
  const page = ctx.query.page ? parseInt(ctx.query.page, 10) : 1;
  const { showCatalogueSearchFilters = false } = ctx.query.toggles;

  const defaultWorkType = ['k', 'q'];
  const workTypeQuery = ctx.query.workType;
  const workType = !showCatalogueSearchFilters
    ? defaultWorkType
    : !workTypeQuery
    ? []
    : workTypeQuery.split(',').filter(Boolean);

  const itemsLocationsLocationType =
    'items.locations.locationType' in ctx.query
      ? ctx.query['items.locations.locationType'].split(',')
      : showCatalogueSearchFilters
      ? []
      : ['iiif-image'];

  const filters = {
    'items.locations.locationType': itemsLocationsLocationType,
    workType: !showCatalogueSearchFilters
      ? defaultWorkType
      : workType.length === 0
      ? ['a', 'k', 'q']
      : workType,
  };

  const worksOrError =
    query && query !== '' ? await getWorks({ query, page, filters }) : null;

  return {
    works: worksOrError,
    query,
    page,
    workType,
    itemsLocationsLocationType,
    showCatalogueSearchFilters,
  };
};

export default Works;
