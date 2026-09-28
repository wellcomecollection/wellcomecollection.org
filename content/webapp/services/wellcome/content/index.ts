import { propsToQuery } from '@weco/common/utils/routes';
import {
  ApiEnvironmentOverride,
  globalApiOptions,
  QueryProps,
  rootUris,
  WellcomeApiError,
  wellcomeApiQuery,
} from '@weco/content/services/wellcome';

import { ContentResultsList, ResultType } from './types/api';

export async function contentListQuery<Params, Result extends ResultType>(
  endpoint: string,
  { params, apiEnvironment, pageSize }: QueryProps<Params>
): Promise<ContentResultsList<Result> | WellcomeApiError> {
  const apiOptions = globalApiOptions(apiEnvironment);
  const extendedParams = {
    ...params,
    pageSize,
  };

  const searchParams = new URLSearchParams(
    propsToQuery(extendedParams)
  ).toString();

  const url = `${rootUris[apiOptions.env.content]}/content/v0/${endpoint}?${searchParams}`;

  return wellcomeApiQuery(url) as unknown as
    ContentResultsList<Result> | WellcomeApiError;
}

export async function contentDocumentQuery<Result extends ResultType>(
  endpoint: string,
  { apiEnvironment }: { apiEnvironment?: ApiEnvironmentOverride }
): Promise<Result | WellcomeApiError> {
  const apiOptions = globalApiOptions(apiEnvironment);

  const url = `${rootUris[apiOptions.env.content]}/content/v0/${endpoint}`;

  return wellcomeApiQuery(url) as unknown as Result | WellcomeApiError;
}
