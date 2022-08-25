import { NextApiRequest, NextApiResponse } from 'next';
import { isNotUndefined, isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import { fetchArticles } from '../../../services/prismic/fetch/articles';
import { transformQuery } from '../../../services/prismic/transformers/paginated-results';
import { transformArticle } from '../../../services/prismic/transformers/articles';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { Article } from '../../../types/articles';

type Data = PaginatedResults<Article>;
type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | NotFound>
): Promise<void> => {
  const { params } = req.query;
  const parsedParams = isString(params) ? JSON.parse(params) : undefined;

  if (isNotUndefined(parsedParams)) {
    const client = createClient({ req });
    const query = await fetchArticles(client, parsedParams);

    if (query) {
      const articles = transformQuery(query, transformArticle);
      return res.status(200).json(articles);
    }
  }

  return res.status(404).json({ notFound: true });
};
