import { fetchWithUndiciAgent } from '@weco/common/utils/undici-agent';

type envOptions = 'prod' | 'stage' | 'dev';

// The subset of envOptions a mode/cookie override can actually pick - 'prod'
// isn't a selectable option, it's what "no override" already means. Unlike
// the build-time NEXT_PUBLIC_*_API_ENV_OVERRIDE vars above, this drives a
// runtime cookie a real user could set on the deployed site: 'dev' only
// resolves for someone whose own machine has api-dev.wellcomecollection.org
// pointed at a locally-running API (see yarn config-local-apis) - it's for
// debugging the real deployed frontend against your own local API, not a
// shared environment, so it breaks for anyone else who picks it.
export type ApiEnvironmentOverride = 'stage' | 'dev';

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
  apiEnvironment?: ApiEnvironmentOverride
): GlobalApiOptions => {
  const toggleDefinedApiEnv =
    DEFAULT_API_ENV_OVERRIDE || apiEnvironment || 'prod';

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
  apiEnvironment?: ApiEnvironmentOverride;
  // Only used by catalogue queries, where catalogueQuery maps it to the
  // elasticCluster param; carries the cataloguePipeline mode toggle value.
  // undefined means the normal pipeline setup
  pipelineCluster?: string;
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
  try {
    const res = await wellcomeApiFetch(url);
    const json = (await res.json()) as { type: string; httpStatus: number };

    // In general we want to know about errors from our APIs, but
    // HTTP 414 URI Too Long isn't interesting -- it's usually a sign of an
    // automated tool trying to inject malicious data, and thus can be ignored.
    if (json.type === 'Error' && json.httpStatus !== 414) {
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
