import { Article } from './types/api';
import {
  ContentApiProps,
  ContentResultsList,
} from '@weco/catalogue/services/wellcome/content/types/api';
import { contentQuery } from '.';
import { QueryProps, WellcomeApiError } from '..';

export async function getArticles(
  props: QueryProps<ContentApiProps>
): Promise<ContentResultsList<Article> | WellcomeApiError> {
  const getArticlesResult = await contentQuery('articles', props);

  return getArticlesResult;
}
