import { propsToQuery } from '@weco/common/utils/routes';
import {
  globalApiOptions,
  QueryProps,
  rootUris,
  WellcomeApiError,
  wellcomeApiQuery,
} from '@weco/content/services/wellcome';
import { FeatureFlags } from '@weco/toggles';

import { ContentResultsList, ResultType } from './types/api';

export async function contentListQuery<Params, Result extends ResultType>(
  endpoint: string,
  { params, featureFlags, pageSize }: QueryProps<Params>
): Promise<ContentResultsList<Result> | WellcomeApiError> {
  const apiOptions = globalApiOptions(featureFlags);
  const extendedParams = {
    ...params,
    pageSize,
  };

  const searchParams = new URLSearchParams(
    propsToQuery(extendedParams)
  ).toString();

  const url = `${rootUris[apiOptions.env.content]}/content/v0/${endpoint}?${searchParams}`;

  return wellcomeApiQuery(url) as unknown as
    | ContentResultsList<Result>
    | WellcomeApiError;
}

export async function contentDocumentQuery<Result extends ResultType>(
  endpoint: string,
  { featureFlags }: { featureFlags?: FeatureFlags }
): Promise<Result | WellcomeApiError> {
  const apiOptions = globalApiOptions(featureFlags);

  const url = `${rootUris[apiOptions.env.content]}/content/v0/${endpoint}`;

  return wellcomeApiQuery(url) as unknown as Result | WellcomeApiError;
}
