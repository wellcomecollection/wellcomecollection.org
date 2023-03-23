import { NextApiRequest, NextApiResponse } from 'next';
import { isString } from '@weco/common/utils/type-guards';
import { isJson } from '@weco/common/utils/json';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { transformEventBasic } from '@weco/content/services/prismic/transformers/events';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import superjson from 'superjson';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { params } = req.query;

  // Reject anybody trying to send nonsense to the API
  if (!isString(params) || !isJson(params)) {
    return res.status(404).json({ notFound: true });
  }

  const parsedParams = JSON.parse(params);

  const client = createClient({ req });
  const query = await fetchEvents(client, parsedParams);

  if (query) {
    const events = transformQuery(query, transformEventBasic);
    return res.status(200).json(superjson.serialize(events));
  }
};
