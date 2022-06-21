import {
  CatalogueApiError,
  CatalogueResultsList,
  Concept,
} from '@weco/common/model/catalogue';
import { CatalogueConceptsApiProps } from '@weco/common/services/catalogue/ts_api';
import { propsToQuery } from '@weco/common/utils/routes';
import { Toggles } from '@weco/toggles';
import {
  catalogueApiError,
  catalogueFetch,
  globalApiOptions,
  looksLikeCanonicalId,
  notFound,
  rootUris,
} from '.';

type GetConceptProps = {
  id: string;
  toggles: Toggles;
};

type GetConceptsProps = {
  params: CatalogueConceptsApiProps;
  pageSize?: number;
  toggles: Toggles;
};

type ConceptResponse = Concept | CatalogueApiError;

export async function getConcept({
  id,
  toggles,
}: GetConceptProps): Promise<ConceptResponse> {
  if (!looksLikeCanonicalId(id)) {
    return notFound();
  }

  const apiOptions = globalApiOptions(toggles);

  const url = `${rootUris[apiOptions.env]}/v2/concepts/${id}`;

  const res = await catalogueFetch(url, { redirect: 'manual' });

  // TODO: If we ever do redirects in the concepts API, support it here

  if (res.status === 404) {
    return notFound();
  }

  try {
    return await res.json();
  } catch (e) {
    return catalogueApiError();
  }
}

export async function getConcepts({
  params,
  toggles,
  pageSize = 25,
}: GetConceptsProps): Promise<CatalogueResultsList | CatalogueApiError> {
  const apiOptions = globalApiOptions(toggles);

  const extendedParams = {
    ...params,
    pageSize,
  };

  const searchParams = new URLSearchParams(
    propsToQuery(extendedParams)
  ).toString();

  const url = `${rootUris[apiOptions.env]}/v2/concepts?${searchParams}`;

  try {
    const res = await catalogueFetch(url);
    const json = await res.json();

    return json;
  } catch (error) {
    return catalogueApiError();
  }
}
