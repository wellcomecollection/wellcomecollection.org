// @flow
import type { Context } from 'next';
import { Component } from 'react';
import { getArticles } from '@weco/common/services/prismic/articles';
import { getArticleSeries } from '@weco/common/services/prismic/article-series';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { articleLd } from '@weco/common/utils/json-ld';
import { classNames, grid } from '@weco/common/utils/classnames';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
// $FlowFixMe (tsx)
import StoryPromo from '@weco/common/views/components/StoryPromo/StoryPromo';
// $FlowFixMe (tsx)
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
// $FlowFixMe (tsx)
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import type { Article } from '@weco/common/model/articles';
import type { ArticleSeries } from '@weco/common/model/article-series';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
// $FlowFixMe (tsx)
import Space from '@weco/common/views/components/styled/Space';
import { staticBooks } from '../content/static-books';
import { FeaturedCardArticle } from '@weco/common/views/components/FeaturedCard/FeaturedCard';
import { prismicPageIds } from '@weco/common/services/prismic/hardcoded-id';
import FeaturedText from '@weco/common/views/components/FeaturedText/FeaturedText';
import { defaultSerializer } from '@weco/common/services/prismic/html-serializers';
import {
  getPage,
  getPageFeaturedText,
} from '@weco/common/services/prismic/pages';
import { type FeaturedText as FeaturedTextType } from '@weco/common/model/text';
// $FlowFixMe (tsx)
import { SectionPageHeader } from '@weco/common/views/components/styled/SectionPageHeader';

type Props = {|
  articles: PaginatedResults<Article>,
  series: ArticleSeries,
  featuredText: ?FeaturedTextType,
|};

const SerialisedSeries = ({ series }: any) => {
  return (
    <div>
      <Layout12>
        <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
          <h2
            className={classNames({
              h1: true,
              [`font-${series.color}`]: true,
              'plain-link': true,
              'no-margin': true,
            })}
          >
            <a
              className={classNames({
                'plain-link': true,
              })}
              href={`/series/${series.id}`}
            >
              {series.title}
            </a>
          </h2>
          <Space v={{ size: 'm', properties: ['margin-top'] }}>
            <p
              className={classNames({
                'no-margin': true,
              })}
            >
              {series.promoText}
            </p>
          </Space>
        </Space>
      </Layout12>
      <CardGrid items={series.items} hidePromoText={true} itemsPerRow={3} />
    </div>
  );
};

const pageDescription =
  'Our words and pictures explore the connections between science, medicine, life and art. Dive into a story no matter where in the world you are.';
export class StoriesPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { page = 1, memoizedPrismic } = ctx.query;
    const articlesPromise = getArticles(ctx.req, { page }, memoizedPrismic);
    const seriesPromise = getArticleSeries(
      ctx.req,
      { id: 'YIBhZBAAACgA1R1B' },
      memoizedPrismic
    );

    const storiesPagePromise = await getPage(
      ctx.req,
      prismicPageIds.stories,
      memoizedPrismic
    );

    const [articles, seriesAndArticles, storiesPage] = await Promise.all([
      articlesPromise,
      seriesPromise,
      storiesPagePromise,
    ]);
    const series = seriesAndArticles && seriesAndArticles.series;
    const featuredText = storiesPage && getPageFeaturedText(storiesPage);
    if (articles && articles.results) {
      return {
        articles,
        series,
        featuredText,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const series = this.props.series;
    const articles = this.props.articles.results;
    const firstArticle = articles[0];
    const { featuredText } = this.props;
    return (
      <PageLayout
        title={'Stories'}
        description={pageDescription}
        url={{ pathname: `/stories` }}
        jsonLd={articles.map(articleLd)}
        openGraphType={'website'}
        siteSection={'stories'}
        imageUrl={
          firstArticle &&
          firstArticle.image &&
          convertImageUri(firstArticle.image.contentUrl, 800)
        }
        imageAltText={
          firstArticle && firstArticle.image && firstArticle.image.alt
        }
        rssUrl={'https://rss.wellcomecollection.org/stories'}
      >
        <SpacingSection>
          <Space
            v={{
              size: 'l',
              properties: ['padding-top', 'padding-bottom'],
            }}
            className={classNames({
              row: true,
            })}
          >
            <div className="container">
              <div className="grid">
                <div
                  className={classNames({
                    [grid({ s: 12, m: 12, l: 7, xl: 7 })]: true,
                  })}
                >
                  <SectionPageHeader sectionLevelPage={true}>
                    Stories
                  </SectionPageHeader>
                  {featuredText && featuredText.value && (
                    <Space
                      v={{
                        size: 's',
                        properties: ['margin-top'],
                      }}
                      className={classNames({
                        'first-para-no-margin body-text': true,
                      })}
                    >
                      {
                        <FeaturedText
                          html={featuredText.value}
                          htmlSerializer={defaultSerializer}
                        />
                      }
                    </Space>
                  )}
                </div>
              </div>
            </div>
          </Space>
        </SpacingSection>

        <SpacingSection>
          <div
            className={classNames({
              'row bg-cream row--has-wobbly-background': true,
            })}
          >
            <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
              <Layout12>
                <FeaturedCardArticle
                  article={firstArticle}
                  background={'charcoal'}
                  color={'white'}
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
                        <StoryPromo item={article} position={i} />
                      </div>
                    );
                  })}
                </div>
              </Space>
            </div>
          </div>
        </SpacingSection>

        <SpacingSection>
          <SerialisedSeries series={series} />
        </SpacingSection>

        {/* TODO: work out logic for making these dynamic */}
        <SpacingSection>
          <SpacingComponent>
            <SectionHeader title="Books" />
          </SpacingComponent>
          <SpacingComponent>
            <Layout12>
              <p>
                Get stuck into one of our books, and explore the complexities of
                the human condition.
              </p>
            </Layout12>
          </SpacingComponent>
          <SpacingComponent>
            <CardGrid
              items={staticBooks}
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
  }
}

export default StoriesPage;
