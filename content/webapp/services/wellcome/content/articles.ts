import { QueryProps, WellcomeApiError } from '@weco/content/services/wellcome';
import {
  ContentApiProps,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';

import { contentQuery } from '.';
import { Article } from './types/api';

export async function getArticles(
  props: QueryProps<ContentApiProps>
): Promise<ContentResultsList<Article> | WellcomeApiError> {
  const getArticlesResult = await contentQuery<ContentApiProps, Article>(
    'articles',
    props
  );

  return getArticlesResult;
}
