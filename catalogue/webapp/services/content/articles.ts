import { Toggles } from '@weco/toggles';
import { Content } from './types/api';
import {
  ContentApiError,
  ContentResultsList,
  ContentApiProps,
} from '@weco/catalogue/services/content/types';
import {
  looksLikeCanonicalId,
  notFound,
  contentFetch,
  contentApiError,
  rootUris,
  QueryProps,
  globalApiOptions,
  contentQuery,
} from '.';

type GetContentProps = {
  id: string;
  toggles: Toggles;
};

type ContentResponse = Content | ContentApiError;

export async function getArticle({
  id,
  toggles,
}: GetContentProps): Promise<ContentResponse> {
  if (!looksLikeCanonicalId(id)) {
    return notFound();
  }

  const apiOptions = globalApiOptions(toggles);

  const url = `${rootUris[apiOptions.env]}/v0/content/${id}`;

  const res = await contentFetch(url, { redirect: 'manual' });

  if (res.status === 404) {
    return notFound();
  }

  try {
    return await res.json();
  } catch (e) {
    return contentApiError();
  }
}

export async function getArticles(
  props: QueryProps<ContentApiProps>
): Promise<ContentResultsList<Content> | ContentApiError> {
  const getArticlesResult = await contentQuery('articles', props);

  return getArticlesResult;
}
