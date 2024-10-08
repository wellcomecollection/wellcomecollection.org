import type { NextApiRequest, NextApiResponse } from 'next';

import {
  isJson,
  serialiseDates as serialiseJsonDates,
} from '@weco/common/utils/json';
import { isString } from '@weco/common/utils/type-guards';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitionRelatedContent } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformExhibitionRelatedContent } from '@weco/content/services/prismic/transformers/exhibitions';

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

  if (parsedParams.length === 0) {
    return res.status(200).json({
      exhibitionOfs: [],
      exhibitionAbouts: [],
    });
  }

  const query = await fetchExhibitionRelatedContent(client, parsedParams);

  if (query) {
    const exhibitions = transformExhibitionRelatedContent(query);
    return res.status(200).json(serialiseJsonDates(exhibitions));
  }

  return res.status(404).json({ notFound: true });
};
