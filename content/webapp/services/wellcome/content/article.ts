import {
  ApiEnvironmentOverride,
  WellcomeApiError,
} from '@weco/content/services/wellcome';

import { contentDocumentQuery } from '.';
import { Article } from './types/api';

export async function getArticle({
  id,
  apiEnvironment,
}: {
  id: string;
  apiEnvironment?: ApiEnvironmentOverride;
}): Promise<Article | WellcomeApiError> {
  const getArticleResult = await contentDocumentQuery<Article>(
    `articles/${id}`,
    { apiEnvironment }
  );

  return getArticleResult;
}
