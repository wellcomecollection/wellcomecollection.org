import { Query } from '@prismicio/types';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ArticlePrismicDocument } from '../../../services/prismic/articles';
import { isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import { fetchArticles } from '../../../services/prismic/fetch/articles';

type Data = Query<ArticlePrismicDocument>;
type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | NotFound>
) => {
  const { params } = req.query;
  const parsedParams = isString(params) ? JSON.parse(params) : undefined;
  const client = createClient({ req });
  const response = await fetchArticles(client, parsedParams);

  if (response) {
    return res.status(200).json(response);
  }

  return res.status(404).json({ notFound: true });
};
