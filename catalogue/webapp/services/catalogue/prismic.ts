import {
  catalogueApiError,
  prismicFetch,
  // globalApiOptions,
  looksLikeCanonicalId,
  notFound, QueryProps, catalogueQuery, prismicQuery
  // rootUris,
} from "./index";

import { Toggles } from '@weco/toggles';
import { CatalogueApiError, CatalogueResultsList, Concept } from "@weco/common/model/catalogue";
import { CatalogueConceptsApiProps } from '@weco/common/services/catalogue/api';

type GetArticleProps = {
  id: string;
  toggles: Toggles;
};

type ConceptResponse = Concept | CatalogueApiError;

// to return the article object from Prismic by id
export async function getArticle({
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

export async function getArticles(
  props: QueryProps<CatalogueConceptsApiProps>
): Promise<CatalogueResultsList<Concept> | CatalogueApiError> {
  return prismicQuery('articles', props);
}
