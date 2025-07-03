import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchArticle } from '@weco/content/services/prismic/fetch/articles';
import { transformArticle } from '@weco/content/services/prismic/transformers/articles';
import { articleLd } from '@weco/content/services/prismic/transformers/json-ld';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ArticlePage, {
  Props as ArticlePageProps,
} from '@weco/content/views/stories/story';

type Props = ArticlePageProps & {
  pageview: Pageview;
};

const Page: FunctionComponent<ArticlePageProps> = props => {
  return <ArticlePage {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
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
