import { NextApiRequest, NextApiResponse } from 'next';
import { isNotUndefined, isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import {
  parseQuery,
  transformMultiContent,
} from '../../../services/prismic/transformers/multi-content';
import { fetchMultiContent } from '../../../services/prismic/fetch/multi-content';
import { transformQuery } from '../../../services/prismic/transformers/paginated-results';
import superjson from 'superjson';

type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<string | NotFound>
): Promise<void> => {
  const { params } = req.query;
  const parsedQuery = isString(params) ? parseQuery(params) : undefined;

  if (isNotUndefined(parsedQuery)) {
    const client = createClient({ req });
    const query = await fetchMultiContent(client, parsedQuery);

    if (query) {
      const multiContent = transformQuery(query, transformMultiContent);
      return res.status(200).json(superjson.stringify(multiContent));
    }
  }

  return res.status(404).json({ notFound: true });
};
