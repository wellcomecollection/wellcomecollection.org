import type { NextApiRequest, NextApiResponse } from 'next';

import { serialiseDates as serialiseJsonDates } from '@weco/common/utils/json';
import { createClient } from '@weco/content/services/prismic/fetch';
import { parseClientSideListParams } from '@weco/content/services/prismic/fetch/client-side-params';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformExhibitionsQuery } from '@weco/content/services/prismic/transformers/exhibitions';

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
  const query = await fetchExhibitions(client, parsedParams);

  if (query) {
    const exhibitions = transformExhibitionsQuery(query);
    return res.status(200).json(serialiseJsonDates(exhibitions));
  }
};
