import type { Article } from '@weco/common/model/articles';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '../components/LayoutPaginatedResults/LayoutPaginatedResults';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { appError, AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { articleLd } from '../services/prismic/transformers/json-ld';
import { isString } from '@weco/common/utils/array';
import { fetchArticles } from '../services/prismic/fetch/articles';
import { createClient } from '../services/prismic/fetch';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import { transformArticle } from '../services/prismic/transformers/articles';

type Props = {
  articles: PaginatedResults<Article>;
};

const pageDescription =
  'Our words and pictures explore the connections between science, medicine, life and art. Dive into one no matter where in the world you are.';

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const { page = '1' } = context.query;
    if (!isString(page)) {
      return { notFound: true };
    }
    const parsedPage = parseInt(page, 10);
    if (isNaN(parsedPage)) {
      return appError(context, 400, `${page} is not a number`);
    }

    const client = createClient(context);
    const articlesQuery = await fetchArticles(client, {
      page: parsedPage,
      pageSize: 21,
    });
    const articles = transformQuery(articlesQuery, transformArticle);

    const serverData = await getServerData(context);
    return {
      props: removeUndefinedProps({
        articles,
        serverData,
      }),
    };
  };

const ArticlesPage: FC<Props> = ({ articles }: Props) => {
  const firstArticle = articles.results[0];

  return (
    <PageLayout
      title={'Articles'}
      description={pageDescription}
      url={{ pathname: `/articles` }}
      jsonLd={articles.results.map(articleLd)}
      openGraphType={'website'}
      siteSection={'stories'}
      imageUrl={
        firstArticle &&
        firstArticle.image &&
        convertImageUri(firstArticle.image.contentUrl, 800)
      }
      imageAltText={
        (firstArticle && firstArticle.image && firstArticle.image.alt) ??
        undefined
      }
    >
      <SpacingSection>
        <LayoutPaginatedResults
          showFreeAdmissionMessage={false}
          title={'Stories'}
          description={[
            {
              type: 'paragraph',
              text: pageDescription,
              spans: [],
            },
          ]}
          paginatedResults={articles}
          paginationRoot={'articles'}
        />
      </SpacingSection>
    </PageLayout>
  );
};

export default ArticlesPage;
