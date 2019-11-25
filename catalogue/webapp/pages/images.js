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
import { imagesUrl, workUrl } from '@weco/common/services/catalogue/urls';
import {
  apiSearchParamsSerialiser,
  unfilteredApiSearchParamsSerialiser,
  searchParamsDeserialiser,
  type SearchParams,
} from '@weco/common/services/catalogue/search-params';
import Space from '@weco/common/views/components/styled/Space';
import ExpandedImage from '../components/ExpandedImage/ExpandedImage';
import StaticWorksContent from '../components/StaticWorksContent/StaticWorksContent';
import SearchForm from '../components/SearchForm/SearchForm';
import { getWorks } from '../services/catalogue/works';
import ImageCard from '../components/ImageCard/ImageCard';
import {
  trackSearchResultSelected,
  trackSearch,
} from '@weco/common/views/components/Tracker/Tracker';

type Props = {|
  works: ?CatalogueResultsList | CatalogueApiError,
  searchParams: SearchParams,
|};

const Images = ({ works, searchParams }: Props) => {
  const [loading, setLoading] = useState(false);
  const [expandedImageId, setExpandedImageId] = useState('');
  const { query, page, productionDatesFrom, productionDatesTo } = searchParams;

  useEffect(() => {
    trackSearch({
      totalResults: works && works.totalResults ? works.totalResults : null,
    });
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
              imagesUrl({ ...searchParams, query, page: (page || 1) - 1 }).as
            )}
          />
        )}
        {works && works.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              imagesUrl({ ...searchParams, query, page: page + 1 }).as
            )}
          />
        )}
      </Head>

      <CataloguePageLayout
        title={`${query ? `${query} | ` : ''}Image search`}
        description="Search through the Wellcome Collection image catalogue"
        url={imagesUrl({ ...searchParams, query, page }).as}
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
                  placeholder="Search for images"
                  itemsUrl={imagesUrl}
                />
              </div>
            </div>
          </div>
        </Space>

        {!works && <StaticWorksContent itemsUrl={imagesUrl} />}

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
                          link={imagesUrl({
                            ...searchParams,
                          })}
                          onPageChange={async (event, newPage) => {
                            event.preventDefault();
                            const link = imagesUrl({
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
                  {works.results.map((result, i) => (
                    <div
                      key={result.id}
                      className={classNames({
                        [grid({ s: 6, m: 4, l: 3, xl: 2 })]: true,
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
                        <ImageCard
                          id={result.id}
                          image={{
                            contentUrl: result.thumbnail
                              ? result.thumbnail.url
                              : 'https://via.placeholder.com/1600x900?text=%20',
                            width: 300,
                            height: 300,
                            alt: result.title,
                          }}
                          title={result.title}
                          onClick={() => setExpandedImageId(result.id)}
                        />
                        {expandedImageId === result.id && (
                          <ExpandedImage
                            index={i}
                            title={result.title}
                            id={result.id}
                            workLink={workUrl({
                              ...searchParams,
                              id: result.id,
                            })}
                          />
                        )}
                      </div>
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
                            link={imagesUrl({
                              ...searchParams,
                            })}
                            onPageChange={async (event, newPage) => {
                              event.preventDefault();
                              const link = imagesUrl({
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

const IMAGES_LOCATION_TYPE = 'iiif-image';

Images.getInitialProps = async (ctx: Context): Promise<Props> => {
  const userParams = searchParamsDeserialiser(ctx.query);
  const params = {
    ...userParams,
    itemsLocationsLocationType: [IMAGES_LOCATION_TYPE],
  };

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
        pageSize: 24,
      })
    : null;

  return {
    works: worksOrError,
    searchParams: params,
  };
};

export default Images;
