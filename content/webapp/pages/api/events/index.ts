import { NextApiRequest, NextApiResponse } from 'next';

import { serialiseDates as serialiseJsonDates } from '@weco/common/utils/json';
import { createClient } from '@weco/content/services/prismic/fetch';
import { parseClientSideListParams } from '@weco/content/services/prismic/fetch/client-side-params';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { transformEventBasic } from '@weco/content/services/prismic/transformers/events';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // Reject anybody trying to send nonsense to the API
  const parsedParams = parseClientSideListParams(req.query.params);
  if (!parsedParams) {
    return res.status(404).json({ notFound: true });
  }

  const client = createClient({ req });
  const query = await fetchEvents(client, parsedParams);

  if (query) {
    const events = transformQuery(query, transformEventBasic);
    return res.status(200).json(serialiseJsonDates(events));
  }
};
