import fetch, { Response } from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';
import {
  CatalogueApiError,
  CatalogueResultsList,
  ResultType,
} from '@weco/common/model/catalogue';
import { PrismicApiError, StoryResultsList } from '@weco/common/model/story';
import { Toggles } from '@weco/toggles';
import { propsToQuery } from '@weco/common/utils/routes';
import { isString } from '@weco/common/utils/array';
import axios from 'axios';

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

export const prismicApiError = (): PrismicApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});

export type AxiosResponse = {
  data: ResultType;
  status: number;
};

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

// To authenticate a request to the Prismic API graphql endpoint you need a Prismic-ref value that refreshes every 30 seconds.
// The ref can be used in a 'stale' state for 5 minutes before it expires
// https://community.prismic.io/t/for-how-long-is-it-safe-to-cache-a-prismic-api-ref/5962
export const prismicRefFetch = (
  url: string,
  options?: Record<string, string>
): Promise<Response> => {
  return fetch(url, { ...options, agent: agentKeepAlive });
};

// Prismic API graphql endpoint expects query requests via GET method
// This means we need to be able to pass a body in the request, something that is not possible with fetch
// As a workaround I have used axios to make the request
export const prismicFetch = (
  options?: Record<string, string>
): Promise<AxiosResponse> => {
  return axios(options);
};

export async function prismicQuery<Result extends ResultType>(
  endpoint: string,
  { query, pageSize }: PrismicQueryProps
): Promise<StoryResultsList<Result> | PrismicApiError> {
  // const apiOptions = globalApiOptions(toggles);

  const graphQuery = `query {
  allArticless(fulltext: "${query}" sortBy: title_ASC first: ${pageSize}) {
    edges {
      node {
        title
        _meta {
          lastPublicationDate
          id
        }
      }
    }
  }
}`;
  const url = `https://wellcomecollection.prismic.io/graphql?query=${graphQuery}`;
  // const url = `${rootUris[apiOptions.env]}/v2/${endpoint}?${searchParams}`;
  const fetchRefUrl = 'https://wellcomecollection.prismic.io/api/v2';

  const headers = {
    Authorization: `Bearer ${process.env.PRISMIC_TOKEN}`,
    repository: 'wellcomecollection',
  };

  const prismicRef = await prismicRefFetch(fetchRefUrl, headers);
  const { refs } = await prismicRef.json();
  const { ref } = refs[0];
  headers['Prismic-ref'] = ref;
  const updatedHeaders = {
    Authorization: `Bearer ${process.env.PRISMIC_TOKEN}`,
    repository: 'wellcomecollection',
    'Prismic-ref': ref,
  };
  const options = {
    method: 'GET',
    headers: updatedHeaders,
    data: {
      query: { graphQuery },
    },
    url: url,
  };
  try {
    const res = await prismicFetch(options);
    const data = await res.data;

    return {
      ...data,
      _requestUrl: url,
    };
  } catch (error) {
    return prismicApiError();
  }
}

export type QueryProps<Params> = {
  params: Params;
  pageSize?: number;
  toggles: Toggles;
};

export type PrismicQueryProps = {
  query: string;
  pageSize?: number;
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
