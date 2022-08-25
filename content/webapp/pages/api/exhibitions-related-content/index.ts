import type { NextApiRequest, NextApiResponse } from 'next';
import { isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import { fetchExhibitionRelatedContent } from '../../../services/prismic/fetch/exhibitions';
import { transformExhibitionRelatedContent } from '../../../services/prismic/transformers/exhibitions';
import { ExhibitionRelatedContent } from '../../../types/exhibitions';

type Data = ExhibitionRelatedContent;
type NotFound = { notFound: true };
type UserError = { description: string };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | NotFound | UserError>
): Promise<void> => {
  const { params } = req.query;

  if (!isString(params)) {
    return res.status(400).json({ description: 'Missing params' });
  }

  const parsedParams: string[] = JSON.parse(params);
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
    return res.status(200).json(exhibitions);
  }

  return res.status(404).json({ notFound: true });
};
