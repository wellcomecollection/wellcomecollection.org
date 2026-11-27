import { fetchWithUndiciAgent } from '@weco/common/utils/undici-agent';

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

export const globalApiOptions = (
  shouldUseStagingApi?: boolean
): GlobalApiOptions => {
  const toggleDefinedApiEnv =
    DEFAULT_API_ENV_OVERRIDE || (shouldUseStagingApi ? 'stage' : 'prod');

  const apiConfig = {
    env: {
      catalogue: CATALOGUE_API_ENV_OVERRIDE ?? toggleDefinedApiEnv,
      concepts: CONCEPTS_API_ENV_OVERRIDE ?? toggleDefinedApiEnv,
      content: CONTENT_API_ENV_OVERRIDE ?? toggleDefinedApiEnv,
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
    IdentifiedBucketData | BooleanBucketData | UnidentifiedBucketData =
    IdentifiedBucketData,
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
  shouldUseStagingApi?: boolean;
  // Only used by catalogue queries, where catalogueQuery maps it to the
  // elasticCluster param; carries the cataloguePipeline mode toggle value.
  // undefined means the normal pipeline setup
  pipelineCluster?: string | null;
};

// Use shared undici agent configuration for keep-alive connections.
// See common/utils/undici-agent.ts for details.
export const wellcomeApiFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  return fetchWithUndiciAgent(url, options);
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

// In general we want to know about errors from our APIs, but not:
// - a 404: it means the thing doesn't exist, not that the API failed
// - a 414 URI Too Long: it's usually a sign of an automated tool trying to
//   inject malicious data, and thus can be ignored
const shouldLog = (status: number) => status !== 404 && status !== 414;

export const logFetchFailure = (url: string, error: unknown) => {
  console.error(`Unable to fetch API URL: ${url}`, error);
};

const readResponse = async (url: string, res: Response) => {
  try {
    const json = (await res.json()) as { type: string; httpStatus: number };

    // Not every failed response is in our API's error format, e.g. a 429
    // with `{"message": ...}`. Callers only check for `type: 'Error'`, so
    // without this they'd treat it as results and crash.
    if (!res.ok && json.type !== 'Error') {
      if (shouldLog(res.status)) {
        console.warn(
          `Received HTTP ${res.status} from the API query ${url}: ${JSON.stringify(
            json
          )}`
        );
      }
      return {
        ...wellcomeApiError(),
        httpStatus: res.status,
        label: res.statusText,
        _requestUrl: url,
      };
    }

    if (json.type === 'Error' && shouldLog(json.httpStatus)) {
      console.warn(
        `Received HTTP ${json.httpStatus} error from the API query ${url}: ${JSON.stringify(
          json
        )}`
      );
    }

    return {
      ...json,
      _requestUrl: url,
    };
  } catch (error) {
    // A failed response whose body isn't JSON, e.g. an HTML 502 from
    // CloudFront or API Gateway, or an empty 503 or 504, keeps its status
    if (!res.ok) {
      if (shouldLog(res.status)) {
        console.warn(
          `Received HTTP ${res.status} with a body that isn't JSON from the API query ${url}`,
          error
        );
      }
      return {
        ...wellcomeApiError(),
        httpStatus: res.status,
        label: res.statusText,
        _requestUrl: url,
      };
    }

    console.error(
      `Unable to read the HTTP ${res.status} response from API URL: ${url}`,
      error
    );
    return wellcomeApiError();
  }
};

// A 429 means the API is throttling us, not that the visitor sent too many
// requests, so they get a 503. The log line keeps the real 429.
const asSeenByVisitor = <T extends { type: string; httpStatus: number }>(
  result: T
): T =>
  result.type === 'Error' && result.httpStatus === 429
    ? { ...result, httpStatus: 503, label: 'Service Unavailable' }
    : result;

/**
 * Reads a response from one of our APIs, and logs it if it's an error.
 * Never throws: a failed response that isn't in our error format (or isn't
 * JSON at all) comes back as an error object with its own status (a 429 as a
 * 503), and a successful one that isn't JSON as a 500.
 *
 * Use wellcomeApiQuery unless you need the raw response first, like
 * getWork does for redirects.
 */
export const readApiResponse = async (url: string, res: Response) =>
  asSeenByVisitor(await readResponse(url, res));

export const wellcomeApiQuery = async (url: string, options?: RequestInit) => {
  try {
    const res = await wellcomeApiFetch(url, options);
    return await readApiResponse(url, res);
  } catch (error) {
    logFetchFailure(url, error);
    return wellcomeApiError();
  }
};
