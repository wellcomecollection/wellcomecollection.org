import type { NextApiRequest, NextApiResponse } from 'next';

import { serialiseDates as serialiseJsonDates } from '@weco/common/utils/json';
import { createClient } from '@weco/content/services/prismic/fetch';
import { parseClientSideDocumentIds } from '@weco/content/services/prismic/fetch/client-side-params';
import { fetchExhibitionRelatedContent } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformExhibitionRelatedContent } from '@weco/content/services/prismic/transformers/exhibitions';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // Reject anybody trying to send nonsense to the API
  const parsedParams = parseClientSideDocumentIds(req.query.params);
  if (!parsedParams) {
    return res.status(404).json({ notFound: true });
  }
  const client = createClient({ req });

  if (parsedParams.length === 0) {
    return res.status(200).json({
      relatedExhibitionsAndEvents: [],
      aboutThisExhibitionContent: [],
    });
  }

  const query = await fetchExhibitionRelatedContent(client, parsedParams);

  if (query) {
    const exhibitions = transformExhibitionRelatedContent(query);
    return res.status(200).json(serialiseJsonDates(exhibitions));
  }

  return res.status(404).json({ notFound: true });
};
