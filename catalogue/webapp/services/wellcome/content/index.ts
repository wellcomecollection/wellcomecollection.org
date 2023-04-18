import {
  ContentApiError,
  ContentResultsList,
} from '@weco/catalogue/services/wellcome/content/types';
import { propsToQuery } from '@weco/common/utils/routes';
import { Content } from './types/api';
import { QueryProps, globalApiOptions, wellcomeApiQuery } from '..';

const rootUris = {
  prod: 'https://api.wellcomecollection.org/content',
  stage: 'https://api-stage.wellcomecollection.org/content',
};

export async function contentQuery<Params>(
  endpoint: string,
  { params, toggles, pageSize }: QueryProps<Params>
): Promise<ContentResultsList<Content> | ContentApiError> {
  const apiOptions = globalApiOptions(toggles);
  const extendedParams = {
    ...params,
    pageSize,
  };

  const searchParams = new URLSearchParams(
    propsToQuery(extendedParams)
  ).toString();

  const url = `${rootUris[apiOptions.env]}/v0/${endpoint}?${searchParams}`;

  return wellcomeApiQuery(url);
}
