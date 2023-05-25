import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchArticles } from '@weco/content/services/prismic/fetch/articles';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '@weco/content/services/prismic/transformers/articles';
import { articleLd } from '@weco/content/services/prismic/transformers/json-ld';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/content/components/LayoutPaginatedResults/LayoutPaginatedResults';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { getPage } from '@weco/content/utils/query-params';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { ArticleBasic } from '@weco/content/types/articles';
import { setCacheControl } from '@weco/common/utils/setCacheControl';

type Props = {
  articles: PaginatedResults<ArticleBasic>;
  jsonLd: JsonLdObj[];
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const client = createClient(context);
  const articlesQuery = await fetchArticles(client, { page });

  const articles = transformQuery(articlesQuery, transformArticle);
  const jsonLd = articles.results.map(articleLd);
  const basicArticles = {
    ...articles,
    results: articles.results.map(transformArticleToArticleBasic),
  };

  const serverData = await getServerData(context);

  return {
    props: serialiseProps({
      articles: basicArticles,
      jsonLd,
      serverData,
    }),
  };
};

const ArticlesPage: FunctionComponent<Props> = ({
  articles,
  jsonLd,
}: Props) => {
  // `articles` could be empty if somebody paginates off the end of the list,
  // e.g. /articles?page=500
  const image = articles.results[0]?.image;

  return (
    <PageLayout
      title="Articles"
      description={pageDescriptions.articles}
      url={{ pathname: '/articles' }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="stories"
      image={image}
    >
      <SpacingSection>
        <LayoutPaginatedResults
          title="Stories"
          description={pageDescriptions.articles}
          paginatedResults={articles}
        />
      </SpacingSection>
    </PageLayout>
  );
};

export default ArticlesPage;
