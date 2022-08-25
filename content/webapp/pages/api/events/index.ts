import { NextApiRequest, NextApiResponse } from 'next';
import { isNotUndefined, isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import { fetchEvents } from '../../../services/prismic/fetch/events';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { Event } from '../../../types/events';
import { transformEvent } from '../../../services/prismic/transformers/events';
import { transformQuery } from '../../../services/prismic/transformers/paginated-results';

type Data = PaginatedResults<Event>;
type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | NotFound>
): Promise<void> => {
  const { params } = req.query;
  const parsedParams = isString(params) ? JSON.parse(params) : undefined;

  if (isNotUndefined(parsedParams)) {
    const client = createClient({ req });
    const query = await fetchEvents(client, parsedParams);

    if (query) {
      const events = transformQuery(query, transformEvent);
      return res.status(200).json(events);
    }
  }

  return res.status(404).json({ notFound: true });
};
