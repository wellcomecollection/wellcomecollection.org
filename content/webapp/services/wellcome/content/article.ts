import { WellcomeApiError } from '@weco/content/services/wellcome';

import { contentDocumentQuery } from '.';
import { Article } from './types/api';

export async function getArticle({
  id,
  shouldUseStagingApi,
}: {
  id: string;
  shouldUseStagingApi?: boolean;
}): Promise<Article | WellcomeApiError> {
  const getArticleResult = await contentDocumentQuery<Article>(
    `articles/${id}`,
    { shouldUseStagingApi }
  );

  return getArticleResult;
}
