import { Toggles } from '@weco/toggles';

type envOptions = 'prod' | 'stage' | 'dev';

const DEFAULT_API_ENV_OVERRIDE = process.env
  .NEXT_PUBLIC_API_ENV_OVERRIDE as envOptions;
const CONTENT_API_ENV_OVERRIDE = process.env
  .NEXT_PUBLIC_CONTENT_API_ENV_OVERRIDE as envOptions;
const CONCEPTS_API_ENV_OVERRIDE = process.env
  .NEXT_PUBLIC_CONCEPTS_API_ENV_OVERRIDE as envOptions;
const CATALOGUE_API_ENV_OVERRIDE = process.env
  .NEXT_PUBLIC_CATALOGUE_API_ENV_OVERRIDE as envOptions;

export const rootUris = {
  prod: 'https://api.wellcomecollection.org',
  stage: 'https://api-stage.wellcomecollection.org',
  dev: 'https://api-dev.wellcomecollection.org',
};

type ApiEnvOptions = {
  catalogue: envOptions;
  concepts: envOptions;
  content: envOptions;
};

export type GlobalApiOptions = {
  env: ApiEnvOptions;
  index?: string;
};

export const globalApiOptions = (toggles?: Toggles): GlobalApiOptions => {
  const toggleDefinedApiOption =
    DEFAULT_API_ENV_OVERRIDE || (toggles?.stagingApi?.value ? 'stage' : 'prod');

  const apiConfig = {
    env: {
      catalogue: CATALOGUE_API_ENV_OVERRIDE ?? toggleDefinedApiOption,
      concepts: CONCEPTS_API_ENV_OVERRIDE ?? toggleDefinedApiOption,
      content: CONTENT_API_ENV_OVERRIDE ?? toggleDefinedApiOption,
    },
  };

  return apiConfig;
};

// Used as a helper to return a typesafe empty results list
export const emptyResultList = <
  Result,
  Aggregations extends { type: 'Aggregations' } | undefined,
>(): WellcomeResultList<Result, Aggregations> => ({
  type: 'ResultList',
  totalResults: 0,
  totalPages: 0,
  results: [],
  pageSize: 100,
  prevPage: null,
  nextPage: null,
  _requestUrl: '',
});

export type WellcomeResultList<
  Result,
  Aggregations extends { type: 'Aggregations' } | undefined,
> = {
  type: 'ResultList';
  totalResults: number;
  totalPages: number;
  results: Result[];
  pageSize: number;
  prevPage: string | null;
  nextPage: string | null;
  aggregations?: Aggregations;

  // We include the URL used to fetch data from the catalogue API for
  // debugging purposes.
  _requestUrl: string;
};

export type IdentifiedBucketData = {
  id: string;
  label: string;
  type: string;
};

export type UnidentifiedBucketData = {
  label: string;
  type: string;
};

export type BooleanBucketData = UnidentifiedBucketData & {
  value: boolean;
};

export type WellcomeAggregation<
  BucketData extends
    | IdentifiedBucketData
    | BooleanBucketData
    | UnidentifiedBucketData = IdentifiedBucketData,
> = {
  buckets: {
    count: number;
    data: BucketData;
    type: 'AggregationBucket';
  }[];
  type: 'Aggregation';
};

export type QueryProps<Params> = {
  params: Params;
  pageSize?: number;
  toggles: Toggles;
};

// Node.js native fetch (powered by undici) uses keep-alive connections by default,
// but with timeout values that don't match our server configuration.
// https://nodejs.org/api/globals.html#fetch
//
// This leads us occasionally to see errors like this one:
//
//      FetchError: request to https://api.wellcomecollection.org/catalogue/v2/works/...
//      failed, reason: read ECONNRESET
//
// That's because the default keep-alive timeout doesn't align with the server:
//
// - default "idle-timeout" in akka-http is 60s https://doc.akka.io/docs/akka-http/current/configuration.html
// - NLBs have a fixed idle timeout of 350s https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html#connection-idle-timeout
//
// As such, we use a custom undici agent configured to expire free sockets after 59s
// (1s less than the server timeout) to prevent connection resets.
// A good explanation of the problem, as well as the solution, is available here:
// https://connectreport.com/blog/tuning-http-keep-alive-in-node-js/

// Lazy-load undici.Agent (server-side only)
// We use dynamic import so undici isn't bundled into the client-side JavaScript
let agentKeepAlive: unknown = null;
async function getAgent() {
  if (!agentKeepAlive) {
    const { Agent } = await import('undici');
    agentKeepAlive = new Agent({
      keepAliveTimeout: 1000 * 59, // 1s less than the akka-http idle timeout
      keepAliveMaxTimeout: 1000 * 59,
    });
  }
  return agentKeepAlive;
}

export const wellcomeApiFetch = async (
  url: string,
  options?: Record<string, string>
): Promise<Response> => {
  // Node.js native fetch supports the dispatcher option for configuring the HTTP agent
  // The type assertion is needed because TypeScript's built-in RequestInit doesn't include dispatcher
  const agent = await getAgent();
  return fetch(url, {
    ...options,
    dispatcher: agent,
  } as RequestInit);
};

export const wellcomeApiError = (): WellcomeApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});

export type WellcomeApiError = {
  errorType: string;
  httpStatus: number;
  label: string;
  description: string;
  type: 'Error';
};

export const wellcomeApiQuery = async (url: string) => {
  try {
    const res = await wellcomeApiFetch(url);
    const json = (await res.json()) as { type: string; httpStatus: number };

    // In general we want to know about errors from our APIs, but
    // HTTP 414 URI Too Long isn't interesting -- it's usually a sign of an
    // automated tool trying to inject malicious data, and thus can be ignored.
    if (json.type === 'Error' && json.httpStatus !== 414) {
      console.warn(
        `Received HTTP ${json.httpStatus} error from the API query ${url}: ` +
          JSON.stringify(json)
      );
    }

    return {
      ...json,
      _requestUrl: url,
    };
  } catch (error) {
    console.error(`Unable to fetch API URL: ${url}`, error);
    return wellcomeApiError();
  }
};
