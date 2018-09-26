// @flow
import {Component, Fragment} from 'react';
import {getArticles} from '@weco/common/services/prismic/articles';
import {classNames, spacing, grid, font} from '@weco/common/utils/classnames';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import Promo from '@weco/common/views/components/Promo/Promo';
import Divider from '@weco/common/views/components/Divider/Divider';
import type {Article} from '@weco/common/model/articles';
import type {Image} from '@weco/common/model/image';
import type {Props as ImageProps} from '@weco/common/views/components/Image/Image';
import type {PaginatedResults} from '@weco/common/services/prismic/types';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';

type Props = {|
  articleResults: PaginatedResults<Article>
|}

// This is an annoying piece as we still have a few image types, but we're
// getting there in slimming it down.
function convertImageToImageProps(image: Image): ImageProps {
  const {contentUrl, width, height, alt} = image;
  return {
    contentUrl,
    width,
    height,
    alt,
    lazyload: true
  };
}

function convertArticleToPromo(article: Article, {sizes, weight}): ElementProps<typeof Promo> {
  return {
    sizes,
    url: `/articles/${article.id}`,
    contentType: 'article',
    image: convertImageToImageProps(article.image),
    title: article.title,
    weight: weight,
    description: article.promoText,
    series: article.series
  };
}

export class StoriesPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const articleResults = await getArticles(context.req, { predicates: [] });

    if (articleResults) {
      return {
        articleResults,
        title: 'Stories',
        description: 'Our words and pictures explore the connections between science, medicine, life and art. Dive into one no matter where in the world you are.',
        type: 'website',
        canonicalUrl: `https://wellcomecollection.org/stories`,
        imageUrl: null,
        siteSection: 'stories',
        analyticsCategory: 'editorial'
      };
    } else {
      return {statusCode: 404};
    }
  }

  render() {
    const {articleResults} = this.props;

    if (articleResults.results.length > 0) {
      const firstArticle = articleResults.results[0];
      const secondFourArticles = articleResults.results.slice(1, 5);

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
                <div className={grid({s: 12, m: 12, l: 8, xl: 8})}>
                  <h1 className={classNames({
                    'no-margin': true,
                    [font({s: 'WB6', m: 'WB5', l: 'WB4'})]: true
                  })}>Stories</h1>
                  <div className={classNames({
                    [spacing({s: 2}, {margin: ['top']})]: true
                  })}>
                    <p className={classNames({
                      'no-margin': true
                    })}>
                      Our words and pictures explore the connections between
                      science, medicine, life and art. Dive into one no matter where
                      in the world you are.
                      (<a href='https://wellcomecollection.org/pages/Wvl00yAAAB8A3y8p'>Want to write for us? Here{`'`}s how</a>.)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classNames({
            'row': true,
            'bg-cream': true,
            'row--has-wobbly-background': true,
            [spacing({s: 10}, {padding: ['top']})]: true
          })}>
            <div className='container'>
              <div className='grid'>
                <div className={classNames({
                  [grid({s: 12, m: 12, l: 12, xl: 12})]: true
                })}>
                  <Promo {...convertArticleToPromo(firstArticle, {
                    weight: 'featured',
                    sizes: '(min-width: 1420px) 812px, (min-width: 600px) 58.5vw, calc(100vw - 36px)'
                  })} />
                </div>
              </div>
            </div>
            <div className='row__wobbly-background'></div>
            <div className='container'>
              <Divider extraClasses={classNames({
                'divider--keyline': true,
                'divider--pumice': true,
                [spacing({s: 3}, {margin: ['bottom']})]: true
              })} />
            </div>
            <div className='container container--scroll container--scroll-cream touch-scroll'>
              <div className='grid grid--dividers grid--scroll grid--theme-4'>
                {secondFourArticles.map(article =>
                  <div className='grid__cell' key={article.id}>
                    <Promo {...convertArticleToPromo(article, {
                      weight: 'default',
                      sizes: '(min-width: 1340px) 282px, (min-width: 600px) calc(47.22vw - 37px), calc(75vw - 18px)'
                    })} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            {articleResults.results.map(article => (<h1 key={article.id}>{article.title}</h1>))}
          </div>
        </Fragment>
      );
    } else {
      return <div>Ooops</div>;
    }
  }
}

export default PageWrapper(StoriesPage);
