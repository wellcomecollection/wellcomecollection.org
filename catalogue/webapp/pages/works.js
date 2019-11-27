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
import { worksUrl } from '@weco/common/services/catalogue/urls';
import {
  apiSearchParamsSerialiser,
  unfilteredApiSearchParamsSerialiser,
  searchParamsDeserialiser,
  type SearchParams,
} from '@weco/common/services/catalogue/search-params';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import RelevanceRater from '@weco/common/views/components/RelevanceRater/RelevanceRater';
import Space from '@weco/common/views/components/styled/Space';
import StaticWorksContent from '../components/StaticWorksContent/StaticWorksContent';
import SearchForm from '../components/SearchForm/SearchForm';
import { getWorks, getWorkTypeAggregations } from '../services/catalogue/works';
import WorkCard from '../components/WorkCard/WorkCard';
import {
  trackSearchResultSelected,
  trackSearch,
} from '@weco/common/views/components/Tracker/Tracker';
import OptIn from '@weco/common/views/components/OptIn/OptIn';

type Props = {|
  works: ?CatalogueResultsList | CatalogueApiError,
  searchParams: SearchParams,
  toggledFilters: SearchParams,
  unfilteredSearchResults: boolean,
  shouldGetWorks: boolean,
|};

const Works = ({
  works,
  searchParams,
  toggledFilters,
  unfilteredSearchResults,
  shouldGetWorks,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [workTypeAggregations, setWorkTypeAggregations] = useState([]);
  const {
    query,
    workType,
    page,
    productionDatesFrom,
    productionDatesTo,
    _queryType,
  } = searchParams;

  const fetchAggregations = async () => {
    const workTypeAggregations = shouldGetWorks
      ? await getWorkTypeAggregations({
          unfilteredSearchResults,
          filters: toggledFilters,
        })
      : [];
    setWorkTypeAggregations(workTypeAggregations);
  };

  useEffect(() => {
    trackSearch({
      totalResults: works && works.totalResults ? works.totalResults : null,
    });
    fetchAggregations();
  }, [searchParams]);

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
                  workTypeAggregations={workTypeAggregations}
                />
              </div>
            </div>
          </div>
        </Space>

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
                  <div
                    className={classNames({
                      [grid({ s: 12, m: 8, l: 6, xl: 6 })]: true,
                    })}
                  >
                    <OptIn />
                  </div>
                  {works.results.map((result, i) => (
                    <div
                      key={result.id}
                      className={classNames({
                        [grid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
                      })}
                    >
                      <div
                        onClick={() => {
                          trackSearchResultSelected({
                            id: result.id,
                            position: i,
                            resultWorkType: result.workType.label,
                            resultLanguage:
                              result.language && result.language.label,
                            resultIdentifiers: result.identifiers.map(
                              identifier => identifier.value
                            ),
                            resultSubjects: result.subjects.map(
                              subject => subject.label
                            ),
                          });
                        }}
                      >
                        <WorkCard
                          work={result}
                          params={{
                            ...searchParams,
                            id: result.id,
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
  const { searchUsingAndOperator, unfilteredSearchResults } = ctx.query.toggles;
  const filters = unfilteredSearchResults
    ? unfilteredApiSearchParamsSerialiser(params)
    : apiSearchParamsSerialiser(params);

  const toggledFilters = {
    ...filters,
    _queryType: searchUsingAndOperator ? 'usingAnd' : undefined,
  };

  const shouldGetWorks = filters.query && filters.query !== '';
  const worksOrError = shouldGetWorks
    ? await getWorks({
        filters: toggledFilters,
      })
    : null;
  return {
    works: worksOrError,
    searchParams: params,
    unfilteredSearchResults,
    toggledFilters,
    shouldGetWorks,
  };
};

export default Works;
