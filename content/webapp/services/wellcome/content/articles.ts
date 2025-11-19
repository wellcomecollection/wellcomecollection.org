import { QueryProps, WellcomeApiError } from '@weco/content/services/wellcome';
import {
  ContentApiProps,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';

import { contentListQuery } from '.';
import { Article } from './types/api';

type ArticleParams = ContentApiProps & {
  linkedWork?: string;
};

export async function getArticles(
  props: QueryProps<ArticleParams>
): Promise<ContentResultsList<Article> | WellcomeApiError> {
  const getArticlesResult = await contentListQuery<ArticleParams, Article>(
    'articles',
    props
  );

  return getArticlesResult;
}
