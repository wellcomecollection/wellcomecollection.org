// @flow
import {Component, Fragment} from 'react';
import {getArticles} from '@weco/common/services/prismic/articles';
import {getArticleSeries} from '@weco/common/services/prismic/article-series';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {articleLd} from '@weco/common/utils/json-ld';
import {classNames, spacing, grid, font} from '@weco/common/utils/classnames';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import Promo from '@weco/common/views/components/Promo/Promo';
import Divider from '@weco/common/views/components/Divider/Divider';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import type {Article} from '@weco/common/model/articles';
import type {ArticleSeries} from '@weco/common/model/article-series';
import type {PaginatedResults} from '@weco/common/services/prismic/types';

type Props = {|
  articles: PaginatedResults<Article>,
  series: ArticleSeries
|}

const SerialisedSeries = ({series}: any) => {
  return (
    <div>
      <Layout12>
        <div className={classNames({
          [spacing({s: 4}, {margin: ['top', 'bottom']})]: true,
          [spacing({s: 4}, {padding: ['bottom']})]: true,
          'border-bottom-width-1': true,
          'border-color-pumice': true
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

const pageDescription = 'Dive into a story no matter where in the world you are.';
export class StoriesPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {page = 1} = context.query;
    const articlesPromise = getArticles(context.req, {page});
    const seriesPromise = getArticleSeries(context.req, {id: 'WyjG4ycAACrGnmBX'});
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
    const firstArticle = articles[0];
    const firstArticleIsSerial = firstArticle.series.find(series => series.schedule.length > 0);

    return (
      <Fragment>
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
                    text: 'Dive into a story no matter where in the world you are. (Want to write for us? Here\'s how.)',
                    spans: [{
                      start: 57,
                      end: 89,
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

        <div className={classNames({
          'row bg-cream row--has-wobbly-background': true,
          [spacing({s: 10}, {padding: ['top']})]: true
        })}>
          <div className='container'>
            <div className='grid'>
              <div className={grid({s: 12, m: 12, l: 12, xl: 12})}>
                {/* $FlowFixMe */}
                <Promo
                  sizes='(min-width: 1420px) 812px, (min-width: 600px) 58.5vw, calc(100vw - 36px)'
                  url={`/articles/${firstArticle.id}`}
                  contentType={firstArticle.format && firstArticle.format.title || (firstArticleIsSerial ? 'Serial' : 'Story')}
                  image={firstArticle.image}
                  title={firstArticle.title}
                  weight={'featured'}
                  description={firstArticle.promoText}
                  series={firstArticle.series}
                />
              </div>
            </div>
          </div>
          <div className='row__wobbly-background'></div>
          <div className='container'>
            <div className={classNames({
              [spacing({s: 3}, {margin: ['bottom']})]: true
            })}>
              <Divider extraClasses={'divider--keyline divider--pumice'} />
            </div>
          </div>
          <div className='container container--scroll container--scroll-cream touch-scroll'>
            <div className='grid grid--dividers grid--scroll grid--theme-4'>
              {articles.slice(1, 5).map(article => {
                const articleIsSerial = article.series.find(series => series.schedule.length > 0);
                return (
                  <div className='grid__cell' key={article.id}>
                    {/* $FlowFixMe */}
                    <Promo
                      sizes='(min-width: 1340px) 282px, (min-width: 600px) calc(47.22vw - 37px), calc(75vw - 18px)'
                      url={`/articles/${article.id}`}
                      contentType={article.format && article.format.title || (articleIsSerial ? 'Serial' : 'Story')}
                      image={article.image}
                      title={article.title}
                      weight={'featured'}
                      description={article.promoText}
                      series={article.series}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <SerialisedSeries series={series} />

        <SectionHeader
          title='You may have missed'
          linkText='More articles'
          linkUrl='/articles'
        />
        <div className={classNames({
          'row': true,
          [spacing({s: 4}, {padding: ['top']})]: true
        })}>
          <div className='container container--scroll touch-scroll'>
            <div className='grid grid--scroll grid--dividers grid--theme-6'>
              {articles.slice(5, 11).map(article => {
                const articleIsSerial = article.series.find(series => series.schedule.length > 0);
                return (
                  <div className='grid__cell' key={article.id}>
                    {/* $FlowFixMe */}
                    <Promo
                      sizes='(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(75vw - 18px)'
                      url={`/articles/${article.id}`}
                      contentType={article.format && article.format.title || (articleIsSerial ? 'Serial' : 'Story')}
                      image={article.image}
                      title={article.title}
                      weight={'featured'}
                      description={article.promoText}
                      series={article.series}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='container'>
          <div className={classNames({
            [spacing({s: 3}, {margin: ['bottom', 'top']})]: true
          })}>
            <Divider extraClasses={'divider--dashed'} />
          </div>
        </div>
      </Fragment>
    );
  }
};

export default PageWrapper(StoriesPage);
