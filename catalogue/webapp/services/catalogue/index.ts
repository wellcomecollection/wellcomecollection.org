import fetch, { Response } from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';
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

// By default, the next.js polyfill for node-fetch enables keep-alive by default.
// https://nextjs.org/docs/api-reference/next.config.js/disabling-http-keep-alive
//
// This is great, but it leads us to occasionally see errors like this one:
//
//      FetchError: request to https://api.wellcomecollection.org/catalogue/v2/works/...
//      failed, reason: read ECONNRESET
//
// That's because the (client) HTTP agent is keeping the socket open indefinitely, but
// the server has other ideas:
//
// - default "idle-timeout" in akka-http is 60s https://doc.akka.io/docs/akka-http/current/configuration.html
// - NLBs have a fixed idle timeout of 350s https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html#connection-idle-timeout
//
// As such, we use an agent which is configured to expire free sockets after 59s
// A good explanation of the problem, as well as the solution, is available here:
// https://connectreport.com/blog/tuning-http-keep-alive-in-node-js/
const agentKeepAlive = new Agent({
  keepAlive: true,
  freeSocketTimeout: 1000 * 59, // 1s less than the akka-http idle timeout
});

export const catalogueFetch = (
  url: string,
  options?: Record<string, string>
): Promise<Response> => {
  return fetch(url, { ...options, agent: agentKeepAlive });
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
