import { propsToQuery } from '@weco/common/utils/routes';
import {
  globalApiOptions,
  QueryProps,
  WellcomeApiError,
  wellcomeApiQuery,
} from '@weco/content/services/wellcome';
import { Toggles } from '@weco/toggles';

import { ContentResultsList, ResultType } from './types/api';

const rootUris = {
  prod: 'https://api.wellcomecollection.org/content',
  stage: 'https://api-stage.wellcomecollection.org/content',
  dev: 'https://api-dev.wellcomecollection.org/content',
};

export async function contentListQuery<Params, Result extends ResultType>(
  endpoint: string,
  { params, toggles, pageSize }: QueryProps<Params>
): Promise<ContentResultsList<Result> | WellcomeApiError> {
  const apiOptions = globalApiOptions(toggles);
  const extendedParams = {
    ...params,
    pageSize,
  };

  const searchParams = new URLSearchParams(
    propsToQuery(extendedParams)
  ).toString();

  const url = `${rootUris[apiOptions.env]}/v0/${endpoint}?${searchParams}`;

  return wellcomeApiQuery(url) as unknown as
    | ContentResultsList<Result>
    | WellcomeApiError;
}

export async function contentDocumentQuery<Result extends ResultType>(
  endpoint: string,
  { toggles }: { toggles: Toggles }
): Promise<Result | WellcomeApiError> {
  const apiOptions = globalApiOptions(toggles);

  const url = `${rootUris[apiOptions.env]}/v0/${endpoint}`;

  return wellcomeApiQuery(url) as unknown as Result | WellcomeApiError;
}
