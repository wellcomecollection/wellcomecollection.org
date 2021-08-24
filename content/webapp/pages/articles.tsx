import type { Article } from '@weco/common/model/articles';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import { getArticles } from '@weco/common/services/prismic/articles';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { articleLd } from '@weco/common/utils/json-ld';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import {
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';

type Props = {
  articles: PaginatedResults<Article>;
} & WithGlobalContextData;

const pageDescription =
  'Our words and pictures explore the connections between science, medicine, life and art. Dive into one no matter where in the world you are.';

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const globalContextData = getGlobalContextData(context);
    const { page = 1, memoizedPrismic } = context.query;
    const articles = await getArticles(context.req, { page }, memoizedPrismic);

    return {
      props: removeUndefinedProps({
        articles,
        globalContextData,
      }),
    };
  };

const ArticlesPage: FC<Props> = ({ articles, globalContextData }: Props) => {
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
      globalContextData={globalContextData}
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
