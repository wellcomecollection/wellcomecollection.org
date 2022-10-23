import {
  catalogueApiError,
  prismicFetch,
  // globalApiOptions,
  looksLikeCanonicalId,
  notFound,
  // rootUris,
} from './index';

import { Toggles } from '@weco/toggles';
import { CatalogueApiError, Concept } from '@weco/common/model/catalogue';

type GetArticleProps = {
  id: string;
  toggles: Toggles;
};

type ConceptResponse = Concept | CatalogueApiError;

// to return the article object from Prismic by id
export async function getArticles({
  id,
}: // toggles,
GetArticleProps): Promise<ConceptResponse> {
  if (!looksLikeCanonicalId(id)) {
    return notFound();
  }

  // const apiOptions = globalApiOptions(toggles);

  const url = 'https://wellcomecollection.cdn.prismic.io/api';

  const res = await prismicFetch(url, { redirect: 'manual' });

  if (res.status === 404) {
    return notFound();
  }

  try {
    return await res.json();
  } catch (e) {
    return catalogueApiError();
  }
}
