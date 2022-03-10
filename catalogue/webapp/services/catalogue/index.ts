import { CatalogueApiError } from '@weco/common/model/catalogue';
import { Toggles } from '@weco/toggles';

export const rootUris = {
  prod: 'https://api.wellcomecollection.org/catalogue',
  stage: 'https://api-stage.wellcomecollection.org/catalogue',
};

export type GlobalApiOptions = {
  env: 'prod' | 'stage';
  index?: string;
};

export const globalApiOptions = (toggles?: Toggles): GlobalApiOptions => ({
  env: toggles?.stagingApi ? 'stage' : 'prod',
});

export const notFound = (): CatalogueApiError => ({
  errorType: 'http',
  httpStatus: 404,
  label: 'Not Found',
  description: '',
  type: 'Error',
});

export const catalogueApiError = (): CatalogueApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});

// Because we know we'll be making repeated requests to the catalogue API,
// this header should keep the socket open between individual requests,
// rather than reconnecting each time.
//
// I'm hoping this will reduce the trickle of errors like:
//
//      FetchError: request to https://api.wellcomecollection.org/catalogue/v2/works/...
//      failed, reason: read ECONNRESET
//
export const catalogueFetch = (
  url: string,
  options?: Record<string, string>
): Promise<Response> => {
  return fetch(url, { ...options, headers: { connection: 'keep-alive' } });
};

// Returns true if a string is plausibly a canonical ID, false otherwise.
//
// There's no way for the front-end to know what strings are valid canonical IDs
// (only the catalogue API knows that), but it can reject certain classes of
// strings that it knows definitely aren't.
//
// e.g. any non-alphanumeric string definitely isn't a canonical ID.
//
// This is useful for rejecting queries that are obviously malformed, which might
// be attempts to inject malicious data into API queries.
export const looksLikeCanonicalId = (id: string): boolean => {
  return /^([a-z0-9]+)$/.test(id);
};
