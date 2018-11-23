// @flow
import {Component, Fragment} from 'react';
import {getArticles} from '@weco/common/services/prismic/articles';
import {getArticleSeries} from '@weco/common/services/prismic/article-series';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {articleLd} from '@weco/common/utils/json-ld';
import {classNames, spacing, grid, font} from '@weco/common/utils/classnames';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import StoryPromoFeatured from '@weco/common/views/components/StoryPromoFeatured/StoryPromoFeatured';
import StoryPromo from '@weco/common/views/components/StoryPromo/StoryPromo';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import type {Article} from '@weco/common/model/articles';
import type {ArticleSeries} from '@weco/common/model/article-series';
import type {PaginatedResults} from '@weco/common/services/prismic/types';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
type Props = {|
  articles: PaginatedResults<Article>,
  series: ArticleSeries
|}

const SerialisedSeries = ({series}: any) => {
  return (
    <div>
      <Layout12>
        <div className={classNames({
          [spacing({s: 4}, {margin: ['bottom'], padding: ['bottom']})]: true
        })}>
          <h2 className={classNames({
            'h1': true,
            [`font-${series.color}`]: true,
            'plain-link': true,
            'no-margin': true
          })}>
            <a
              className={classNames({
                'plain-link': true
              })}
              href={`/series/${series.id}`}>{series.title}</a>
          </h2>
          <div className={classNames({
            [spacing({s: 2}, {margin: ['top']})]: true
          })}>
            <p className={classNames({
              'no-margin': true
            })}>{series.promoText}</p>
          </div>
        </div>
      </Layout12>
      <CardGrid items={series.items} hidePromoText={true} />
    </div>
  );
};

const pageDescription = 'Our words and pictures explore the connections between science, medicine, life and art. Dive into a story no matter where in the world you are.';
export class StoriesPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {page = 1} = context.query;
    const articlesPromise = getArticles(context.req, {page});
    const seriesPromise = getArticleSeries(context.req, {id: 'W1boEyYAACgAqwfw'});
    const [articles, seriesAndArticles] = await Promise.all([articlesPromise, seriesPromise]);
    const series = seriesAndArticles && seriesAndArticles.series;

    if (articles && articles.results) {
      const firstArticle = articles.results[0];
      return {
        articles,
        series,
        title: 'Stories',
        description: pageDescription,
        type: 'website',
        canonicalUrl: `https://wellcomecollection.org/stories`,
        imageUrl: firstArticle && firstArticle.image && convertImageUri(firstArticle.image.contentUrl, 800),
        siteSection: 'stories',
        analyticsCategory: 'editorial',
        jsonPageLd: articles.results.map(articleLd)
      };
    } else {
      return {statusCode: 404};
    }
  }

  render() {
    const series = this.props.series;
    const articles = this.props.articles.results;

    return (
      <Fragment>
        <SpacingSection>
          <div className={classNames({
            'row': true,
            'bg-cream': true,
            'plain-text': true,
            [spacing({s: 3, m: 5, l: 5}, {padding: ['top', 'bottom']})]: true
          })}>
            <div className='container'>
              <div className='grid'>
                <div className={classNames({
                  [grid({s: 12, m: 12, l: 7, xl: 8})]: true
                })}>
                  <h1 className={classNames({
                    'no-margin': true,
                    [font({s: 'WB6', m: 'WB5', l: 'WB4'})]: true
                  })}>Stories</h1>

                  <div className={classNames({
                    'first-para-no-margin': true,
                    [spacing({s: 2}, {margin: ['top']})]: true
                  })}>
                    {/* Taken from Prismic, so I know it's right. But a bit rubbish. */}
                    <PrismicHtmlBlock html={[{
                      type: 'paragraph',
                      text: 'Our words and pictures explore the connections between science, medicine, life and art. Dive into a story no matter where in the world you are. (Want to write for us? Here\'s how.)',
                      spans: [{
                        start: 145,
                        end: 177,
                        type: 'hyperlink',
                        data: {
                          link_type: 'Web',
                          url: 'https://wellcomecollection.org/pages/Wvl00yAAAB8A3y8p'
                        }
                      }]
                    }]} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SpacingSection>

        <SpacingSection>
          <div className={classNames({
            'row bg-cream row--has-wobbly-background': true
          })}>
            <div className='container'>
              <div className='grid'>
                <div className={grid({s: 12, m: 12, l: 12, xl: 12})}>
                  <StoryPromoFeatured item={articles[0]} />
                </div>
              </div>
            </div>
            <div className='row__wobbly-background'></div>
            <div className='container'>
              <div className={classNames({
                [spacing({s: 4}, {margin: ['bottom']})]: true
              })}>
              </div>
            </div>
            <div className='container container--scroll container--scroll-cream touch-scroll'>
              <div className='grid grid--scroll grid--theme-4'>
                {articles.slice(1, 5).map((article, i) => {
                  return (
                    <div className='grid__cell' key={article.id}>
                      <StoryPromo
                        item={article}
                        position={i}
                        hasTransparentBackground={true} />
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

        <SpacingSection>
          <SectionHeader
            title='You may have missed'
            linkText='More articles'
            linkUrl='/articles' />

          <CardGrid items={articles.slice(5, 11)} />
        </SpacingSection>
      </Fragment>
    );
  }
};

export default PageWrapper(StoriesPage);
