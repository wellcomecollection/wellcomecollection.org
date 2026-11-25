import { NextApiRequest, NextApiResponse } from 'next';

import { serialiseDates as serialiseJsonDates } from '@weco/common/utils/json';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchArticles } from '@weco/content/services/prismic/fetch/articles';
import { parseClientSideListParams } from '@weco/content/services/prismic/fetch/client-side-params';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '@weco/content/services/prismic/transformers/articles';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';

type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<string | NotFound>
): Promise<void> => {
  // Reject anybody trying to send nonsense to the API
  const parsedParams = parseClientSideListParams(req.query.params);
  if (!parsedParams) {
    return res.status(404).json({ notFound: true });
  }

  const client = createClient({ req });
  const query = await fetchArticles(client, parsedParams);

  if (query) {
    const articles = transformQuery(query, article =>
      transformArticleToArticleBasic(transformArticle(article))
    );
    return res
      .status(200)
      .json(serialiseJsonDates(articles) as unknown as string);
  }
};
