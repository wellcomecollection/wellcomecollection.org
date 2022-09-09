import { NextApiRequest, NextApiResponse } from 'next';
import { isNotUndefined, isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import { fetchEvents } from '../../../services/prismic/fetch/events';
import { transformEvent } from '../../../services/prismic/transformers/events';
import { transformQuery } from '../../../services/prismic/transformers/paginated-results';
import superjson from 'superjson';

type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<string | NotFound>
): Promise<void> => {
  const { params } = req.query;
  const parsedParams = isString(params) ? JSON.parse(params) : undefined;

  if (isNotUndefined(parsedParams)) {
    const client = createClient({ req });
    const query = await fetchEvents(client, parsedParams);

    if (query) {
      const events = transformQuery(query, transformEvent);
      return res.status(200).json(superjson.stringify(events));
    }
  }

  return res.status(404).json({ notFound: true });
};
