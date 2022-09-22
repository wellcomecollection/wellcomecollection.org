import { FC } from 'react';
import styled from 'styled-components';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import { ArticleBasic } from '../types/articles';
import { SeriesBasic } from '../types/series';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import {
  prismicPageIds,
  featuredStoriesSeriesId,
} from '@weco/common/data/hardcoded-ids';
import FeaturedText from '../components/FeaturedText/FeaturedText';
import { defaultSerializer } from '../components/HTMLSerializers/HTMLSerializers';
import {
  getPageFeaturedText,
  transformPage,
} from '../services/prismic/transformers/pages';
import { FeaturedText as FeaturedTextType } from '../types/text';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import StoryPromo from '../components/StoryPromo/StoryPromo';
import CardGrid from '../components/CardGrid/CardGrid';
import { FeaturedCardArticle } from '../components/FeaturedCard/FeaturedCard';
import { articleLd } from '../services/prismic/transformers/json-ld';
import { createClient } from '../services/prismic/fetch';
import { fetchArticles } from '../services/prismic/fetch/articles';
import { fetchStoriesLanding } from '../services/prismic/fetch/stories-landing';
import { fetchFeaturedBooks } from '../services/prismic/fetch/featured-books';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '../services/prismic/transformers/articles';
import { transformStoriesLanding } from '../services/prismic/transformers/stories-landing';
import { fetchPage } from '../services/prismic/fetch/pages';
import {
  pageDescriptions,
  booksPromoOnStoriesPage,
} from '@weco/common/data/microcopy';
import * as prismic from '@prismicio/client';
import { transformArticleSeries } from '../services/prismic/transformers/article-series';
import { transformFeaturedBooks } from '../services/prismic/transformers/featured-books';
import { transformBookToBookBasic } from '../services/prismic/transformers/books';
import { BookBasic } from '../types/books';
import { StoriesLanding } from '../types/stories-landing';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { ImagePromo } from '../types/image-promo';
import { transformSeriesToSeriesBasic } from 'services/prismic/transformers/series';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { RichTextField } from '@prismicio/types';
// import { useToggles } from '@weco/common/server-data/Context';

type SerialisedSeriesProps = SeriesBasic & {
  promo?: ImagePromo;
  items: ArticleBasic[];
};

type Props = {
  articles: ArticleBasic[];
  series: SerialisedSeriesProps;
  featuredText?: FeaturedTextType;
  featuredBooks: BookBasic[];
  storiesLanding: StoriesLanding;
  jsonLd: JsonLdObj[];
};

const ArticlesContainer = styled.div`
  background-color: ${props => props.theme.color('cream')};
`;

const SerialisedSeries = ({ series }: { series: SerialisedSeriesProps }) => {
  return (
    <div>
      <Layout12>
        <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
          <h2 className={`h1 font-${series.color} plain-link no-margin`}>
            <a className="plain-link" href={`/series/${series.id}`}>
              {series.title}
            </a>
          </h2>
          <Space v={{ size: 'm', properties: ['margin-top'] }}>
            <p className="no-margin">{series.promo?.caption}</p>
          </Space>
        </Space>
      </Layout12>
      <CardGrid items={series.items} hidePromoText={true} itemsPerRow={3} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const client = createClient(context);
    // const { newStoriesLanding } = serverData.toggles; // TODO put this back
    const newStoriesLanding = true;

    const articlesQueryPromise = fetchArticles(client);

    // OLD - this content will be replaced by content from the newStoriesLanding type in Prismic
    // if the newStoriesLanding toggle is on, we'll just return null rather than fetching the content
    // TODO: If we're only looking up this page to get the featured text slice,
    // would it be faster to skip all the fetchLinks?  Is that possible?
    const storiesPagePromise = !newStoriesLanding
      ? fetchPage(client, prismicPageIds.stories)
      : Promise.resolve(null);
    const featuredBooksPromise = !newStoriesLanding
      ? fetchFeaturedBooks(client)
      : Promise.resolve(null);
    const featuredSeriesArticlesQueryPromise = !newStoriesLanding
      ? fetchArticles(client, {
          predicates: [
            prismic.predicate.at(
              'my.articles.series.series',
              featuredStoriesSeriesId
            ),
          ],
          page: 1,
          pageSize: 100,
        })
      : Promise.resolve(null);

    // NEW - This is the new content from the newStoriesLanding type in Prismic
    // if the newStoriesLanding toggle is off, we'll just return an empty object rather than fetch the content
    const storiesLandingPromise = newStoriesLanding
      ? fetchStoriesLanding(client)
      : {};

    const [
      articlesQuery,
      storiesPage,
      featuredSeriesArticles,
      featuredBooksDoc,
      storiesLandingDoc,
    ] = await Promise.all([
      articlesQueryPromise,
      storiesPagePromise,
      featuredSeriesArticlesQueryPromise,
      featuredBooksPromise,
      storiesLandingPromise,
    ]);

    const articles = transformQuery(articlesQuery, transformArticle);
    const jsonLd = articles.results.map(articleLd);
    const basicArticles = articles.results.map(transformArticleToArticleBasic);

    const featuredText = storiesPage
      ? getPageFeaturedText(transformPage(storiesPage!))
      : '';

    const featuredBooks = featuredBooksDoc
      ? transformFeaturedBooks(featuredBooksDoc).map(transformBookToBookBasic)
      : [];

    // The featured series and stories page should always exist
    const series = featuredSeriesArticles
      ? transformArticleSeries(featuredStoriesSeriesId, featuredSeriesArticles)!
          .series
      : [];

    // Note: an ArticleBasic contains a lot of information, but we only use
    // a little bit of the series information in the <CardGrid> component
    // where this gets used.
    //
    // This basic-ification removes some of the heaviest fields that we aren't
    // using, to keep the page weight down.
    const basicSeries: SerialisedSeriesProps = series
      ? {
          // TODO why anxiety in the air not acting like a 'part of' promo
          ...transformSeriesToSeriesBasic(series),
          promo: series.promo,
          items: [],
          // items: series.items.map(item => ({
          //   ...item,
          //   image: undefined,
          //   series: item.series.map(s => ({
          //     // TODO these should maybe be a different type not SeriesBasic
          //     id: s.id,
          //     title: s.title,
          //     schedule: [],
          //     type: 'series', // TODO probably remove this
          //     image: undefined, // TODO probably remove this
          //     promo: undefined, // TODO probably remove this
          //   })),
          // })),
        }
      : {};

    // NEW
    const storiesLanding =
      storiesLandingDoc && transformStoriesLanding(storiesLandingDoc);

    if (articles && articles.results) {
      return {
        props: removeUndefinedProps({
          articles: basicArticles,
          series: basicSeries,
          featuredText,
          serverData,
          featuredBooks,
          jsonLd,
          storiesLanding,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const StoriesPage: FC<Props> = ({
  series,
  articles,
  featuredText,
  featuredBooks,
  jsonLd,
  storiesLanding,
}) => {
  const firstArticle = articles[0];
  // const { newStoriesLanding } = useToggles(); TODO put this back
  const newStoriesLanding = true;

  return (
    <PageLayout
      title="Stories"
      description={pageDescriptions.stories}
      url={{ pathname: `/stories` }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="stories"
      image={firstArticle && firstArticle.image}
      rssUrl="https://rss.wellcomecollection.org/stories"
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        title="Stories"
        isContentTypeInfoBeforeMedia={false}
        sectionLevelPage={true}
      />
      <>
        {/* {featuredText &&
          featuredText.value && ( // TODO take this into account with toggle */}
        <Layout8 shift={false}>
          <div className="body-text spaced-text">
            <Space
              v={{
                size: 'xl',
                properties: ['margin-bottom'],
              }}
            >
              <FeaturedText
                html={
                  newStoriesLanding
                    ? storiesLanding?.introText // TODO can't pass nothing here
                    : featuredText?.value
                }
                htmlSerializer={defaultSerializer}
              />
            </Space>
          </div>
        </Layout8>
        {/* )} */}
      </>

      <SpacingSection>
        <ArticlesContainer className="row--has-wobbly-background">
          <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
            <Layout12>
              <FeaturedCardArticle
                article={firstArticle}
                background="charcoal"
                color="white"
              />
            </Layout12>
          </Space>
          <div className="row__wobbly-background" />
          <div className="container container--scroll container--scroll-cream touch-scroll">
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
          </div>
        </ArticlesContainer>
      </SpacingSection>

      {newStoriesLanding ? (
        <>
          <SpacingSection>
            {storiesLanding.storiesTitle && (
              <SpacingComponent>
                <SectionHeader title={`${storiesLanding.storiesTitle}`} />
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
        </>
      ) : (
        <>
          <SpacingSection>
            <SerialisedSeries series={series} />
          </SpacingSection>
          <SpacingSection>
            <SpacingComponent>
              <SectionHeader title="Books" />
            </SpacingComponent>
            <SpacingComponent>
              <Layout12>
                <p>{booksPromoOnStoriesPage}</p>
              </Layout12>
            </SpacingComponent>
            <SpacingComponent>
              <CardGrid
                items={featuredBooks}
                itemsPerRow={3}
                links={[{ text: 'More books', url: '/books' }]}
              />
            </SpacingComponent>
          </SpacingSection>
        </>
      )}

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
