import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';
import { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import { arrow } from '@weco/common/icons';
import { getServerData } from '@weco/common/server-data';
import {
  ServerDataContext,
  useToggles,
} from '@weco/common/server-data/Context';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import { font } from '@weco/common/utils/classnames';
import { formatNumber } from '@weco/common/utils/grammar';
import { serialiseProps } from '@weco/common/utils/json';
import {
  decodeQuery,
  FromCodecMap,
  stringCodec,
} from '@weco/common/utils/routes';
import { getQueryResults } from '@weco/common/utils/search';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import Divider from '@weco/common/views/components/Divider';
import Icon from '@weco/common/views/components/Icon';
import { Container } from '@weco/common/views/components/styled/Container';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import CatalogueImageGallery from '@weco/content/components/CatalogueImageGallery';
import ContentSearchResult from '@weco/content/components/ContentSearchResult';
import Pagination from '@weco/content/components/Pagination';
import SearchNoResults from '@weco/content/components/SearchNoResults';
import { getSearchLayout } from '@weco/content/components/SearchPageLayout';
import { toLink as imagesLink } from '@weco/content/components/SearchPagesLink/Images';
import { toLink as worksLink } from '@weco/content/components/SearchPagesLink/Works';
import {
  WellcomeAggregation,
  WellcomeApiError,
} from '@weco/content/services/wellcome';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import {
  CatalogueResultsList,
  Image,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import { getAddressables } from '@weco/content/services/wellcome/content/all';
import {
  Addressable,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';
import { Query } from '@weco/content/types/search';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import { looksLikeSpam } from '@weco/content/utils/spam-detector';

const WorksLink = styled.a.attrs({
  className: font('intr', 6),
})`
  border: 2px solid;
  padding: 4px 12px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export type WorkTypes = {
  workTypeBuckets: WellcomeAggregation['buckets'] | undefined;
  totalResults: number;
  requestUrl: string;
};
/**
 * Takes query result and checks for errors to log before returning required data.
 * @param {string} categoryName - e.g. works
 * @param queryResults - Original result from query
 */
export function getQueryWorkTypeBuckets({
  categoryName,
  queryResults,
}: {
  categoryName: string;
  queryResults: CatalogueResultsList<Work> | WellcomeApiError;
}): WorkTypes | undefined {
  if (queryResults.type === 'Error') {
    console.error(queryResults.label + ': Error fetching ' + categoryName);
  } else {
    return {
      workTypeBuckets: queryResults.aggregations?.workType.buckets,
      totalResults: queryResults.totalResults,
      requestUrl: queryResults._requestUrl,
    };
  }
}

// Creating this version of fromQuery for the overview page only
// No filters or pagination required.
const codecMap = { query: stringCodec };
type CodecMapProps = FromCodecMap<typeof codecMap>;
const fromQuery: (params: ParsedUrlQuery) => CodecMapProps = params => {
  return decodeQuery<CodecMapProps>(params, codecMap);
};

type Props = {
  contentResults?: ContentResultsList<Addressable>;
  query: Query;
  pageview: Pageview;
  contentQueryFailed?: boolean;
};

type ImageResults = {
  totalResults: number;
  results: (Image & { src: string; width: number; height: number })[];
  requestUrl?: string;
};

type CatalogueResults = {
  works?: WorkTypes;
  images?: ImageResults;
};

const CatalogueResultsInner = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  position: relative;
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const CatalogueResultsSection = styled(Space).attrs({
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})``;

const CatalogueLinks = styled(Space).attrs({
  $v: { size: 'm', properties: ['margin-top', 'margin-bottom'] },
  className: 'is-hidden-s is-hidden-m',
})`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const ImageLinks = styled(Space).attrs({
  className: 'is-hidden-s is-hidden-m',
})<{ $isSmallGallery?: boolean }>`
  ${props => `margin-left: ${props.$isSmallGallery ? '16px' : '20px'}`};
  ${props => `margin-right: ${props.$isSmallGallery ? '16px' : '20px'}`};
`;

const BasicSection = styled(Space).attrs({
  as: 'section',
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})``;

const CatalogueSectionTitle = styled(Space).attrs<{
  $isSmallGallery?: boolean;
}>(props => ({
  as: 'h3',
  className: `${font('intsb', 4)} is-hidden-s is-hidden-m`,
  $v: props.$isSmallGallery
    ? { size: 'm', properties: ['margin-bottom'] }
    : undefined,
}))<{ $isSmallGallery?: boolean }>`
  ${props => !props.$isSmallGallery && `margin-bottom: 0;`}
`;

const AllLink = styled.a.attrs({
  className: font('intsb', 5),
})`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  .icon {
    margin-left: 8px;
  }
`;

const GridContainer = styled(Container)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

const ContentResults = styled.div`
  grid-column: 1 / 13;

  ${props => props.theme.media('medium')`
    grid-column: 1 / 10;
  `}

  ${props => props.theme.media('large')`
    grid-row: 1;
    grid-column: 1 / 8;
  `}
`;

const CatalogueResults = styled(Space).attrs({
  $v: { size: 'xl', properties: ['margin-bottom'] },
})<{ $fullWidth: boolean }>`
  grid-column: 1 / 13;

  ${props => props.theme.media('medium')`
    grid-column: 1 / 10;
  `}

  ${props =>
    props.theme.media('large')(`
      grid-column: ${props.$fullWidth ? '1' : '9'}/13;
    `)}
`;

const LoaderContainer = styled.div<{ $fullWidth: boolean }>`
  grid-column: 6;

  ${props => props.theme.media('medium')`
    grid-column: 6;
  `}

  ${props =>
    props.theme.media('large')(
      `grid-column: ${props.$fullWidth ? '6' : '10'};`
    )}
`;

export const SearchPage: NextPageWithLayout<Props> = ({
  contentResults,
  contentQueryFailed,
  query,
}) => {
  const { query: queryString } = query;
  const { extraApiToolbarLinks, setExtraApiToolbarLinks } = useSearchContext();
  const { apiToolbar } = useToggles();
  const params = fromQuery(query);
  const data = useContext(ServerDataContext);
  const { setLink } = useSearchContext();
  const [clientSideWorkTypes, setClientSideWorkTypes] = useState<
    WorkTypes | undefined
  >(undefined);
  const [clientSideImages, setClientSideImages] = useState<
    ImageResults | undefined
  >(undefined);

  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isLoadingWorks, setIsLoadingWorks] = useState(true);
  const [isCatalogueLoading, setIsCatalogueLoading] = useState(true);

  const totalWorksResults = clientSideWorkTypes?.totalResults || 0;
  const totalImagesResults = clientSideImages?.totalResults || 0;
  const totalContentResults = contentResults?.totalResults || 0;
  const totalCatalogueResults = totalWorksResults + totalImagesResults;
  const totalResults = totalContentResults + totalCatalogueResults;
  const isSmallGallery =
    clientSideImages && clientSideImages.results.length < 3;
  const pathname = usePathname();

  useMemo(() => {
    setIsCatalogueLoading(true);
  }, [contentResults?.totalResults]);

  async function fetchWorks() {
    try {
      setIsLoadingWorks(true);

      const worksResults = await getWorks({
        params: {
          ...params,
          aggregations: ['workType'],
        },
        pageSize: 1,
        toggles: data.toggles,
      });

      const workTypeBuckets = getQueryWorkTypeBuckets({
        categoryName: 'works',
        queryResults: worksResults,
      });

      setClientSideWorkTypes(() => {
        setIsLoadingWorks(false);
        return workTypeBuckets;
      });
    } catch (e) {
      setIsLoadingWorks(false);

      return undefined;
    }
  }

  async function fetchImages() {
    try {
      setIsLoadingImages(true);

      const imagesResults = await getImages({
        params,
        pageSize: 7,
        toggles: data.toggles,
      });

      const images = getQueryResults({
        categoryName: 'images',
        queryResults: imagesResults,
      });

      setClientSideImages(() => {
        setIsLoadingImages(false);
        return {
          totalResults: images?.totalResults || 0,
          results:
            images?.pageResults.map(image => ({
              ...image,
              src: image.locations[0].url,
              width: (image.aspectRatio || 1) * 100,
              height: 100,
            })) || [],
          requestUrl: images?.requestUrl,
        };
      });
    } catch (e) {
      setIsLoadingImages(false);
      return undefined;
    }
  }

  useEffect(() => {
    const pathname = '/search';
    setLink({
      href: { pathname, query },
      as: { pathname, query },
    });

    setIsCatalogueLoading(true);

    fetchWorks();
    fetchImages();
  }, [query]);

  useEffect(() => {
    if (apiToolbar && !isCatalogueLoading) {
      const getImagesLinks = () => {
        if (
          clientSideImages?.requestUrl &&
          !extraApiToolbarLinks.find(link => link.id === 'catalogue-api-images')
        ) {
          return {
            id: 'catalogue-api-images',
            label: 'Images API query',
            link: clientSideImages.requestUrl,
          };
        }
      };

      const getWorksLinks = () => {
        if (
          clientSideWorkTypes &&
          !extraApiToolbarLinks.find(link => link.id === 'catalogue-api-works')
        ) {
          return {
            id: 'catalogue-api-works',
            label: 'Works API query',
            link: clientSideWorkTypes.requestUrl,
          };
        }
      };

      setExtraApiToolbarLinks(
        [getImagesLinks(), getWorksLinks()].filter(isNotUndefined)
      );
    }
  }, [clientSideWorkTypes, clientSideImages, isCatalogueLoading]);

  useEffect(() => {
    if ((isLoadingImages || isLoadingWorks) && !isCatalogueLoading) {
      setIsCatalogueLoading(true);
    }
    if (!isLoadingImages && !isLoadingWorks && isCatalogueLoading) {
      setIsCatalogueLoading(false);
    }
  }, [isLoadingImages, isLoadingWorks]);

  return (
    <main>
      {totalResults === 0 && !isCatalogueLoading ? (
        <Container>
          <SearchNoResults query={queryString} />
        </Container>
      ) : (
        <BasicSection>
          <Container>
            <p className={font('intr', 5)}>
              {contentQueryFailed ? (
                <>
                  There was a problem fetching some search results. Please try
                  again. If the problem persists, please contact us.
                </>
              ) : (
                <>
                  {formatNumber(totalResults)} result
                  {totalResults === 1 ? '' : 's'}
                  {queryString && (
                    <>
                      {' '}
                      for <span className={font('intb', 5)}>{queryString}</span>
                    </>
                  )}
                </>
              )}
            </p>
          </Container>

          <GridContainer>
            {isCatalogueLoading && (
              <LoaderContainer $fullWidth={!contentResults?.totalResults}>
                <LL $position="relative" />
              </LoaderContainer>
            )}

            {!isCatalogueLoading && totalCatalogueResults > 0 && (
              <CatalogueResults $fullWidth={!contentResults?.totalResults}>
                <CatalogueResultsInner>
                  <Space
                    className="is-hidden-l is-hidden-xl"
                    $v={{ size: 'l', properties: ['margin-bottom'] }}
                    $h={{
                      size: 'm',
                      properties: ['margin-left', 'margin-right'],
                    }}
                  >
                    <h3 className={font('intsb', 4)}>
                      Are you looking for our online collections?
                    </h3>
                  </Space>

                  {!!clientSideWorkTypes?.totalResults && (
                    <CatalogueResultsSection>
                      <CatalogueSectionTitle>
                        Catalogue results
                      </CatalogueSectionTitle>
                      <CatalogueLinks>
                        {clientSideWorkTypes.workTypeBuckets
                          ?.slice(0, 6)
                          .map((bucket, i) => (
                            <NextLink
                              key={i}
                              {...worksLink(
                                {
                                  query: queryString,
                                  workType: [bucket.data.id],
                                },
                                `works_workType_${pathname}`
                              )}
                              passHref
                              legacyBehavior
                            >
                              <WorksLink>
                                {bucket.data.label} (
                                {formatNumber(bucket.count, {
                                  isCompact: true,
                                })}
                                )
                              </WorksLink>
                            </NextLink>
                          ))}
                      </CatalogueLinks>

                      <NextLink
                        {...worksLink(
                          {
                            query: queryString,
                          },
                          `works_all_${pathname}`
                        )}
                        passHref
                        legacyBehavior
                      >
                        <AllLink data-gtm-trigger="all-catalogue-results">
                          {`All catalogue results (${formatNumber(totalWorksResults, { isCompact: true })})`}
                          <Icon icon={arrow} iconColor="black" rotate={360} />
                        </AllLink>
                      </NextLink>
                    </CatalogueResultsSection>
                  )}

                  {totalWorksResults > 0 && totalImagesResults > 0 && (
                    <Space
                      className="is-hidden-s is-hidden-m"
                      $v={{
                        size: 'l',
                        properties: ['margin-top', 'margin-bottom'],
                      }}
                      $h={{
                        size: 'm',
                        properties: ['margin-left', 'margin-right'],
                      }}
                    >
                      <Divider lineColor="neutral.400" />
                    </Space>
                  )}

                  {!!clientSideImages?.totalResults && (
                    <>
                      <CatalogueSectionTitle
                        $h={{
                          size: 'm',
                          properties: ['margin-left', 'margin-right'],
                        }}
                        $isSmallGallery={isSmallGallery}
                        $v={{
                          size: 'm',
                          properties: ['margin-bottom'],
                        }}
                      >
                        Image results
                      </CatalogueSectionTitle>
                      <ImageLinks $isSmallGallery={isSmallGallery}>
                        <CatalogueImageGallery
                          images={clientSideImages.results}
                          targetRowHeight={120}
                          variant="justified"
                        />
                      </ImageLinks>
                      <CatalogueResultsSection>
                        <NextLink
                          {...imagesLink(
                            {
                              query: queryString,
                            },
                            `images_all_${pathname}`
                          )}
                          passHref
                          legacyBehavior
                        >
                          <AllLink data-gtm-trigger="all-image-results">
                            {`All image results (${formatNumber(totalImagesResults, { isCompact: true })})`}
                            <Icon icon={arrow} iconColor="black" rotate={360} />
                          </AllLink>
                        </NextLink>
                      </CatalogueResultsSection>
                    </>
                  )}
                </CatalogueResultsInner>
              </CatalogueResults>
            )}

            {contentResults && (
              <ContentResults data-testid="search-content-results">
                {contentResults?.results?.map((result, index) => (
                  <Space
                    key={`${result.id}${result.highlightTourType || ''}`}
                    $v={{ size: 'xl', properties: ['margin-bottom'] }}
                  >
                    <ContentSearchResult
                      {...result}
                      positionInList={index + 1}
                    />
                  </Space>
                ))}

                {!!contentResults?.totalPages && (
                  <Pagination
                    totalPages={contentResults.totalPages}
                    ariaLabel="Content search results pagination"
                    isHiddenMobile={false}
                  />
                )}
              </ContentResults>
            )}
          </GridContainer>
        </BasicSection>
      )}
    </main>
  );
};

SearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res, cacheTTL.search);
  const serverData = await getServerData(context);
  const query = context.query;

  const pageview: Pageview = {
    name: 'search',
    properties: {},
  };

  const defaultProps = {
    serverData,
    query,
    pageview,
  };

  // If the request looks like spam, return a 400 error and skip actually fetching
  // the data from the APIs.
  //
  // Users will still see a meaningful error page with instructions about tweaking
  // their query/telling us if they expected results, but they won't be causing load
  // on our back-end APIs.
  //
  // The status code will also allow us to filter out spam-like requests from our analytics.
  if (looksLikeSpam(query.query)) {
    context.res.statusCode = 400;
    return {
      props: serialiseProps({
        ...defaultProps,
        pageview: {
          name: 'search',
          properties: {
            looksLikeSpam: 'true',
          },
        },
      }),
    };
  }

  try {
    let contentQueryFailed = false;

    // All/Addressables
    const contentResults = await getAddressables({
      params: query,
      pageSize: 20,
      toggles: serverData.toggles,
    });

    if (contentResults.type === 'Error') {
      contentQueryFailed = true;
      console.error(contentResults.label + ': Error fetching addressables');
    }

    const apiToolbarLinks = [
      contentResults && contentResults.type !== 'Error'
        ? {
            id: 'content-api',
            label: 'Content API query',
            link: contentResults._requestUrl,
          }
        : undefined,
    ].filter(isNotUndefined);

    return {
      props: serialiseProps({
        ...defaultProps,
        ...(contentResults?.type !== 'Error' && {
          contentResults,
        }),
        contentQueryFailed,
        apiToolbarLinks,
      }),
    };
  } catch (error) {
    console.error(error);
    return appError(context, 500, 'Search results error');
  }
};

export default SearchPage;
