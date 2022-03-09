import type { NextApiRequest, NextApiResponse } from 'next';
import { isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import { fetchExhibitions } from '../../../services/prismic/fetch/exhibitions';
import { transformExhibitionsQuery } from '../../../services/prismic/transformers/exhibitions';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { Exhibition } from '../../../types/exhibitions';

type Data = PaginatedResults<Exhibition>;
type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | NotFound>
): Promise<void> => {
  const { params } = req.query;
  const parsedParams = isString(params) ? JSON.parse(params) : undefined;
  const client = createClient({ req });
  const query = await fetchExhibitions(client, parsedParams);

  if (query) {
    const exhibitions = transformExhibitionsQuery(query);
    return res.status(200).json(exhibitions);
  }

  return res.status(404).json({ notFound: true });
};
