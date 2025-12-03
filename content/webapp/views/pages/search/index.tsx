import { NextPage } from 'next';
import { useContext, useEffect, useMemo, useState } from 'react';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import { arrow } from '@weco/common/icons';
import {
  ServerDataContext,
  useToggles,
} from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { formatNumber } from '@weco/common/utils/grammar';
import { getQueryResults } from '@weco/common/utils/search';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import Divider from '@weco/common/views/components/Divider';
import Icon from '@weco/common/views/components/Icon';
import { Container } from '@weco/common/views/components/styled/Container';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import {
  Addressable,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';
import { Query } from '@weco/content/types/search';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';
import ContentSearchResult from '@weco/content/views/components/ContentSearchResult';
import Pagination from '@weco/content/views/components/Pagination';
import { toSearchImagesLink } from '@weco/content/views/components/SearchPagesLink/Images';
import { toSearchWorksLink } from '@weco/content/views/components/SearchPagesLink/Works';
import { withSearchLayout } from '@weco/content/views/layouts/SearchPageLayout';

import {
  fromQuery,
  getQueryWorkTypeBuckets,
  ImageResults,
  WorkTypes,
} from './search.helpers';
import SearchNoResults from './search.NoResults';
import {
  AllLink,
  BasicSection,
  CatalogueLinks,
  CatalogueResults,
  CatalogueResultsInner,
  CatalogueResultsSection,
  CatalogueSectionTitle,
  ContentResults,
  GridContainer,
  ImageLinks,
  LoaderContainer,
  WorksLink,
} from './search.styles';

export type Props = {
  contentResults?: ContentResultsList<Addressable>;
  query: Query;
  contentQueryFailed?: boolean;
  apiToolbarLinks?: ApiToolbarLink[];
};

const SearchPage: NextPage<Props> = withSearchLayout(
  ({ contentResults, contentQueryFailed, query }) => {
    const { query: queryString } = query;
    const { extraApiToolbarLinks, setExtraApiToolbarLinks } =
      useSearchContext();
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
            !extraApiToolbarLinks.find(
              link => link.id === 'catalogue-api-images'
            )
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
            !extraApiToolbarLinks.find(
              link => link.id === 'catalogue-api-works'
            )
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
              <p className={font('sans', -1)}>
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
                        for{' '}
                        <span className={font('sans-bold', -1)}>
                          {queryString}
                        </span>
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
                      <h3 className={font('sans-bold', 0)}>
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
                              <WorksLink
                                key={i}
                                {...toSearchWorksLink({
                                  query: queryString,
                                  workType: [bucket.data.id],
                                })}
                              >
                                {bucket.data.label} (
                                {formatNumber(bucket.count, {
                                  isCompact: true,
                                })}
                                )
                              </WorksLink>
                            ))}
                        </CatalogueLinks>

                        <AllLink
                          {...toSearchWorksLink({ query: queryString })}
                          data-gtm-trigger="all-catalogue-results"
                        >
                          {`All catalogue results (${formatNumber(totalWorksResults, { isCompact: true })})`}
                          <Icon icon={arrow} iconColor="black" rotate={360} />
                        </AllLink>
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
                          <AllLink
                            data-gtm-trigger="all-image-results"
                            {...toSearchImagesLink({ query: queryString })}
                          >
                            {`All image results (${formatNumber(totalImagesResults, { isCompact: true })})`}
                            <Icon icon={arrow} iconColor="black" rotate={360} />
                          </AllLink>
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
  }
);

export default SearchPage;
