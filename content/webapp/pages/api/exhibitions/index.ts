import type { NextApiRequest, NextApiResponse } from 'next';
import { isNotUndefined, isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import { fetchExhibitions } from '../../../services/prismic/fetch/exhibitions';
import { transformExhibitionsQuery } from '../../../services/prismic/transformers/exhibitions';
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
    const query = await fetchExhibitions(client, parsedParams);

    if (query) {
      const exhibitions = transformExhibitionsQuery(query);
      return res.status(200).json(superjson.stringify(exhibitions));
    }
  }

  return res.status(404).json({ notFound: true });
};
