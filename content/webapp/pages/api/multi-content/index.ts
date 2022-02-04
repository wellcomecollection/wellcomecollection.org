import { Query } from '@prismicio/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isNotUndefined, isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import { parseQuery } from 'services/prismic/transformers/multi-content';
import { fetchMultiContent } from 'services/prismic/fetch/multi-content';
import { MultiContentPrismicDocument } from 'services/prismic/types/multi-content';

type Data = Query<MultiContentPrismicDocument>;
type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | NotFound>
): Promise<void> => {
  const { params } = req.query;
  const parsedQuery = isString(params) ? parseQuery(params) : undefined;

  if (isNotUndefined(parsedQuery)) {
    const client = createClient({ req });
    const response = await fetchMultiContent(client, parsedQuery);

    if (response) {
      return res.status(200).json(response);
    }
  }

  return res.status(404).json({ notFound: true });
};
