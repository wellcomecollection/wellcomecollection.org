// @flow
import {Component} from 'react';
import {getArticles} from '@weco/common/services/prismic/articles';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {articleLd} from '@weco/common/utils/json-ld';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import type {Article} from '@weco/common/model/articles';
import type {PaginatedResults} from '@weco/common/services/prismic/types';

type Props = {|
  articles: PaginatedResults<Article>
|}

const pageDescription = 'Our words and pictures explore the connections between science, medicine, life and art. Dive into one no matter where in the world you are.';
export class BooksListPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {page = 1} = context.query;
    const articles = await getArticles(context.req, {page});
    if (articles && articles.results) {
      const firstArticle = articles.results[0];
      return {
        articles,
        title: 'Articles',
        description: pageDescription,
        type: 'website',
        canonicalUrl: `https://wellcomecollection.org/articles`,
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
    const {articles} = this.props;

    return (
      <LayoutPaginatedResults
        title={'Articles'}
        description={[{
          type: 'paragraph',
          text: pageDescription,
          spans: []
        }]}
        paginatedResults={articles}
        paginationRoot={'articles'}
      />
    );
  }
};

export default PageWrapper(BooksListPage);
