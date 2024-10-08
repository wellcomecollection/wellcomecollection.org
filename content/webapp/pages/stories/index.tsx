import * as prismic from '@prismicio/client';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { StoriesLandingDocument as RawStoriesLandingDocument } from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import Layout, {
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import { FeaturedCardArticle } from '@weco/content/components/FeaturedCard/FeaturedCard';
import FeaturedText from '@weco/content/components/FeaturedText/FeaturedText';
import { defaultSerializer } from '@weco/content/components/HTMLSerializers/HTMLSerializers';
import SectionHeader from '@weco/content/components/SectionHeader/SectionHeader';
import StoryPromo from '@weco/content/components/StoryPromo/StoryPromo';
import { ArticleFormatIds } from '@weco/content/data/content-format-ids';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchArticles } from '@weco/content/services/prismic/fetch/articles';
import { fetchStoriesLanding } from '@weco/content/services/prismic/fetch/stories-landing';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '@weco/content/services/prismic/transformers/articles';
import { articleLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { transformSeriesToSeriesBasic } from '@weco/content/services/prismic/transformers/series';
import { transformStoriesLanding } from '@weco/content/services/prismic/transformers/stories-landing';
import { ArticleBasic } from '@weco/content/types/articles';
import { Series, SeriesBasic } from '@weco/content/types/series';
import { StoriesLanding } from '@weco/content/types/stories-landing';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

type Props = {
  articles: ArticleBasic[];
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
  const articlesQueryPromise = fetchArticles(client, {
    filters: prismic.filter.not('my.articles.format', ArticleFormatIds.Comic),
  });

  const comicsQueryPromise = fetchArticles(client, {
    pageSize: 100, // we need enough comics to make sure we have at least one from three different series
    filters: prismic.filter.at('my.articles.format', ArticleFormatIds.Comic),
  });

  const storiesLandingPromise = fetchStoriesLanding(client);

  const [articlesQuery, storiesLandingDoc, comicsQuery] = await Promise.all([
    articlesQueryPromise,
    storiesLandingPromise,
    comicsQueryPromise,
  ]);

  const articles = transformQuery(articlesQuery, transformArticle);

  // In order to avoid the case where we end up with an empty comic series,
  // rather than querying for the series itself we query for the individual
  // comics, then group them by series and stop once we've got to three. That
  // way we can be confident each of the three series that we have contains at
  // least one comic.
  const comics = transformQuery(comicsQuery, transformArticle);
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

  const jsonLd = articles.results.map(articleLd);
  const basicArticles = articles.results.map(transformArticleToArticleBasic);
  const storiesLanding =
    storiesLandingDoc &&
    transformStoriesLanding(storiesLandingDoc as RawStoriesLandingDocument);

  if (articles && articles.results) {
    return {
      props: serialiseProps({
        articles: basicArticles,
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
      image={firstArticle && firstArticle.image}
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
        <Layout gridSizes={gridSize8(false)}>
          <div className="body-text spaced-text">
            <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
              <FeaturedText
                html={introText}
                htmlSerializer={defaultSerializer}
              />
            </Space>
          </div>
        </Layout>
      )}

      <SpacingSection>
        <ArticlesContainer className="row--has-wobbly-background">
          <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
            <Layout gridSizes={gridSize12()}>
              <FeaturedCardArticle
                article={firstArticle}
                background="neutral.700"
                textColor="white"
              />
            </Layout>
          </Space>
          <div className="row__wobbly-background" />
          <StoryPromoContainer>
            <Space $v={{ size: 'l', properties: ['padding-bottom'] }}>
              <div className="grid grid--scroll grid--theme-4 card-theme card-theme--transparent">
                {articles.slice(1, 5).map(article => {
                  return (
                    <div className="grid__cell" key={article.id}>
                      <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
                        <StoryPromo article={article} />
                      </Space>
                    </div>
                  );
                })}
              </div>
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
            <Layout gridSizes={gridSize12()}>
              <PrismicHtmlBlock html={storiesLanding.storiesDescription} />
            </Layout>
          </SpacingComponent>
        )}
        <SpacingComponent>
          <CardGrid
            items={storiesLanding.stories}
            itemsPerRow={3}
            links={[{ text: 'More stories', url: '/articles' }]}
          />
        </SpacingComponent>
      </SpacingSection>

      <SpacingSection>
        <SpacingComponent>
          <SectionHeader title="Comics" gridSize={gridSize12()} />
        </SpacingComponent>

        <SpacingComponent>
          <Layout gridSizes={gridSize12()}>
            <p>{pageDescriptions.comic}</p>
          </Layout>
        </SpacingComponent>

        <SpacingComponent>
          <CardGrid
            items={comicSeries}
            itemsPerRow={3}
            itemsHaveTransparentBackground={true}
            links={[{ text: 'More comics', url: '/stories/comic' }]}
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
            <Layout gridSizes={gridSize12()}>
              <PrismicHtmlBlock html={storiesLanding.booksDescription} />
            </Layout>
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
            links={[{ text: 'More stories', url: '/articles' }]}
          />
        </SpacingComponent>
      </SpacingSection>
    </PageLayout>
  );
};

export default StoriesPage;
