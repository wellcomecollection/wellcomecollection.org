// @flow
import {Component, Fragment} from 'react';
import {getArticles} from '@weco/common/services/prismic/articles';
import {classNames, spacing, grid, font} from '@weco/common/utils/classnames';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import type {Article} from '@weco/common/model/articles';
import type {PaginatedResults} from '@weco/common/services/prismic/types';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';

type Props = {|
  articleResults: PaginatedResults<Article>
|}

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

        <div>
          {articleResults.results.map(article => (<h1 key={article.id}>{article.title}</h1>))}
        </div>
      </Fragment>
    );
  }
}

export default PageWrapper(StoriesPage);
