import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState, ReactElement } from 'react';
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
  ImagesRouteProps,
  imagesLink,
  ImagesRoute,
  imagesRoutePropsToWorksRouteProps,
} from '@weco/common/services/catalogue/ts_routes';
import {
  ImagesApiProps,
  imagesRouteToApiUrl,
} from '@weco/common/services/catalogue/ts_api';
import Space from '@weco/common/views/components/styled/Space';
import ImageEndpointSearchResults from '../components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import { getImages } from '../services/catalogue/images';
import useSavedSearchState from '@weco/common/hooks/useSavedSearchState';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import SearchNoResults from '../components/SearchNoResults/SearchNoResults';
import {
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import { removeUndefinedProps } from '@weco/common/utils/json';
import SearchTitle from '../components/SearchTitle/SearchTitle';
import {
  appError,
  AppErrorProps,
  WithPageview,
} from '@weco/common/views/pages/_app';

type Props = {
  results?: CatalogueResultsList<Image> | CatalogueApiError;
  imagesRouteProps: ImagesRouteProps;
  apiProps: ImagesApiProps;
} & WithGlobalContextData &
  WithPageview;

type ImagesPaginationProps = {
  query?: string;
  page?: number;
  results: CatalogueResultsList<Image>;
  imagesRouteProps: ImagesRouteProps;
  setSavedSearchState: (state: ImagesRouteProps) => void;
  hideMobilePagination?: boolean;
};

const ImagesPagination = ({
  query,
  page,
  results,
  imagesRouteProps,
  setSavedSearchState,
  hideMobilePagination,
}: ImagesPaginationProps) => (
  <div className="flex flex--h-space-between flex--v-center flex--wrap">
    <Paginator
      query={query}
      showPortal={false}
      currentPage={page || 1}
      pageSize={results.pageSize}
      totalResults={results.totalResults}
      link={imagesLink(
        {
          ...imagesRouteProps,
        },
        'search/paginator'
      )}
      onPageChange={async (event, newPage) => {
        event.preventDefault();
        const state = {
          ...imagesRouteProps,
          page: newPage,
        };
        const link = imagesLink(state, 'search/paginator');
        setSavedSearchState(state);
        Router.push(link.href, link.as).then(() => window.scrollTo(0, 0));
      }}
      hideMobilePagination={hideMobilePagination}
    />
  </div>
);

const Images: NextPage<Props> = ({
  results,
  imagesRouteProps,
  apiProps,
  globalContextData,
}: Props): ReactElement<Props> => {
  const [loading, setLoading] = useState(false);
  const [, setSavedSearchState] = useSavedSearchState(imagesRouteProps);
  const { query, page, color } = imagesRouteProps;
  useEffect(() => {
    function routeChangeStart() {
      setLoading(true);
    }
    function routeChangeComplete() {
      setLoading(false);
    }
    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      Router.events.off('routeChangeComplete', routeChangeComplete);
    };
  }, []);

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
        {results?.type === 'ResultList' && results.prevPage && (
          <link
            rel="prev"
            href={convertUrlToString(
              imagesLink(
                { ...imagesRouteProps, page: (page || 1) - 1 },
                'meta_link'
              ).as
            )}
          />
        )}
        {results?.type === 'ResultList' && results.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              imagesLink({ ...imagesRouteProps, page: page + 1 }, 'meta_link')
                .as
            )}
          />
        )}
      </Head>
      <CataloguePageLayout
        title={`${query ? `${query} | ` : ''}image search`}
        description="Search Wellcome Collection images"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        url={imagesLink({ ...imagesRouteProps }, 'canonical_link').as}
        openGraphType={'website'}
        jsonLd={{ '@type': 'WebPage' }}
        siteSection={'collections'}
        imageUrl={null}
        imageAltText={null}
        globalContextData={globalContextData}
      >
        <Space
          v={{
            size: 'l',
            properties: ['padding-bottom'],
          }}
          className={classNames(['row'])}
        >
          <div className="container">
            {!results && <SearchTitle />}

            <div className="grid">
              <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                <SearchTabs
                  worksRouteProps={imagesRoutePropsToWorksRouteProps(
                    imagesRouteProps
                  )}
                  imagesRouteProps={imagesRouteProps}
                  workTypeAggregations={[]}
                  shouldShowDescription={query === ''}
                  activeTabIndex={1}
                  shouldShowFilters={true}
                  showSortBy={Boolean(results)}
                />
              </div>
            </div>
          </div>
        </Space>
        {results?.type === 'ResultList' && results.results.length > 0 && (
          <>
            <Space v={{ size: 'l', properties: ['padding-top'] }}>
              <div className="container">
                <div className="grid">
                  <div
                    className={classNames({
                      [grid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
                    })}
                  >
                    <ImagesPagination
                      query={query}
                      page={page}
                      results={results}
                      imagesRouteProps={imagesRouteProps}
                      setSavedSearchState={setSavedSearchState}
                      hideMobilePagination={true}
                    />
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
                {results && (
                  <ImageEndpointSearchResults
                    images={results}
                    apiProps={apiProps}
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
                      <ImagesPagination
                        query={query}
                        page={page}
                        results={results}
                        imagesRouteProps={imagesRouteProps}
                        setSavedSearchState={setSavedSearchState}
                      />
                    </div>
                  </div>
                </div>
              </Space>
            </Space>
          </>
        )}
        {results?.type === 'ResultList' && results.results.length === 0 && (
          <SearchNoResults query={query} hasFilters={!!color} />
        )}
      </CataloguePageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  const globalContextData = getGlobalContextData(context);
  const params = ImagesRoute.fromQuery(context.query);
  const apiProps = imagesRouteToApiUrl(params);
  const hasQuery = !!(params.query && params.query !== '');
  const imagesOrError = hasQuery
    ? await getImages({
        params,
        toggles: context.query.toggles,
      })
    : undefined;

  if (imagesOrError && imagesOrError.type === 'Error') {
    return appError(context, imagesOrError.statusCode, 'Images API error');
  }

  return {
    props: removeUndefinedProps({
      results: imagesOrError,
      imagesRouteProps: params,
      apiProps,
      globalContextData,
      pageview: {
        // This is just like this for now until we move to the `/images` endpoint
        name: 'images',
        properties: imagesOrError
          ? {
              totalResults: imagesOrError.totalResults,
            }
          : {},
      },
    }),
  };
};

export default Images;
