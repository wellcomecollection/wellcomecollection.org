// @flow
import type {Context} from 'next';
import {Component} from 'react';
import {getArticles} from '@weco/common/services/prismic/articles';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {articleLd} from '@weco/common/utils/json-ld';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import type {Article} from '@weco/common/model/articles';
import type {PaginatedResults} from '@weco/common/services/prismic/types';

type Props = {|
  articles: PaginatedResults<Article>
|}

const pageDescription = 'Our words and pictures explore the connections between science, medicine, life and art. Dive into one no matter where in the world you are.';
export class ArticlesPage extends Component<Props> {
  static getInitialProps = async (ctx: Context): Promise<?Props> => {
    const {page = 1} = ctx.query;
    const articles = await getArticles(ctx.req, {page});
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
        title={'Articles'}
        description={pageDescription}
        url={{pathname: `/articles`}}
        jsonLd={articles.results.map(articleLd)}
        openGraphType={'website'}
        siteSection={'stories'}
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
