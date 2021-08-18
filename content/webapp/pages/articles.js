// @flow
import type { Context } from 'next';
import type { Article } from '@weco/common/model/articles';
import type {
  PaginatedResults,
  PrismicApiError,
} from '@weco/common/services/prismic/types';
import { getArticles } from '@weco/common/services/prismic/articles';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { articleLd } from '@weco/common/utils/json-ld';
// $FlowFixMe (tsx)
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
// $FlowFixMe
import { getGlobalContextData } from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';

type Props = {|
  articles: PaginatedResults<Article>,
  globalContextData: any,
|};

const pageDescription =
  'Our words and pictures explore the connections between science, medicine, life and art. Dive into one no matter where in the world you are.';

const ArticlesPage = ({ articles, globalContextData }: Props) => {
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
        firstArticle && firstArticle.image && firstArticle.image.alt
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

ArticlesPage.getInitialProps = async (
  ctx: Context
): Promise<?Props | PrismicApiError> => {
  const globalContextData = getGlobalContextData(ctx);
  const { page = 1, memoizedPrismic } = ctx.query;
  const articles = await getArticles(ctx.req, { page }, memoizedPrismic);

  return {
    articles,
    globalContextData,
  };
};

export default ArticlesPage;
