import { isString } from '@weco/common/utils/array';
import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchSeries } from 'services/prismic/fetch/series';
import { createClient } from '../../../services/prismic/fetch';
import { SeriesPrismicDocument } from '../../../services/prismic/series';

type Data = SeriesPrismicDocument;
type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | NotFound>
) => {
  const { id } = req.query;
  if (!isString(id)) {
    return res.status(404).json({ notFound: true });
  }

  const client = createClient(req);
  const response = await fetchSeries(client, id);

  if (response) {
    return res.status(200).json(response);
  }

  return res.status(404).json({ notFound: true });
};
