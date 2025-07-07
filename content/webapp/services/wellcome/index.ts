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

export const wellcomeApiFetch = (
  url: string,
  options?: Record<string, string>
): Promise<Response> => {
  return fetch(url, options);
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
