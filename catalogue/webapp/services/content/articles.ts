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
import { Story } from '@weco/catalogue/services/prismic/types';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { transformImage } from '@weco/common/services/prismic/transformers/images';

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
): Promise<ContentResultsList<Story> | ContentApiError> {
  const getArticlesResult = await contentQuery('articles', props);
  if (getArticlesResult.type === 'Error') return getArticlesResult;

  // For now with the toggle, transform the Content type into a Story type
  const transformedContent = getArticlesResult.results.map(article => {
    return {
      type: 'articles',
      id: article.id,
      title: article.title,
      summary: article.caption,
      url: linkResolver({ id: article.id, type: 'articles' }),
      image: transformImage(article.image),
      firstPublicationDate:
        article.publicationDate && new Date(article.publicationDate),
      format: article.format?.label,
      contributors: article.contributors.map(c => c.contributor?.label),
    } as Story;
  });

  return { ...getArticlesResult, results: transformedContent };
}
