import {
  globalApiOptions,
  QueryProps,
  rootUris,
  wellcomeApiError,
  WellcomeApiError,
  wellcomeApiFetch,
} from '@weco/content/services/wellcome/';
import { Toggles } from '@weco/toggles';

import { catalogueQuery, looksLikeCanonicalId, notFound } from '.';
import {
  CatalogueConceptsApiProps,
  CatalogueResultsList,
  Concept,
} from './types';

type GetConceptProps = {
  id: string;
  toggles: Toggles;
};

type ConceptResponse = Concept | WellcomeApiError;

export async function getConcept({
  id,
  toggles,
}: GetConceptProps): Promise<ConceptResponse> {
  if (!looksLikeCanonicalId(id)) {
    return notFound();
  }

  const apiOptions = globalApiOptions(toggles);

  const url = `${rootUris[apiOptions.env.concepts]}/catalogue/v2/concepts/${id}`;

  const res = await wellcomeApiFetch(url, { redirect: 'manual' });

  // TODO: If we ever do redirects in the concepts API, support it here

  if (res.status === 404) {
    return notFound();
  }

  try {
    return (await res.json()) as Concept;
  } catch {
    return wellcomeApiError();
  }
}

export async function getConcepts(
  props: QueryProps<CatalogueConceptsApiProps>
): Promise<CatalogueResultsList<Concept> | WellcomeApiError> {
  return catalogueQuery('concepts', props);
}

/**
 * Fetch concepts (topics) from the concepts API
 * Returns concepts that can be used for browse topics
 */
export async function getConceptsByIds(ids: string[]): Promise<Concept[]> {
  if (!ids || ids.length === 0) return [];

  // Filter to valid canonical IDs before querying
  // Important for editor-configured slice content
  const validIds = ids.filter(looksLikeCanonicalId);

  if (validIds.length === 0) return [];

  const result = await getConcepts({
    params: { id: validIds.join(',') },
    toggles: {},
  });

  if ('results' in result) return result.results;

  return [];
}
