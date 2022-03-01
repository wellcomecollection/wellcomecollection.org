import type { NextApiRequest, NextApiResponse } from 'next';
import { isString } from '@weco/common/utils/array';
import { createClient } from '../../../services/prismic/fetch';
import { fetchExhibitionRelatedContent } from '../../../services/prismic/fetch/exhibitions';
import { transformExhibitionRelatedContent } from 'services/prismic/transformers/exhibitions';
import { ExhibitionRelatedContent } from 'types/exhibitions';

type Data = ExhibitionRelatedContent;
type NotFound = { notFound: true };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | NotFound>
): Promise<void> => {
  const { params } = req.query;
  const parsedParams: string[] = isString(params)
    ? JSON.parse(params)
    : undefined;
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
