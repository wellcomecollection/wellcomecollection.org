import type { NextApiRequest, NextApiResponse } from 'next';
import { isJson, isString } from '@weco/common/utils/array';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformExhibitionsQuery } from '@weco/content/services/prismic/transformers/exhibitions';
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
  const query = await fetchExhibitions(client, parsedParams);

  if (query) {
    const exhibitions = transformExhibitionsQuery(query);
    return res.status(200).json(superjson.stringify(exhibitions));
  }
};
