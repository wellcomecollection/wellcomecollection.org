import * as prismic from '@prismicio/client';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { StoriesLandingDocument as RawStoriesLandingDocument } from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { serialiseProps } from '@weco/common/utils/json';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { Container } from '@weco/common/views/components/styled/Container';
import {
  GridCellScroll,
  GridScroll,
} from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import CardGrid from '@weco/content/components/CardGrid';
import FeaturedCard from '@weco/content/components/FeaturedCard';
import FeaturedText from '@weco/content/components/FeaturedText';
import { defaultSerializer } from '@weco/content/components/HTMLSerializers';
import SectionHeader from '@weco/content/components/SectionHeader';
import StoryPromoContentApi from '@weco/content/components/StoryPromo/StoryPromoContentApi';
import { ArticleFormatIds } from '@weco/content/data/content-format-ids';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchArticles } from '@weco/content/services/prismic/fetch/articles';
import { fetchStoriesLanding } from '@weco/content/services/prismic/fetch/stories-landing';
import { transformArticle as transformPrismicArticle } from '@weco/content/services/prismic/transformers/articles';
import { articleLdContentApi } from '@weco/content/services/prismic/transformers/json-ld';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { transformSeriesToSeriesBasic } from '@weco/content/services/prismic/transformers/series';
import { transformStoriesLanding } from '@weco/content/services/prismic/transformers/stories-landing';
import { getArticles } from '@weco/content/services/wellcome/content/articles';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import { Series, SeriesBasic } from '@weco/content/types/series';
import { StoriesLanding } from '@weco/content/types/stories-landing';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

type Props = {
  articles: Article[];
  comicSeries: SeriesBasic[];
  storiesLanding: StoriesLanding;
  jsonLd: JsonLdObj[];
};

const ArticlesContainer = styled.div`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const StoryPromoContainer = styled(Container)`
  -webkit-overflow-scrolling: touch;

  /* former .container--scroll */
  ${props =>
    props.theme.mediaBetween(
      'small',
      'medium'
    )(`
    max-width: none;
    width: auto;
    overflow: auto;

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

  &::-webkit-scrollbar {
    background: ${props => props.theme.color('warmNeutral.300')};
  }

  &::-webkit-scrollbar-thumb {
    border-color: ${props => props.theme.color('warmNeutral.300')};
  }
`;

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const client = createClient(context);

  const comicsQueryPromise = fetchArticles(client, {
    pageSize: 100, // we need enough comics to make sure we have at least one from three different series
    filters: prismic.filter.at('my.articles.format', ArticleFormatIds.Comic),
  });

  const storiesLandingPromise = fetchStoriesLanding(client);
  const articlesResponsePromise = getArticles({
    params: {},
    pageSize: 11,
    toggles: serverData.toggles,
  });

  const [articlesResponse, storiesLandingDoc, comicsQuery] = await Promise.all([
    articlesResponsePromise,
    storiesLandingPromise,
    comicsQueryPromise,
  ]);

  const articles =
    articlesResponse.type === 'ResultList' ? articlesResponse.results : [];

  // In order to avoid the case where we end up with an empty comic series,
  // rather than querying for the series itself we query for the individual
  // comics, then group them by series and stop once we've got to three. That
  // way we can be confident each of the three series that we have contains at
  // least one comic.
  const comics = transformQuery(comicsQuery, transformPrismicArticle);
  const comicSeries = new Map<string, Series>();
  for (const comic of comics.results) {
    const series = comic.series[0];
    if (series?.id && !comicSeries.has(series.id)) {
      comicSeries.set(series.id, series);
    }
    if (comicSeries.size === 3) {
      break;
    }
  }

  const basicComicSeries = Array.from(comicSeries.values()).map(
    transformSeriesToSeriesBasic
  );

  const jsonLd = articles.map(articleLdContentApi);
  const storiesLanding =
    storiesLandingDoc &&
    transformStoriesLanding(storiesLandingDoc as RawStoriesLandingDocument);

  if (articles) {
    return {
      props: serialiseProps({
        articles,
        comicSeries: basicComicSeries,
        serverData,
        jsonLd,
        storiesLanding,
      }),
    };
  } else {
    return { notFound: true };
  }
};

const StoriesPage: FunctionComponent<Props> = ({
  articles,
  comicSeries,
  jsonLd,
  storiesLanding,
}) => {
  const firstArticle = articles[0];
  const introText = storiesLanding?.introText;

  return (
    <PageLayout
      title="Stories"
      description={pageDescriptions.stories}
      url={{ pathname: '/stories' }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="stories"
      image={firstArticle && transformImage(firstArticle.image)}
      rssUrl="https://rss.wellcomecollection.org/stories"
      apiToolbarLinks={[createPrismicLink(storiesLanding.id)]}
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        title="Stories"
        isContentTypeInfoBeforeMedia={false}
        sectionLevelPage={true}
      />
      {introText && (
        <ContaineredLayout gridSizes={gridSize8(false)}>
          <div className="body-text spaced-text">
            <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
              <FeaturedText
                html={introText}
                htmlSerializer={defaultSerializer}
              />
            </Space>
          </div>
        </ContaineredLayout>
      )}

      <SpacingSection>
        <ArticlesContainer className="row--has-wobbly-background">
          <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
            <ContaineredLayout gridSizes={gridSize12()}>
              <FeaturedCard
                type="article"
                article={firstArticle}
                background="neutral.700"
                textColor="white"
              />
            </ContaineredLayout>
          </Space>
          <div className="row__wobbly-background" />
          <StoryPromoContainer>
            <Space $v={{ size: 'l', properties: ['padding-bottom'] }}>
              <GridScroll className="card-theme card-theme--transparent">
                {articles.slice(1, 5).map(article => {
                  return (
                    <GridCellScroll
                      key={article.id}
                      $sizeMap={{ m: [6], l: [3], xl: [3] }}
                    >
                      <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
                        <StoryPromoContentApi article={article} />
                      </Space>
                    </GridCellScroll>
                  );
                })}
              </GridScroll>
            </Space>
          </StoryPromoContainer>
        </ArticlesContainer>
      </SpacingSection>

      <SpacingSection>
        {storiesLanding.storiesTitle && (
          <SpacingComponent>
            <SectionHeader
              title={`${storiesLanding.storiesTitle}`}
              gridSize={gridSize12()}
            />
          </SpacingComponent>
        )}
        {storiesLanding.storiesDescription && (
          <SpacingComponent>
            <ContaineredLayout gridSizes={gridSize12()}>
              <PrismicHtmlBlock html={storiesLanding.storiesDescription} />
            </ContaineredLayout>
          </SpacingComponent>
        )}
        <SpacingComponent>
          <CardGrid
            items={storiesLanding.stories}
            itemsPerRow={3}
            links={[{ text: 'More stories', url: '/search/stories' }]}
          />
        </SpacingComponent>
      </SpacingSection>

      <SpacingSection>
        <SpacingComponent>
          <SectionHeader title="Comics" gridSize={gridSize12()} />
        </SpacingComponent>

        <SpacingComponent>
          <ContaineredLayout gridSizes={gridSize12()}>
            <p>{pageDescriptions.comic}</p>
          </ContaineredLayout>
        </SpacingComponent>

        <SpacingComponent>
          <CardGrid
            items={comicSeries}
            itemsPerRow={3}
            itemsHaveTransparentBackground={true}
            links={[
              {
                text: 'More comics',
                url: '/search/stories?format=W7d_ghAAALWY3Ujc',
              },
            ]}
          />
        </SpacingComponent>
      </SpacingSection>

      <SpacingSection>
        {storiesLanding.booksTitle && (
          <SpacingComponent>
            <SectionHeader
              title={`${storiesLanding.booksTitle}`}
              gridSize={gridSize12()}
            />
          </SpacingComponent>
        )}
        {storiesLanding.booksDescription && (
          <SpacingComponent>
            <ContaineredLayout gridSizes={gridSize12()}>
              <PrismicHtmlBlock html={storiesLanding.booksDescription} />
            </ContaineredLayout>
          </SpacingComponent>
        )}
        <SpacingComponent>
          <CardGrid
            items={storiesLanding.books}
            itemsPerRow={3}
            links={[{ text: 'More books', url: '/books' }]}
          />
        </SpacingComponent>
      </SpacingSection>

      <SpacingSection>
        <SpacingComponent>
          <SectionHeader title="You may have missed" gridSize={gridSize12()} />
        </SpacingComponent>
        <SpacingComponent>
          <CardGrid
            items={articles.slice(5, 11)}
            itemsPerRow={3}
            links={[{ text: 'More stories', url: '/search/stories' }]}
          />
        </SpacingComponent>
      </SpacingSection>
    </PageLayout>
  );
};

export default StoriesPage;
