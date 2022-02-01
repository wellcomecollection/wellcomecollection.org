import { Query } from '@prismicio/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import { EventPrismicDocument } from '../../../services/prismic/types/events';
import { fetchEvents } from 'services/prismic/fetch/events';

type Data = Query<EventPrismicDocument>;
type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | NotFound>
): Promise<void> => {
  const { params } = req.query;
  const parsedParams = isString(params) ? JSON.parse(params) : undefined;
  const client = createClient({ req });
  const response = await fetchEvents(client, parsedParams);

  if (response) {
    return res.status(200).json(response);
  }

  return res.status(404).json({ notFound: true });
};
