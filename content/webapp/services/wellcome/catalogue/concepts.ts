import { propsToQuery } from '@weco/common/utils/routes';
import {
  globalApiOptions,
  QueryProps,
  rootUris,
  wellcomeApiError,
  WellcomeApiError,
  wellcomeApiFetch,
} from '@weco/content/services/wellcome/';

import { catalogueQuery, looksLikeCanonicalId, notFound } from '.';
import {
  CatalogueConceptsApiProps,
  CatalogueResultsList,
  Concept,
} from './types';

type GetConceptProps = {
  id: string;
  shouldUseStagingApi?: boolean;
  pipelineCluster?: string;
};

type ConceptResponse = Concept | WellcomeApiError;

// propsToQuery drops undefined values, so unset params are left out
export function conceptsApiUrl(
  path: string,
  params: Record<string, string | undefined> = {},
  root: string = rootUris.prod
): string {
  const query = new URLSearchParams(propsToQuery(params)).toString();
  return `${root}/catalogue/v2/concepts${path}${query ? `?${query}` : ''}`;
}

export async function getConcept({
  id,
  shouldUseStagingApi,
  pipelineCluster,
}: GetConceptProps): Promise<ConceptResponse> {
  if (!looksLikeCanonicalId(id)) {
    return notFound();
  }

  const apiOptions = globalApiOptions(shouldUseStagingApi);

  const url = conceptsApiUrl(
    `/${id}`,
    { elasticCluster: pipelineCluster },
    rootUris[apiOptions.env.concepts]
  );

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
type GetConceptsByIdsProps = {
  ids: string[];
  shouldUseStagingApi?: boolean;
  pipelineCluster?: string;
};

export async function getConceptsByIds({
  ids,
  shouldUseStagingApi,
  pipelineCluster,
}: GetConceptsByIdsProps): Promise<Concept[]> {
  if (!ids || ids.length === 0) return [];

  // Filter to valid canonical IDs before querying
  // Important for editor-configured slice content
  const validIds = ids.filter(looksLikeCanonicalId);

  if (validIds.length === 0) return [];

  const result = await getConcepts({
    params: { id: validIds.join(',') },
    shouldUseStagingApi,
    pipelineCluster,
  });

  if ('results' in result) return result.results;

  return [];
}
