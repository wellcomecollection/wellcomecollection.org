import { NextApiRequest, NextApiResponse } from 'next';
import { isJson, isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import { fetchEvents } from '../../../services/prismic/fetch/events';
import { transformEventBasic } from '../../../services/prismic/transformers/events';
import { transformQuery } from '../../../services/prismic/transformers/paginated-results';
import superjson from 'superjson';

type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<string | NotFound>
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
    return res.status(200).json(superjson.stringify(events));
  }
};
