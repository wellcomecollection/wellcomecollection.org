import { WellcomeApiError } from '@weco/content/services/wellcome';
import { FeatureFlags } from '@weco/toggles';

import { contentDocumentQuery } from '.';
import { Article } from './types/api';

export async function getArticle({
  id,
  featureFlags,
}: {
  id: string;
  featureFlags: FeatureFlags;
}): Promise<Article | WellcomeApiError> {
  const getArticleResult = await contentDocumentQuery<Article>(
    `articles/${id}`,
    { featureFlags }
  );

  return getArticleResult;
}
