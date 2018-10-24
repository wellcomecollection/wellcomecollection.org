// @flow
import {Component} from 'react';
import {getArticles} from '@weco/common/services/prismic/articles';
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
    if (articles) {
      return {
        articles,
        title: 'Articles',
        description: pageDescription,
        type: 'website',
        canonicalUrl: `https://wellcomecollection.org/articles`,
        imageUrl: null,
        siteSection: 'stories',
        analyticsCategory: 'editorial'
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
