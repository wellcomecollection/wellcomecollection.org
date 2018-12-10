// @flow
import {Component} from 'react';
import {getArticles} from '@weco/common/services/prismic/articles';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {articleLd} from '@weco/common/utils/json-ld';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import type {Article} from '@weco/common/model/articles';
import type {PaginatedResults} from '@weco/common/services/prismic/types';

type Props = {|
  articles: PaginatedResults<Article>
|}

const pageDescription = 'Our words and pictures explore the connections between science, medicine, life and art. Dive into one no matter where in the world you are.';
export class ArticlesPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps): Promise<?Props> => {
    const {page = 1} = context.query;
    const articles = await getArticles(context.req, {page});
    if (articles) {
      return {
        articles
      };
    }
  }

  render() {
    const {articles} = this.props;
    const firstArticle = articles.results[0];

    return (
      <PageLayout
        title={'Article'}
        description={pageDescription}
        url={{pathname: `/articles`}}
        jsonLd={articles.results.map(articleLd)}
        openGraphType={'website'}
        imageUrl={firstArticle && firstArticle.image && convertImageUri(firstArticle.image.contentUrl, 800)}
        imageAltText={firstArticle && firstArticle.image && firstArticle.image.alt}>
        <LayoutPaginatedResults
          showFreeAdmissionMessage={false}
          title={'Articles'}
          description={[{
            type: 'paragraph',
            text: pageDescription,
            spans: []
          }]}
          paginatedResults={articles}
          paginationRoot={'articles'}
        />
      </PageLayout>
    );
  }
};

export default ArticlesPage;
