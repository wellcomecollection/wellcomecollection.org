import fetch, { Response } from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';
import {
  CatalogueApiError,
  CatalogueResultsList,
  ResultType,
} from '@weco/common/model/catalogue';
import { Toggles } from '@weco/toggles';
import { propsToQuery } from '@weco/common/utils/routes';
import { isString } from '@weco/common/utils/array';

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
// This is great, but it leads us occasionally to see errors like this one:
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

export const prismicFetch = (
  url: string,
  options?: Record<string, string>
): Promise<Response> => {
  return fetch(url, { ...options, agent: agentKeepAlive });
};

export async function prismicQuery<Params, Result extends ResultType>(
  endpoint: string,
  { params, toggles, pageSize }: QueryProps<Params>
): Promise<CatalogueResultsList<Result> | CatalogueApiError> {
  // const apiOptions = globalApiOptions(toggles);
  //
  // const extendedParams = {
  //   ...params,
  //   pageSize,
  // };

  const url = 'https://wellcomecollection.cdn.prismic.io/api';
  const graphQuery = `{
  allExhibitionss(fulltext: "cats" sortBy: title_ASC) {
    edges {
      node {
        title
        _meta {
          type
        }
      }
    }
  }`;

  try {
    const res = await prismicFetch(url, { graphQuery, redirect: 'manual' });
    const json = await res.json();

    if (json.type === 'Error' && json.httpStatus !== 414) {
      console.warn(
        `Received error from prismic API query ${url}: ` + JSON.stringify(json)
      );
    }

    return {
      ...json,
      _requestUrl: url,
    };
  } catch (error) {
    console.error(`Unable to fetch Prismic API URL ${url}`, error);
    return catalogueApiError();
  }
}

export type QueryProps<Params> = {
  params: Params;
  pageSize?: number;
  toggles: Toggles;
};

export async function catalogueQuery<Params, Result extends ResultType>(
  endpoint: string,
  { params, toggles, pageSize }: QueryProps<Params>
): Promise<CatalogueResultsList<Result> | CatalogueApiError> {
  const apiOptions = globalApiOptions(toggles);

  const extendedParams = {
    ...params,
    pageSize,
  };

  const searchParams = new URLSearchParams(
    propsToQuery(extendedParams)
  ).toString();

  const url = `${rootUris[apiOptions.env]}/v2/${endpoint}?${searchParams}`;

  try {
    const res = await catalogueFetch(url);
    const json = await res.json();

    // In general we want to know about errors from the catalogue API, but
    // HTTP 414 URI Too Long isn't interesting -- it's usually a sign of an
    // automated tool trying to inject malicious data, and thus can be ignored.
    if (json.type === 'Error' && json.httpStatus !== 414) {
      console.warn(
        `Received error from catalogue API query ${url}: ` +
          JSON.stringify(json)
      );
    }

    return {
      ...json,
      _requestUrl: url,
    };
  } catch (error) {
    console.error(`Unable to fetch catalogue API URL ${url}`, error);
    return catalogueApiError();
  }
}

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
export const looksLikeCanonicalId = (
  id: string | string[] | undefined
): id is string => {
  return isString(id) && /^([a-z0-9]+)$/.test(id);
};
