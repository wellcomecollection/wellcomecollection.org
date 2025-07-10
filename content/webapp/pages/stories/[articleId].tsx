import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchArticle } from '@weco/content/services/prismic/fetch/articles';
import { transformArticle } from '@weco/content/services/prismic/transformers/articles';
import { articleLd } from '@weco/content/services/prismic/transformers/json-ld';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ArticlePage, {
  Props as ArticlePageProps,
} from '@weco/content/views/pages/stories/story';

const Page: NextPage<ArticlePageProps> = props => {
  return <ArticlePage {...props} />;
};

type Props = ServerSideProps<ArticlePageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const { articleId } = context.query;

  if (!looksLikePrismicId(articleId)) {
    return { notFound: true };
  }

  const client = createClient(context);
  const articleDocument = await fetchArticle(client, articleId);

  if (isNotUndefined(articleDocument)) {
    const serverData = await getServerData(context);
    const article = transformArticle(articleDocument);
    const jsonLd = articleLd(article);

    return {
      props: serialiseProps<Props>({
        article,
        jsonLd,
        serverData,
        pageview: {
          name: 'story',
          properties: { type: articleDocument.type },
        },
      }),
    };
  }

  return { notFound: true };
};

export default Page;
