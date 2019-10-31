// @flow
import type { Context } from 'next';
import { Component } from 'react';
import { getArticles } from '@weco/common/services/prismic/articles';
import { getArticleSeries } from '@weco/common/services/prismic/article-series';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { articleLd } from '@weco/common/utils/json-ld';
import { classNames, grid, font } from '@weco/common/utils/classnames';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import StoryPromo from '@weco/common/views/components/StoryPromo/StoryPromo';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import type { Article } from '@weco/common/model/articles';
import type { ArticleSeries } from '@weco/common/model/article-series';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import { staticBooks } from '../content/static-books';
import { FeaturedCardArticle } from '@weco/common/views/components/FeaturedCard/FeaturedCard';

type Props = {|
  articles: PaginatedResults<Article>,
  series: ArticleSeries,
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
    const { page = 1 } = ctx.query;
    const articlesPromise = getArticles(ctx.req, { page });
    const seriesPromise = getArticleSeries(ctx.req, { id: 'XXY7ixAAACUACJvS' });
    const [articles, seriesAndArticles] = await Promise.all([
      articlesPromise,
      seriesPromise,
    ]);
    const series = seriesAndArticles && seriesAndArticles.series;

    if (articles && articles.results) {
      return {
        articles,
        series,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const series = this.props.series;
    const articles = this.props.articles.results;
    const firstArticle = articles[0];

    return (
      <PageLayout
        title={'Stories'}
        description={pageDescription}
        url={{ pathname: `/articles` }}
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
              'bg-cream': true,
            })}
          >
            <div className="container">
              <div className="grid">
                <div
                  className={classNames({
                    [grid({ s: 12, m: 12, l: 7, xl: 8 })]: true,
                  })}
                >
                  <h1
                    className={classNames({
                      'no-margin': true,
                      [font('wb', 2)]: true,
                    })}
                  >
                    Stories
                  </h1>

                  <Space
                    v={{
                      size: 'm',
                      properties: ['margin-top'],
                    }}
                    className={classNames({
                      'first-para-no-margin body-text': true,
                    })}
                  >
                    {/* Taken from Prismic, so I know it's right. But a bit rubbish. */}
                    <PrismicHtmlBlock
                      html={[
                        {
                          type: 'paragraph',
                          text:
                            "Our words and pictures explore the connections between science, medicine, life and art. Dive into a story no matter where in the world you are. (Want to write for us? Here's how.)",
                          spans: [
                            {
                              start: 145,
                              end: 177,
                              type: 'hyperlink',
                              data: {
                                link_type: 'Web',
                                url:
                                  'https://wellcomecollection.org/pages/Wvl00yAAAB8A3y8p',
                              },
                            },
                          ],
                        },
                      ]}
                    />
                  </Space>
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
              <FeaturedCardArticle
                article={firstArticle}
                background={'charcoal'}
                color={'white'}
              />
            </Space>
            <div className="row__wobbly-background" />
            <div className="container container--scroll container--scroll-cream touch-scroll">
              <div className="grid grid--scroll grid--theme-4">
                {articles.slice(1, 5).map((article, i) => {
                  return (
                    <div className="grid__cell" key={article.id}>
                      <StoryPromo
                        item={article}
                        position={i}
                        hasTransparentBackground={true}
                      />
                    </div>
                  );
                })}
              </div>
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
              links={[{ text: 'More articles', url: '/articles' }]}
            />
          </SpacingComponent>
        </SpacingSection>
      </PageLayout>
    );
  }
}

export default StoriesPage;
