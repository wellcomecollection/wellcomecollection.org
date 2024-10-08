import { NextApiRequest, NextApiResponse } from 'next';

import { serialiseDates as serialiseJsonDates } from '@weco/common/utils/json';
import { isString } from '@weco/common/utils/type-guards';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchMultiContent } from '@weco/content/services/prismic/fetch/multi-content';
import {
  parseQuery,
  transformMultiContent,
} from '@weco/content/services/prismic/transformers/multi-content';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { params } = req.query;

  // Reject anybody trying to send nonsense to the API
  if (!isString(params)) {
    return res.status(404).json({ notFound: true });
  }

  const parsedQuery = parseQuery(params);

  const client = createClient({ req });
  const query = await fetchMultiContent(client, parsedQuery);

  if (query) {
    const multiContent = transformQuery(query, transformMultiContent);
    return res.status(200).json(serialiseJsonDates(multiContent));
  }
};
