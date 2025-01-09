import { WellcomeApiError } from '@weco/content/services/wellcome';
import { Toggles } from '@weco/toggles';

import { contentDocumentQuery } from '.';
import { Article } from './types/api';

export async function getArticle({
  id,
  toggles,
}: {
  id: string;
  toggles: Toggles;
}): Promise<Article | WellcomeApiError> {
  const getArticleResult = await contentDocumentQuery<Article>(
    `articles/${id}`,
    { toggles }
  );

  return getArticleResult;
}
