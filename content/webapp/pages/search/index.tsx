import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

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
import {
  getQueryPropertyValue,
  getQueryResults,
  ReturnedResults,
} from '@weco/common/utils/search';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import Divider from '@weco/common/views/components/Divider/Divider';
import Icon from '@weco/common/views/components/Icon/Icon';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';
import { Container } from '@weco/common/views/components/styled/Container';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import theme from '@weco/common/views/themes/default';
import ContentSearchResult from '@weco/content/components/ContentSearchResult/ContentSearchResult';
import EventsSearchResults from '@weco/content/components/EventsSearchResults';
import ImageEndpointSearchResults from '@weco/content/components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import MoreLink from '@weco/content/components/MoreLink/MoreLink';
import Pagination from '@weco/content/components/Pagination/Pagination';
import SearchNoResults from '@weco/content/components/SearchNoResults/SearchNoResults';
import { getSearchLayout } from '@weco/content/components/SearchPageLayout/SearchPageLayout';
import { toLink as imagesLink } from '@weco/content/components/SearchPagesLink/Images';
import { toLink as worksLink } from '@weco/content/components/SearchPagesLink/Works';
import StoriesGrid from '@weco/content/components/StoriesGrid';
import WorksSearchResults from '@weco/content/components/WorksSearchResults/WorksSearchResults';
import useHotjar from '@weco/content/hooks/useHotjar';
import {
  WellcomeAggregation,
  WellcomeApiError,
} from '@weco/content/services/wellcome';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import {
  CatalogueResultsList,
  Image,
  toWorkBasic,
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import { getAddressables } from '@weco/content/services/wellcome/content/all';
import { getArticles } from '@weco/content/services/wellcome/content/articles';
import { getEvents } from '@weco/content/services/wellcome/content/events';
import {
  Addressable,
  Article,
  ContentResultsList,
  EventDocument,
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
  works?: ReturnedResults<WorkBasic>;
  images?: ReturnedResults<Image>;
  stories?: ReturnedResults<Article>;
  events?: ReturnedResults<EventDocument>;
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

type NewProps = {
  contentResults?: ContentResultsList<Addressable>;
  catalogueResults: CatalogueResults;
  queryString?: string;
  contentQueryFailed?: boolean;
};

type SeeMoreButtonProps = {
  text: string;
  pathname: string;
  totalResults: number;
};

const CatalogueResultsInner = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  position: relative;
  background-color: ${props => props.theme.color('warmNeutral.300')};
  min-height: 90px;
  ${props => props.theme.media('large')`
      min-height: 400px;
  `}
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

const StoriesSection = styled(BasicSection)`
  background-color: ${props => props.theme.color('neutral.200')};
`;

const ImagesSection = styled(BasicSection)`
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
`;

const EventsSection = styled(BasicSection).attrs({
  $v: { size: 'xl', properties: ['padding-bottom'] },
})``;

const SectionTitle = ({ sectionName }: { sectionName: string }) => {
  return (
    <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
      <h3 className={font('intb', 2)}>{sectionName}</h3>
    </Space>
  );
};

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
    props.theme.media('large')(
      `grid-column: ${props.$fullWidth ? '1 / 13' : '9 / 13'};`
    )}
`;

const StoryPromoContainer = styled(Container)`
  ${props =>
    props.theme.mediaBetween(
      'small',
      'medium'
    )(`
  max-width: none;
  width: auto;
  overflow: auto;
  padding: 0;

  &::-webkit-scrollbar {
    height: 18px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 0;
    border-style: solid;
    border-width: 0 ${props.theme.containerPadding.small}px 12px;
    background: ${props.theme.color('neutral.400')};
  }
`)}

  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    background: ${props => props.theme.color('neutral.200')};
  }

  &::-webkit-scrollbar-thumb {
    border-color: ${props => props.theme.color('neutral.200')};
  }
`;

const NewSearchPage: NextPageWithLayout<NewProps> = ({
  queryString,
  contentResults,
  catalogueResults,
  contentQueryFailed,
}) => {
  const { extraApiToolbarLinks, setExtraApiToolbarLinks } =
    useContext(SearchContext);
  const { apiToolbar } = useToggles();

  const totalWorksResults = catalogueResults.works?.totalResults || 0;
  const totalImagesResults = catalogueResults.images?.totalResults || 0;
  const totalContentResults = contentResults?.totalResults || 0;
  const totalCatalogueResults = totalWorksResults + totalImagesResults;
  const totalResults = totalContentResults + totalCatalogueResults;
  const isSmallGallery =
    catalogueResults.images && catalogueResults.images.results.length < 3;
  const pathname = usePathname();

  useEffect(() => {
    if (apiToolbar) {
      if (
        catalogueResults.works &&
        !extraApiToolbarLinks.find(link => link.id === 'catalogue-api-works')
      ) {
        setExtraApiToolbarLinks([
          ...extraApiToolbarLinks,
          {
            id: 'catalogue-api-works',
            label: 'Works API query',
            link: catalogueResults.works.requestUrl,
          },
        ]);
      }

      if (
        catalogueResults.images?.requestUrl &&
        !extraApiToolbarLinks.find(link => link.id === 'catalogue-api-images')
      ) {
        setExtraApiToolbarLinks([
          ...extraApiToolbarLinks,
          {
            id: 'catalogue-api-images',
            label: 'Images API query',
            link: catalogueResults.images.requestUrl,
          },
        ]);
      }
    }
  }, [catalogueResults.works, catalogueResults.images]);

  return (
    <main>
      {totalResults === 0 ? (
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
                  {queryString ? (
                    <>
                      {' '}
                      for <span className={font('intb', 5)}>{queryString}</span>
                    </>
                  ) : null}
                </>
              )}
            </p>
          </Container>
          <GridContainer>
            {totalCatalogueResults > 0 && (
              <CatalogueResults $fullWidth={!contentResults?.totalResults}>
                <CatalogueResultsInner>
                  {!catalogueResults.works && !catalogueResults.images && (
                    <>
                      <span className="is-hidden-l is-hidden-xl">
                        <LL $small />
                      </span>
                      <span className="is-hidden-s is-hidden-m">
                        <LL />
                      </span>
                    </>
                  )}
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
                  {catalogueResults.works?.totalResults &&
                  catalogueResults.works?.totalResults > 0 ? (
                    <CatalogueResultsSection>
                      <CatalogueSectionTitle>
                        Catalogue results
                      </CatalogueSectionTitle>
                      <CatalogueLinks>
                        {catalogueResults.works.workTypeBuckets
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
                        <AllLink>
                          {`All catalogue results (${formatNumber(totalWorksResults, { isCompact: true })})`}
                          <Icon icon={arrow} iconColor="black" rotate={360} />
                        </AllLink>
                      </NextLink>
                    </CatalogueResultsSection>
                  ) : null}
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
                  {catalogueResults.images?.totalResults &&
                  catalogueResults.images.totalResults > 0 ? (
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
                        <ImageEndpointSearchResults
                          images={catalogueResults.images.results}
                          targetRowHeight={120}
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
                          <AllLink>
                            {`All image results (${formatNumber(totalImagesResults, { isCompact: true })})`}
                            <Icon icon={arrow} iconColor="black" rotate={360} />
                          </AllLink>
                        </NextLink>
                      </CatalogueResultsSection>
                    </>
                  ) : null}
                </CatalogueResultsInner>
              </CatalogueResults>
            )}
            <ContentResults>
              {contentResults?.results?.map(result => (
                <Space
                  key={`${result.id}${result.highlightTourType || ''}`}
                  $v={{ size: 'xl', properties: ['margin-bottom'] }}
                >
                  <ContentSearchResult {...result} />
                </Space>
              ))}

              {contentResults?.totalPages ? (
                <Pagination
                  totalPages={contentResults.totalPages}
                  ariaLabel="Content search results pagination"
                  isHiddenMobile={false}
                />
              ) : null}
            </ContentResults>
          </GridContainer>
        </BasicSection>
      )}
    </main>
  );
};

export const SearchPage: NextPageWithLayout<Props> = ({
  contentResults,
  contentQueryFailed,
  works,
  images,
  stories,
  events,
  query,
}) => {
  useHotjar(true);
  const { query: queryString } = query;
  const { setLink } = useContext(SearchContext);
  const { allSearch } = useToggles();
  const [clientSideWorkTypes, setClientSideWorkTypes] = useState<
    WorkTypes | undefined
  >(undefined);
  const [clientSideImages, setClientSideImages] = useState<
    ImageResults | undefined
  >(undefined);
  const params = fromQuery(query);
  const data = useContext(ServerDataContext);
  async function fetchWorks() {
    try {
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
      setClientSideWorkTypes(workTypeBuckets);
    } catch (e) {
      return undefined;
    }
  }

  async function fetchImages() {
    try {
      const imagesResults = await getImages({
        params,
        pageSize: 7,
        toggles: data.toggles,
      });
      images = getQueryResults({
        categoryName: 'images',
        queryResults: imagesResults,
      });
      setClientSideImages({
        totalResults: images?.totalResults || 0,
        results:
          images?.pageResults.map(image => ({
            ...image,
            src: image.locations[0].url,
            width: (image.aspectRatio || 1) * 100,
            height: 100,
          })) || [],
        requestUrl: images?.requestUrl,
      });
    } catch (e) {
      return undefined;
    }
  }

  useEffect(() => {
    const pathname = '/search';
    const link = {
      href: {
        pathname,
        query,
      },
      as: {
        pathname,
        query,
      },
    };
    setLink(link);
    if (allSearch) {
      setClientSideWorkTypes(undefined);
      setClientSideImages(undefined);
      fetchWorks();
      fetchImages();
    }
  }, [query]);

  if (allSearch) {
    return (
      <NewSearchPage
        queryString={queryString}
        contentResults={contentResults}
        contentQueryFailed={contentQueryFailed}
        catalogueResults={{
          works: clientSideWorkTypes,
          images: clientSideImages,
        }}
      />
    );
  }

  const SeeMoreButton = ({
    text,
    pathname,
    totalResults,
  }: SeeMoreButtonProps) => (
    <MoreLink
      name={`${text} (${formatNumber(totalResults, {
        isCompact: true,
      })})`}
      url={{
        href: {
          pathname,
          query: { ...(queryString && { query: queryString }) },
        },
      }}
      colors={theme.buttonColors.yellowYellowBlack}
    />
  );

  return (
    <main>
      {!stories && !images && !works ? (
        <Container>
          <SearchNoResults query={queryString} />
        </Container>
      ) : (
        <>
          {stories && (
            <StoriesSection>
              <Container>
                <SectionTitle sectionName="Stories" />
              </Container>
              <StoryPromoContainer>
                <StoriesGrid
                  articles={stories.pageResults}
                  dynamicImageSizes={{
                    xlarge: 1 / 5,
                    large: 1 / 5,
                    medium: 1 / 2,
                    small: 1 / 2,
                  }}
                />
              </StoryPromoContainer>
              <Container>
                <Space $v={{ size: 'l', properties: ['padding-top'] }}>
                  <SeeMoreButton
                    text="All stories"
                    pathname="/search/stories"
                    totalResults={stories.totalResults}
                  />
                </Space>
              </Container>
            </StoriesSection>
          )}

          {images && (
            <ImagesSection>
              <Container>
                <SectionTitle sectionName="Images" />

                <ImageEndpointSearchResults images={images.pageResults} />

                <Space $v={{ size: 'l', properties: ['padding-top'] }}>
                  <SeeMoreButton
                    text="All images"
                    pathname="/search/images"
                    totalResults={images.totalResults}
                  />
                </Space>
              </Container>
            </ImagesSection>
          )}

          {works && (
            <BasicSection>
              <Container>
                <SectionTitle sectionName="Catalogue" />

                <WorksSearchResults works={works.pageResults} />

                <Space $v={{ size: 'l', properties: ['padding-top'] }}>
                  <SeeMoreButton
                    text="All works"
                    pathname="/search/works"
                    totalResults={works.totalResults}
                  />
                </Space>
              </Container>
            </BasicSection>
          )}

          {events && (
            <EventsSection>
              <Container>
                <SectionTitle sectionName="Events" />

                <EventsSearchResults events={events.pageResults} />

                <Space $v={{ size: 'l', properties: ['padding-top'] }}>
                  <SeeMoreButton
                    text="All events"
                    pathname="/search/events"
                    totalResults={events.totalResults}
                  />
                </Space>
              </Container>
            </EventsSection>
          )}
        </>
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
  const params = fromQuery(query);

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
    let contentResults:
        | ContentResultsList<Addressable>
        | WellcomeApiError
        | undefined,
      stories: ReturnedResults<Article> | undefined,
      events: ReturnedResults<EventDocument> | undefined,
      works: ReturnedResults<Work> | undefined,
      images: ReturnedResults<Image> | undefined;
    let contentQueryFailed = false;
    if (serverData.toggles.allSearch.value) {
      // All/Addressables
      contentResults = await getAddressables({
        params: {
          ...query,
        },
        pageSize: 20,
        toggles: serverData.toggles,
      });

      if (contentResults.type === 'Error') {
        contentQueryFailed = true;
        console.error(contentResults.label + ': Error fetching addressables');
      }
    } else {
      // Stories
      // We want the default order to be "descending publication date" with the Content API
      const storiesResults = await getArticles({
        params: {
          ...query,
          sort: getQueryPropertyValue(query.sort),
          sortOrder: getQueryPropertyValue(query.sortOrder),
        },
        pageSize: 4,
        toggles: serverData.toggles,
      });

      if (storiesResults.type === 'Error') contentQueryFailed = true;

      stories = getQueryResults({
        categoryName: 'stories',
        queryResults: storiesResults as
          | ContentResultsList<Article>
          | WellcomeApiError,
      });

      // Events
      const eventsResults = await getEvents({
        params: {
          ...query,
          sort: getQueryPropertyValue(query.sort),
          sortOrder: getQueryPropertyValue(query.sortOrder),
        },
        pageSize: 3,
        toggles: serverData.toggles,
      });

      if (eventsResults.type === 'Error') contentQueryFailed = true;

      events = getQueryResults({
        categoryName: 'events',
        queryResults: eventsResults as
          | ContentResultsList<EventDocument>
          | WellcomeApiError,
      });

      // Works
      const worksResults = await getWorks({
        params,
        pageSize: 5,
        toggles: serverData.toggles,
      });
      works = getQueryResults({
        categoryName: 'works',
        queryResults: worksResults,
      });

      // Images
      const imagesResults = await getImages({
        params,
        pageSize: 10,
        toggles: serverData.toggles,
      });
      images = getQueryResults({
        categoryName: 'images',
        queryResults: imagesResults,
      });

      // If all three queries fail, return an error page
      if (
        imagesResults.type === 'Error' &&
        worksResults.type === 'Error' &&
        contentQueryFailed
      ) {
        // Use the error from the works API as it is the most mature of the 3
        return appError(
          context,
          worksResults.httpStatus,
          worksResults.description || worksResults.label
        );
      }
    }

    const apiToolbarLinks = serverData.toggles.allSearch.value
      ? [
          contentResults && contentResults.type !== 'Error'
            ? {
                id: 'content-api',
                label: 'Content API query',
                link: contentResults._requestUrl,
              }
            : undefined,
        ].filter(isNotUndefined)
      : [];

    return {
      props: serialiseProps({
        ...defaultProps,
        ...(stories && stories.pageResults?.length && { stories }),
        ...(images?.pageResults.length && { images }),
        ...(events?.pageResults.length && { events }),
        ...(contentResults?.type !== 'Error' &&
          contentResults?.results.length && {
            contentResults,
          }),
        contentQueryFailed,
        works:
          works && works.pageResults.length
            ? {
                ...works,
                pageResults: works.pageResults.map(toWorkBasic),
              }
            : undefined,
        apiToolbarLinks,
      }),
    };
  } catch (error) {
    console.error(error);
    return appError(context, 500, 'Search results error');
  }
};

export default SearchPage;
