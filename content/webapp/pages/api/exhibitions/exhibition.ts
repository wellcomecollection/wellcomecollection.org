import type { NextApiRequest, NextApiResponse } from 'next';

import {
  isJson,
  serialiseDates as serialiseJsonDates,
} from '@weco/common/utils/json';
import { isString } from '@weco/common/utils/type-guards';
import { createClient } from '@weco/content/services/prismic/fetch';
import { exhibitionsFetcher } from '@weco/content/services/prismic/fetch/exhibitions';

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

  const exhibitionDocument =
    (await exhibitionsFetcher.getByUid(client, parsedParams.id)) ||
    (await exhibitionsFetcher.getById(client, parsedParams.id));

  if (exhibitionDocument) {
    return res.status(200).json(serialiseJsonDates(exhibitionDocument));
  }
};
