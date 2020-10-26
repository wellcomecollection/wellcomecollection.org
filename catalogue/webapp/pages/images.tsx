import { NextPageContext } from 'next';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import {
  CatalogueApiError,
  CatalogueResultsList,
  Image,
} from '@weco/common/model/catalogue';
import { grid, classNames } from '@weco/common/utils/classnames';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import {
  WorksRouteProps,
  imagesLink,
  ImagesRoute,
} from '@weco/common/services/catalogue/ts_routes';
import {
  CatalogueWorksApiProps,
  worksRouteToApiUrl,
  worksPropsToImagesProps,
} from '@weco/common/services/catalogue/api';
import Space from '@weco/common/views/components/styled/Space';
import ImageEndpointSearchResults from '../components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import SearchForm from '@weco/common/views/components/SearchForm/SearchForm';
import { getImages } from '../services/catalogue/images';
import { trackSearch } from '@weco/common/views/components/Tracker/Tracker';
import cookies from 'next-cookies';
import useSavedSearchState from '@weco/common/hooks/useSavedSearchState';
import useHotjar from '@weco/common/hooks/useHotjar';

type Props = {
  images: CatalogueResultsList<Image> | CatalogueApiError;
  worksRouteProps: WorksRouteProps;
  apiProps: CatalogueWorksApiProps;
};

const ImagesPagination = ({
  page,
  results,
  worksRouteProps,
  setSavedSearchState,
}) => (
  <Paginator
    currentPage={page || 1}
    pageSize={results.pageSize}
    totalResults={results.totalResults}
    link={imagesLink(
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
      const link = imagesLink(state, 'search/paginator');
      setSavedSearchState(state);
      Router.push(link.href, link.as).then(() => window.scrollTo(0, 0));
    }}
  />
);

const Images = ({ images, worksRouteProps, apiProps }: Props) => {
  const [loading, setLoading] = useState(false);
  const [, setSavedSearchState] = useSavedSearchState(worksRouteProps);
  const results: CatalogueResultsList<Image> | CatalogueApiError = images;

  const { query, page } = worksRouteProps;

  useEffect(() => {
    trackSearch(apiProps, {
      totalResults: results.type === 'ResultList' ? results?.totalResults : 0,
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

  useHotjar();

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
    <>
      <Head>
        {results.type === 'ResultList' && results.prevPage && (
          <link
            rel="prev"
            href={convertUrlToString(
              imagesLink(
                { ...worksRouteProps, page: (page || 1) - 1 },
                'meta_link'
              ).as
            )}
          />
        )}
        {results.type === 'ResultList' && results.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              imagesLink({ ...worksRouteProps, page: page + 1 }, 'meta_link').as
            )}
          />
        )}
      </Head>

      <CataloguePageLayout
        title={`${query ? `${query} | ` : ''}image search`}
        description="Search Wellcome Collection images"
        url={imagesLink({ ...worksRouteProps }, 'canonical_link').as}
        openGraphType={'website'}
        jsonLd={{ '@type': 'WebPage' }}
        siteSection={'collections'}
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
            <div className="grid">
              <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                <SearchForm
                  ariaDescribedBy="search-form-description"
                  shouldShowFilters={query !== ''}
                  worksRouteProps={worksRouteProps}
                  workTypeAggregations={[]}
                  aggregations={undefined}
                />
              </div>
            </div>
          </div>
        </Space>

        {results.type === 'ResultList' && results.results.length > 0 && (
          <>
            <Space v={{ size: 'l', properties: ['padding-top'] }}>
              <div className="container">
                <div className="grid">
                  <div
                    className={classNames({
                      [grid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
                    })}
                  >
                    <div className="flex flex--h-space-between flex--v-center">
                      <ImagesPagination
                        page={page}
                        results={results}
                        worksRouteProps={worksRouteProps}
                        setSavedSearchState={setSavedSearchState}
                      />
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
                {images && images.type !== 'Error' && (
                  <ImageEndpointSearchResults
                    images={images}
                    apiProps={worksPropsToImagesProps(apiProps)}
                  />
                )}
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
                        <ImagesPagination
                          page={page}
                          results={results}
                          worksRouteProps={worksRouteProps}
                          setSavedSearchState={setSavedSearchState}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Space>
            </Space>
          </>
        )}
      </CataloguePageLayout>
    </>
  );
};

Images.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const params = ImagesRoute.fromQuery(ctx.query);
  const { enableColorFiltering } = ctx.query.toggles;
  const _queryType = cookies(ctx)._queryType;
  const aggregations = ['workType', 'locationType'];
  const apiProps = worksRouteToApiUrl(params, {
    _queryType,
    aggregations,
  });

  const hasQuery = !!(params.query && params.query !== '');
  const imagesOrError = hasQuery
    ? await getImages({
        params: {
          ...worksPropsToImagesProps(apiProps),
          color: enableColorFiltering ? params.imagesColor : undefined,
        },
        toggles: ctx.query.toggles,
      })
    : null;

  return {
    images: imagesOrError,
    worksRouteProps: params,
    apiProps,
  };
};

export default Images;
