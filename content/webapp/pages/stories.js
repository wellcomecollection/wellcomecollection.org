// @flow
import {Component} from 'react';
import {getArticles} from '@weco/common/services/prismic/articles';
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
      <div>
        {articleResults.results.map(article => (<h1 key={article.id}>{article.title}</h1>))}
      </div>
    );
  }
}

export default PageWrapper(StoriesPage);
