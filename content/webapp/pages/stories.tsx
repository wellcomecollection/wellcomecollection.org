import { FunctionComponent } from 'react';
import styled from 'styled-components';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import { ArticleBasic } from '../types/articles';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import FeaturedText from '../components/FeaturedText/FeaturedText';
import { defaultSerializer } from '../components/HTMLSerializers/HTMLSerializers';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/services/app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import StoryPromo from '../components/StoryPromo/StoryPromo';
import CardGrid from '../components/CardGrid/CardGrid';
import { FeaturedCardArticle } from '../components/FeaturedCard/FeaturedCard';
import { articleLd } from '../services/prismic/transformers/json-ld';
import { createClient } from '../services/prismic/fetch';
import { fetchArticles } from '../services/prismic/fetch/articles';
import { fetchStoriesLanding } from '../services/prismic/fetch/stories-landing';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '../services/prismic/transformers/articles';
import { transformStoriesLanding } from '../services/prismic/transformers/stories-landing';
import { pageDescriptions, comicsStrapline } from '@weco/common/data/microcopy';
import { StoriesLanding } from '../types/stories-landing';
import { StoriesLandingPrismicDocument } from '../services/prismic/types/stories-landing';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { RichTextField } from '@prismicio/types';
import { ArticleFormatIds } from '@weco/common/data/content-format-ids';
import { fetchSeries } from '../services/prismic/fetch/series';
import {
  transformSeries,
  transformSeriesToSeriesBasic,
} from '../services/prismic/transformers/series';
import { SeriesBasic } from '../types/series';
import * as prismic from '@prismicio/client';

type Props = {
  articles: ArticleBasic[];
  comicSeries: SeriesBasic[];
  storiesLanding: StoriesLanding;
  storiesLandingComics: boolean;
  jsonLd: JsonLdObj[];
};

const ArticlesContainer = styled.div`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const StoryPromoContainer = styled.div.attrs({
  className: 'container container--scroll',
})`
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    background: ${props => props.theme.color('warmNeutral.300')};
  }

  &::-webkit-scrollbar-thumb {
    border-color: ${props => props.theme.color('warmNeutral.300')};
  }
`;

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const storiesLandingComics = serverData.toggles.storiesLandingComics;
    const client = createClient(context);
    const articlesQueryPromise = fetchArticles(client, {
      predicates: storiesLandingComics
        ? prismic.predicate.not('my.articles.format', ArticleFormatIds.Comic)
        : undefined,
    });

    const storiesLandingPromise = fetchStoriesLanding(client);

    const comicSeriesPromise = fetchSeries(client, {
      predicates: prismic.predicate.at(
        'my.series.format',
        ArticleFormatIds.Comic
      ),
      pageSize: 3,
      orderings: {
        field: 'document.first_publication_date',
        direction: 'desc',
      },
    });

    const [articlesQuery, storiesLandingDoc, comicSeriesQuery] =
      await Promise.all([
        articlesQueryPromise,
        storiesLandingPromise,
        comicSeriesPromise,
      ]);

    const articles = transformQuery(articlesQuery, transformArticle);
    const jsonLd = articles.results.map(articleLd);
    const basicArticles = articles.results.map(transformArticleToArticleBasic);
    const comicSeries = transformQuery(comicSeriesQuery, transformSeries);
    const basicComicSeries = comicSeries.results.map(
      transformSeriesToSeriesBasic
    );

    const storiesLanding =
      storiesLandingDoc &&
      transformStoriesLanding(
        storiesLandingDoc as StoriesLandingPrismicDocument
      );

    if (articles && articles.results) {
      return {
        props: removeUndefinedProps({
          articles: basicArticles,
          comicSeries: basicComicSeries,
          serverData,
          jsonLd,
          storiesLanding,
          storiesLandingComics,
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
  storiesLandingComics,
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
      apiToolbarLinks={[
        {
          id: 'prismic',
          label: 'Prismic',
          link: `https://wellcomecollection.prismic.io/documents~b=working&c=published&l=en-gb/${storiesLanding.id}/`,
        },
      ]}
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        title="Stories"
        isContentTypeInfoBeforeMedia={false}
        sectionLevelPage={true}
      />
      {introText && (
        <Layout8 shift={false}>
          <div className="body-text spaced-text">
            <Space
              v={{
                size: 'xl',
                properties: ['margin-bottom'],
              }}
            >
              <FeaturedText
                html={introText}
                htmlSerializer={defaultSerializer}
              />
            </Space>
          </div>
        </Layout8>
      )}

      <SpacingSection>
        <ArticlesContainer className="row--has-wobbly-background">
          <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
            <Layout12>
              <FeaturedCardArticle
                article={firstArticle}
                background="neutral.700"
                textColor="white"
              />
            </Layout12>
          </Space>
          <div className="row__wobbly-background" />
          <StoryPromoContainer>
            <Space v={{ size: 'l', properties: ['padding-bottom'] }}>
              <div className="grid grid--scroll grid--theme-4 card-theme card-theme--transparent">
                {articles.slice(1, 5).map((article, i) => {
                  return (
                    <div className="grid__cell" key={article.id}>
                      <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
                        <StoryPromo article={article} position={i} />
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
            <SectionHeader title={`${storiesLanding.storiesTitle}`} />
          </SpacingComponent>
        )}
        {storiesLanding.storiesDescription && (
          <SpacingComponent>
            <Layout12>
              <PrismicHtmlBlock
                html={storiesLanding.storiesDescription as RichTextField}
              />
            </Layout12>
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

      {storiesLandingComics && (
        <SpacingSection>
          <SpacingComponent>
            <SectionHeader title="Comics" />
          </SpacingComponent>

          <SpacingComponent>
            <Layout12>
              <p>{comicsStrapline}</p>
            </Layout12>
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
      )}

      <SpacingSection>
        {storiesLanding.booksTitle && (
          <SpacingComponent>
            <SectionHeader title={`${storiesLanding.booksTitle}`} />
          </SpacingComponent>
        )}
        {storiesLanding.booksDescription && (
          <SpacingComponent>
            <Layout12>
              <PrismicHtmlBlock
                html={storiesLanding.booksDescription as RichTextField}
              />
            </Layout12>
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
          <SectionHeader title="You may have missed" />
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
