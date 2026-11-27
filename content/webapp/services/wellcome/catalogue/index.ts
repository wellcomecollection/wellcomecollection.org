import { propsToQuery } from '@weco/common/utils/routes';
import { isString } from '@weco/common/utils/type-guards';
import {
  CatalogueResultsList,
  ResultType,
} from '@weco/content/services/wellcome/catalogue/types';

import {
  globalApiOptions,
  QueryProps,
  rootUris,
  WellcomeApiError,
  wellcomeApiQuery,
} from '..';

export const notFound = (): WellcomeApiError => ({
  errorType: 'http',
  httpStatus: 404,
  label: 'Not Found',
  description: '',
  type: 'Error',
});

export async function catalogueQuery<Params, Result extends ResultType>(
  endpoint: string,
  { params, shouldUseStagingApi, pipelineCluster, pageSize }: QueryProps<Params>
): Promise<CatalogueResultsList<Result> | WellcomeApiError> {
  const apiOptions = globalApiOptions(shouldUseStagingApi);

  // The cataloguePipeline mode toggle routes the request to that pipeline's
  // cluster. When the mode is unset no param is added.
  const extendedParams = {
    ...params,
    elasticCluster: pipelineCluster,
    pageSize,
  };

  const searchParams = new URLSearchParams(
    propsToQuery(extendedParams)
  ).toString();
  const url = `${rootUris[apiOptions.env.catalogue]}/catalogue/v2/${endpoint}?${searchParams}`;

  return wellcomeApiQuery(url) as unknown as
    CatalogueResultsList<Result> | WellcomeApiError;
}

// Canonical IDs are minted by the catalogue pipeline, which leaves out
// characters that are easy to mix up (o/0, i/l/1). Keep these in step with
// catalogue-pipeline's catalogue_graph/src/id_minter/identifiers.py.
const ID_LETTERS = 'a-hj-km-np-z'; // a to z, without i, l and o
const ID_DIGITS = '2-9'; // without 0 and 1

// 8 characters, the first always a letter so the ID is also valid in XML
const canonicalIdPattern = new RegExp(
  `^[${ID_LETTERS}][${ID_LETTERS}${ID_DIGITS}]{7}$`
);

// Returns true if a string could be a canonical ID, false otherwise.
//
// Only the catalogue API knows which IDs exist, but this rejects queries that
// are obviously malformed, which might be attempts to inject malicious data
// into API queries, without a round trip to the API.
export const looksLikeCanonicalId = (
  id: string | string[] | undefined
): id is string => {
  return isString(id) && canonicalIdPattern.test(id);
};

// Creates the YYYY-MM-DD date string we pass to the API.
//
// Note: the filter GUI expects users to enter dates as a four-digit year (e.g. 1939).
//  We pin to the start/end of the year so that the range is inclusive.
// e.g. a user who searches for works 'to 2001' should find works created in 2001.
export const toIsoDateString = (
  s: string | undefined,
  range: 'to' | 'from'
): string | undefined => {
  if (s) {
    try {
      const d = new Date(s);
      const year = d.getUTCFullYear().toString().padStart(4, '0');

      return range === 'from' ? `${year}-01-01` : `${year}-12-31`;
    } catch {
      return undefined;
    }
  }
  return undefined;
};
