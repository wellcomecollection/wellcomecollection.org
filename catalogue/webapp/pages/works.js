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
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import {
  apiSearchParamsSerialiser,
  searchParamsDeserialiser,
  defaultWorkTypes,
  defaultItemsLocationsLocationType,
  type SearchParams,
} from '@weco/common/services/catalogue/search-params';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import {
  trackSearch,
  SearchEventNames,
} from '@weco/common/views/components/Tracker/Tracker';
import RelevanceRater from '@weco/common/views/components/RelevanceRater/RelevanceRater';
import Space from '@weco/common/views/components/styled/Space';
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import StaticWorksContent from '../components/StaticWorksContent/StaticWorksContent';
import SearchForm from '../components/SearchForm/SearchForm';
import { getWorks } from '../services/catalogue/works';
import WorkCard from '../components/WorkCard/WorkCard';
import OptIn from '@weco/common/views/components/OptIn/OptIn';

type Props = {|
  works: ?CatalogueResultsList | CatalogueApiError,
  searchParams: SearchParams,
|};

const Works = ({ works, searchParams }: Props) => {
  const [loading, setLoading] = useState(false);
  const {
    query,
    workType,
    page,
    productionDatesFrom,
    productionDatesTo,
    _queryType,
  } = searchParams;

  const trackEvent = () => {
    if (query && query !== '') {
      const event = {
        event: SearchEventNames.Search,
        data: {
          query,
          page,
          workType,
          'production.dates.from': productionDatesFrom,
          'production.dates.to': productionDatesTo,
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
      materialTypes: [{ title: 'books', letter: 'a' }],
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
        { title: 'video recordings', letter: 'g' },
        { title: 'sound', letter: 'i' },
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
              worksUrl({ ...searchParams, query, page: (page || 1) - 1 }).as
            )}
          />
        )}
        {works && works.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              worksUrl({ ...searchParams, query, page: page + 1 }).as
            )}
          />
        )}
      </Head>

      <CataloguePageLayout
        title={`${query ? `${query} | ` : ''}Catalogue search`}
        description="Search through the Wellcome Collection image catalogue"
        url={worksUrl({ ...searchParams, query, page }).as}
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
                  compact={false}
                  shouldShowFilters={query !== ''}
                  searchParams={searchParams}
                />
              </div>
            </div>
          </div>
        </Space>

        <TogglesContext.Consumer>
          {({ refineFiltersPrototype, unfilteredSearchResults }) => (
            <>
              {!refineFiltersPrototype && works && (
                <Layout12>
                  <TabNav
                    items={[
                      {
                        text: 'All',
                        link: worksUrl({
                          ...searchParams,
                          page: 1,
                          workType: unfilteredSearchResults
                            ? []
                            : defaultWorkTypes,
                          itemsLocationsLocationType: unfilteredSearchResults
                            ? []
                            : defaultItemsLocationsLocationType,
                        }),
                        selected:
                          !!workType &&
                          arraysEqual(
                            unfilteredSearchResults ? [] : defaultWorkTypes,
                            workType
                          ),
                      },
                    ].concat(
                      workTypes.map(t => {
                        return {
                          text: t.title,
                          link: worksUrl({
                            ...searchParams,
                            workType: t.materialTypes.map(m => m.letter),
                            itemsLocationsLocationType: unfilteredSearchResults
                              ? []
                              : defaultItemsLocationsLocationType,
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
                            ...searchParams,
                          })}
                          onPageChange={async (event, newPage) => {
                            event.preventDefault();
                            const link = worksUrl({
                              ...searchParams,
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
                  <OptIn
                    text={{
                      defaultMessage:
                        'Help us improve your search results Rate your search results by how relevant they are to you',
                      optedInMessage: 'opted in message',
                      optInCTA: 'opt in',
                      optOutCTA: 'opt out',
                    }}
                    cookieName={'toggle_relevanceRating'}
                  />
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
                              'production.dates.from': productionDatesFrom,
                              'production.dates.to': productionDatesTo,
                              resultWorkType: result.workType.label,
                              resultLanguage:
                                result.language && result.language.label,
                              resultIdentifiers: result.identifiers.map(
                                identifier => identifier.value
                              ),
                              resultSubjects: result.subjects.map(
                                subject => subject.label
                              ),
                            },
                          };
                          trackSearch(event);
                        }}
                      >
                        <WorkCard
                          work={result}
                          params={{
                            ...searchParams,
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
                              ...searchParams,
                            })}
                            onPageChange={async (event, newPage) => {
                              event.preventDefault();
                              const link = worksUrl({
                                ...searchParams,
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

Works.getInitialProps = async (ctx: Context): Promise<Props> => {
  const params = searchParamsDeserialiser(ctx.query);
  const filters = apiSearchParamsSerialiser(params);
  const shouldGetWorks = filters.query && filters.query !== '';
  const { searchWithNotes } = ctx.query.toggles;

  const toggledFilters = {
    ...filters,
    _queryType: searchWithNotes ? 'withNotes' : undefined,
  };

  const worksOrError = shouldGetWorks
    ? await getWorks({
        filters: toggledFilters,
      })
    : null;

  return {
    works: worksOrError,
    searchParams: params,
  };
};

export default Works;
