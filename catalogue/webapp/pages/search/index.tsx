import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import styled from 'styled-components';
import { ParsedUrlQuery } from 'querystring';

import Space from '@weco/common/views/components/styled/Space';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import StoriesGrid from '@weco/catalogue/components/StoriesGrid';
import NewStoriesGrid from '@weco/catalogue/components/StoriesGrid/StoriesGrid.New';
import ImageEndpointSearchResults from '@weco/catalogue/components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import WorksSearchResults from '@weco/catalogue/components/WorksSearchResults/WorksSearchResults';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';

import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { Pageview } from '@weco/common/services/conversion/track';
import { getStories } from '@weco/catalogue/services/prismic/fetch/articles';
import {
  PrismicApiError,
  PrismicResultsList,
  Story,
} from '@weco/catalogue/services/prismic/types';
import { font } from '@weco/common/utils/classnames';
import { getWorks } from '@weco/catalogue/services/wellcome/catalogue/works';
import { Query } from '@weco/catalogue/types/search';
import { getImages } from '@weco/catalogue/services/wellcome/catalogue/images';
import { Image, Work } from '@weco/catalogue/services/wellcome/catalogue/types';
import {
  getQueryResults,
  getQueryPropertyValue,
} from '@weco/common/utils/search';
import {
  decodeQuery,
  FromCodecMap,
  stringCodec,
} from '@weco/common/utils/routes';
import theme from '@weco/common/views/themes/default';
import { formatNumber } from '@weco/common/utils/grammar';
import { getArticles } from '@weco/catalogue/services/wellcome/content/articles';
import {
  ContentApiError,
  ContentResultsList,
} from '@weco/catalogue/services/wellcome/content/types';
import { Content } from '@weco/catalogue/services/wellcome/content/types/api';

// Creating this version of fromQuery for the overview page only
// No filters or pagination required.
const codecMap = { query: stringCodec };
type CodecMapProps = FromCodecMap<typeof codecMap>;
const fromQuery: (params: ParsedUrlQuery) => CodecMapProps = params => {
  return decodeQuery<CodecMapProps>(params, codecMap);
};

type Props = {
  works?: ResultsProps<Work>;
  images?: ResultsProps<Image>;
  stories?: ResultsProps<Story>;
  newStories?: ResultsProps<Content>;
  query: Query;
  pageview: Pageview;
};

type ResultsProps<T> = {
  pageResults: T[];
  totalResults: number;
};

type SeeMoreButtonProps = {
  text: string;
  pathname: string;
  totalResults: number;
};

const StoriesSection = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('neutral.200')};
`;

const ImagesSection = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
`;

const WorksSection = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})``;

const SectionTitle = ({ sectionName }: { sectionName: string }) => {
  return (
    <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
      <h3 className={font('intb', 2)}>{sectionName}</h3>
    </Space>
  );
};

export const SearchPage: NextPageWithLayout<Props> = ({
  works,
  images,
  stories,
  newStories,
  query,
}) => {
  const { query: queryString } = query;
  const returnedStories = stories || newStories;

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
      hoverUnderline
    />
  );

  return (
    <main>
      <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
        {!returnedStories && !images && !works ? (
          <div className="container">
            <SearchNoResults query={queryString} />
          </div>
        ) : (
          <>
            {returnedStories && (
              <StoriesSection as="section">
                <div className="container">
                  <SectionTitle sectionName="Stories" />

                  {newStories && (
                    <NewStoriesGrid
                      articles={newStories.pageResults}
                      dynamicImageSizes={{
                        xlarge: 1 / 5,
                        large: 1 / 5,
                        medium: 1 / 2,
                        small: 1 / 2,
                      }}
                    />
                  )}
                  {stories && (
                    <StoriesGrid
                      stories={stories.pageResults}
                      dynamicImageSizes={{
                        xlarge: 1 / 5,
                        large: 1 / 5,
                        medium: 1 / 2,
                        small: 1 / 2,
                      }}
                    />
                  )}

                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton
                      text="All stories"
                      pathname="/search/stories"
                      totalResults={returnedStories.totalResults}
                    />
                  </Space>
                </div>
              </StoriesSection>
            )}

            {images && (
              <ImagesSection>
                <div className="container">
                  <SectionTitle sectionName="Images" />

                  <ImageEndpointSearchResults images={images.pageResults} />

                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton
                      text="All images"
                      pathname="/search/images"
                      totalResults={images.totalResults}
                    />
                  </Space>
                </div>
              </ImagesSection>
            )}

            {works && (
              <WorksSection>
                <div className="container">
                  <SectionTitle sectionName="Catalogue" />

                  <WorksSearchResults works={works.pageResults} />

                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton
                      text="All works"
                      pathname="/search/works"
                      totalResults={works.totalResults}
                    />
                  </Space>
                </div>
              </WorksSection>
            )}
          </>
        )}
      </Space>
    </main>
  );
};

SearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const query = context.query;
    const params = fromQuery(query);
    const { contentApi } = serverData.toggles;

    const pageview: Pageview = {
      name: 'search',
      properties: {},
    };

    const defaultProps = removeUndefinedProps({
      serverData,
      query,
      pageview,
    });

    try {
      // Stories
      // We want the default order to be "descending publication date" with the Prismic API

      const storiesResults = contentApi
        ? await getArticles({
            params: {
              ...query,
              sort: getQueryPropertyValue(query.sort),
              sortOrder: getQueryPropertyValue(query.sortOrder),
            },
            pageSize: 4,
            toggles: serverData.toggles,
          })
        : await getStories({
            query: {
              ...query,
              sort: getQueryPropertyValue(query.sort) || 'publication.dates',
              sortOrder: getQueryPropertyValue(query.sortOrder) || 'desc',
            },
            pageSize: 4,
          });

      const newStories = contentApi
        ? getQueryResults({
            categoryName: 'stories',
            queryResults: storiesResults as
              | ContentResultsList<Content>
              | ContentApiError,
          })
        : undefined;

      const stories = contentApi
        ? undefined
        : getQueryResults({
            categoryName: 'stories',
            queryResults: storiesResults as
              | PrismicResultsList<Story>
              | PrismicApiError,
          });

      // Works
      const _worksQueryType = getCookie('_queryType') as string | undefined;
      const worksResults = await getWorks({
        params: {
          ...params,
          _queryType: _worksQueryType,
        },
        pageSize: 5,
        toggles: serverData.toggles,
      });
      const works = getQueryResults({
        categoryName: 'works',
        queryResults: worksResults,
      });

      // Images
      const imagesResults = await getImages({
        params,
        toggles: serverData.toggles,
        pageSize: 10,
      });
      const images = getQueryResults({
        categoryName: 'images',
        queryResults: imagesResults,
      });

      // If all three queries fail, return an error page
      if (
        imagesResults.type === 'Error' &&
        worksResults.type === 'Error' &&
        storiesResults.type === 'Error'
      ) {
        return appError(context, 500, 'Search results error');
      }

      return {
        props: {
          ...defaultProps,
          ...(stories && stories.pageResults?.length && { stories }),
          ...(newStories && newStories.pageResults?.length && { newStories }),
          ...(images?.pageResults.length && { images }),
          ...(works?.pageResults.length && { works }),
        },
      };
    } catch (error) {
      console.error(error);
      return appError(context, 500, 'Search results error');
    }
  };

export default SearchPage;