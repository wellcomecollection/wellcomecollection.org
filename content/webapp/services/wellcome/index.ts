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

export const wellcomeApiQuery = async (url: string) => {
  // In general we want to know about errors from our APIs, but
  // HTTP 414 URI Too Long isn't interesting -- it's usually a sign of an
  // automated tool trying to inject malicious data, and thus can be ignored.
  // Nor is a 404: it means the thing doesn't exist, not that the API failed.
  const shouldLog = (status: number) => status !== 414 && status !== 404;

  try {
    const res = await wellcomeApiFetch(url);
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
    console.error(`Unable to fetch API URL: ${url}`, error);
    return wellcomeApiError();
  }
};
