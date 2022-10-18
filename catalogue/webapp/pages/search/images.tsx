import { useEffect, ReactElement, useContext, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import styled from 'styled-components';
import Head from 'next/head';

// Components
import ImageEndpointSearchResults from '@weco/catalogue/components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import CataloguePageLayout from '@weco/catalogue/components/CataloguePageLayout/CataloguePageLayout';
import Space from '@weco/common/views/components/styled/Space';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';

// Utils & Helpers
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { getImages } from '@weco/catalogue/services/catalogue/images';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import {
  fromQuery,
  ImagesProps,
  toLink,
} from '@weco/common/views/components/ImagesLink/ImagesLink';
import { imagesFilters } from '@weco/common/services/catalogue/filters';
import { getServerData } from '@weco/common/server-data';
import { pageDescriptions } from '@weco/common/data/microcopy';

// Types
import { CatalogueResultsList, Image } from '@weco/common/model/catalogue';
import SearchHeader from 'views/search/searchHeader';

type Props = {
  images?: CatalogueResultsList<Image>;
  imagesRouteProps: ImagesProps;
  pageview: Pageview;
};

const Wrapper = styled(Space).attrs({
  v: { size: 'xl', properties: ['margin-bottom'] },
})`
  background-color: ${props => props.theme.color('black')};
`;

const Images: NextPage<Props> = ({
  images,
  imagesRouteProps,
}): ReactElement<Props> => {
  // const [isLoading, setIsLoading] = useState(false); // For pagination
  const { query, page, color: colorFilter } = imagesRouteProps;
  const [selectedTab, setSelectedTab] = useState('images');

  // For pagination
  // useEffect(() => {
  //   function routeChangeStart() {
  //     setIsLoading(true);
  //   }
  //   function routeChangeComplete() {
  //     setIsLoading(false);
  //   }
  //   Router.events.on('routeChangeStart', routeChangeStart);
  //   Router.events.on('routeChangeComplete', routeChangeComplete);

  //   return () => {
  //     Router.events.off('routeChangeStart', routeChangeStart);
  //     Router.events.off('routeChangeComplete', routeChangeComplete);
  //   };
  // }, []);

  const filters = images
    ? imagesFilters({ images, props: imagesRouteProps })
    : [];

  const { setLink } = useContext(SearchContext);
  useEffect(() => {
    const link = toLink({ ...imagesRouteProps }, 'images_search_context');
    setLink(link);
  }, [imagesRouteProps]);

  return (
    <>
      <Head>
        {images?.prevPage && (
          <link
            rel="prev"
            href={convertUrlToString(
              toLink({ ...imagesRouteProps, page: (page || 1) - 1 }, 'unknown')
                .as
            )}
          />
        )}
        {images?.nextPage && (
          <link
            rel="next"
            href={convertUrlToString(
              toLink({ ...imagesRouteProps, page: page + 1 }, 'unknown').as
            )}
          />
        )}
      </Head>
      {/* TODO review if this needs updating */}
      <CataloguePageLayout
        title={`${query ? `${query} | ` : ''}Image search`}
        description={pageDescriptions.images}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        url={toLink({ ...imagesRouteProps, source: 'canonical_link' }).as}
        openGraphType="website"
        jsonLd={{ '@type': 'WebPage' }}
        siteSection="collections"
        image={undefined}
        apiToolbarLinks={
          images
            ? [
                {
                  id: 'catalogue-api-query',
                  label: 'Catalogue API query',
                  link: images._requestUrl,
                },
              ]
            : []
        }
        hideNewsletterPromo={true}
      >
        <div className="container">
          <SearchHeader
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          <Space
            v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
          >
            <h2 style={{ marginBottom: 0 }}>Filters</h2>
          </Space>
        </div>

        <Wrapper>
          {images?.results && images.results.length > 0 && (
            <div className="container">
              <Space
                v={{
                  size: 'l',
                  properties: ['padding-top', 'padding-bottom'],
                }}
                style={{ color: 'white' }}
              >
                <h2 style={{ marginBottom: 0 }}>Sort & Pagination</h2>
              </Space>
              <ImageEndpointSearchResults images={images} />
            </div>
          )}
          {images?.results.length === 0 && (
            <SearchNoResults
              query={query}
              hasFilters={!!colorFilter}
              color="white"
            />
          )}
        </Wrapper>
      </CataloguePageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const params = fromQuery(context.query);
    const aggregations = [
      'locations.license',
      'source.genres.label',
      'source.subjects.label',
      'source.contributors.agent.label',
    ];
    const apiProps = {
      ...params,
      aggregations,
    };
    const images = await getImages({
      params: apiProps,
      toggles: serverData.toggles,
      pageSize: 30,
    });

    if (images && images.type === 'Error') {
      return appError(context, images.httpStatus, 'Images API error');
    }

    return {
      props: removeUndefinedProps({
        serverData,
        images,
        imagesRouteProps: params,
        pageview: {
          name: 'images',
          properties: images
            ? {
                totalResults: images.totalResults,
              }
            : {},
        },
      }),
    };
  };

export default Images;
