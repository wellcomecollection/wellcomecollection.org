import { propsToQuery } from '@weco/common/utils/routes';
import { ContentResultsList, ResultType } from './types/api';
import {
  QueryProps,
  globalApiOptions,
  wellcomeApiQuery,
  WellcomeApiError,
} from '..';

const rootUris = {
  prod: 'https://api.wellcomecollection.org/content',
  stage: 'https://api-stage.wellcomecollection.org/content',
};

export async function contentQuery<Params, Result extends ResultType>(
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
