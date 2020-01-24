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
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import RelevanceRater from '@weco/common/views/components/RelevanceRater/RelevanceRater';
import Space from '@weco/common/views/components/styled/Space';
import ExpandedImage from '../components/ExpandedImage/ExpandedImage';
import ImageCard from '../components/ImageCard/ImageCard';
import StaticWorksContent from '../components/StaticWorksContent/StaticWorksContent';
import SearchForm from '../components/SearchForm/SearchForm';
import { getWorks } from '../services/catalogue/works';
import WorkCard from '../components/WorkCard/WorkCard';
import {
  trackSearchResultSelected,
  trackSearch,
} from '@weco/common/views/components/Tracker/Tracker';
import OptIn from '@weco/common/views/components/OptIn/OptIn';
import cookies from 'next-cookies';
import {
  type TrackWorksParams,
  type WorksParams,
  worksParamsFromQuery,
  apiWorksParams,
  unfilteredApiWorksParams,
} from '@weco/common/services/catalogue/url-params';

type Props = {|
  works: ?CatalogueResultsList | CatalogueApiError,
  worksParams: WorksParams,
  unfilteredSearchResults: boolean,
  shouldGetWorks: boolean,
  trackParams: TrackWorksParams,
|};

const useFragmentInitialState = () => {
  const [state, setState] = useState('');
  useEffect(() => {
    if (window.location.hash) {
      setState(window.location.hash.slice(1));
    }
  }, []);
  return [state, setState];
};

const Works = ({
  works,
  worksParams,
  unfilteredSearchResults,
  shouldGetWorks,
  trackParams,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const {
    query,
    workType,
    page,
    productionDatesFrom,
    productionDatesTo,
  } = worksParams;
  const [expandedImageId, setExpandedImageId] = useFragmentInitialState();

  useEffect(() => {
    trackSearch(trackParams, {
      totalResults: works && works.totalResults ? works.totalResults : null,
    });
  }, [worksParams]);

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

  const isImageSearch = worksParams.search === 'images';
  const resultsGrid = isImageSearch
    ? { s: 6, m: 4, l: 3, xl: 2 }
    : { s: 12, m: 12, l: 12, xl: 12 };

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
              worksUrl({
                ...worksParams,
                query,
                page: (page || 1) - 1,
                source: 'linkmeta_tag',
              }).as
            )}
          />
        )}
        {works && works.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              worksUrl({
                ...worksParams,
                query,
                page: page + 1,
                source: 'linkmeta_tag',
              }).as
            )}
          />
        )}
      </Head>

      <CataloguePageLayout
        title={`${query ? `${query} | ` : ''}Catalogue search`}
        description="Search through the Wellcome Collection image catalogue"
        url={worksUrl({ ...worksParams, query, page, source: 'PageUrl' }).as}
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
                  worksParams={worksParams}
                  workTypeAggregations={
                    works && works.aggregations
                      ? works.aggregations.workType.buckets
                      : null
                  }
                />
              </div>
            </div>
          </div>
        </Space>

        {!works && <StaticWorksContent worksParams={worksParams} />}

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
                            ...worksParams,
                            source: 'paginator',
                          })}
                          onPageChange={async (event, newPage) => {
                            event.preventDefault();
                            const link = worksUrl({
                              ...worksParams,
                              page: newPage,
                              source: 'paginator',
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
                  {isImageSearch ? null : (
                    <div
                      className={classNames({
                        [grid({ s: 12, m: 8, l: 6, xl: 6 })]: true,
                      })}
                    >
                      <OptIn />
                    </div>
                  )}
                  {works.results.map((result, i) => (
                    <div
                      key={result.id}
                      className={classNames({
                        [grid(resultsGrid)]: true,
                      })}
                    >
                      <div
                        onClick={() => {
                          trackSearchResultSelected(trackParams, {
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
                        {isImageSearch ? (
                          <>
                            <ImageCard
                              id={result.id}
                              image={{
                                contentUrl: result.thumbnail
                                  ? result.thumbnail.url
                                  : 'https://via.placeholder.com/1600x900?text=%20',
                                width: 300,
                                height: 300,
                                alt: result.title,
                                tasl: null,
                              }}
                              onClick={() => setExpandedImageId(result.id)}
                            />
                            {expandedImageId === result.id && (
                              <ExpandedImage
                                index={i}
                                title={result.title}
                                id={result.id}
                                worksParams={worksParams}
                              />
                            )}
                          </>
                        ) : (
                          <WorkCard
                            work={result}
                            params={{
                              ...worksParams,
                              id: result.id,
                            }}
                          />
                        )}
                      </div>
                      <TogglesContext.Consumer>
                        {({ relevanceRating }) =>
                          relevanceRating &&
                          !isImageSearch && (
                            <RelevanceRater
                              id={result.id}
                              position={i}
                              query={query || ''}
                              page={page}
                              workType={workType}
                              trackParams={trackParams}
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
                              ...worksParams,
                              source: 'paginator',
                            })}
                            onPageChange={async (event, newPage) => {
                              event.preventDefault();
                              const link = worksUrl({
                                ...worksParams,
                                page: newPage,
                                source: 'paginator',
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

const IMAGES_LOCATION_TYPE = 'iiif-image';

Works.getInitialProps = async (ctx: Context): Promise<Props> => {
  const params = worksParamsFromQuery(ctx.query);
  const { unfilteredSearchResults } = ctx.query.toggles;
  const _queryType = cookies(ctx)._queryType;
  const isImageSearch = params.search === 'images';

  const apiWorksParamsFn = unfilteredSearchResults
    ? unfilteredApiWorksParams
    : apiWorksParams;

  const apiParams = apiWorksParamsFn(params, {
    'items.locations.locationType': isImageSearch
      ? [IMAGES_LOCATION_TYPE]
      : params.itemsLocationsLocationType,
    aggregations: ['workType'],
    _queryType,
  });

  const shouldGetWorks = Boolean(apiParams.query && apiParams.query !== '');
  const worksOrError = shouldGetWorks
    ? await getWorks({
        params: apiParams,
        pageSize: isImageSearch ? 24 : undefined,
      })
    : null;

  return {
    works: worksOrError,
    worksParams: params,
    unfilteredSearchResults,
    shouldGetWorks,
    trackParams: {
      ...apiParams,
      source: params.source,
    },
  };
};

export default Works;
