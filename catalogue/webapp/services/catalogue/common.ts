import { CatalogueApiError } from '@weco/common/model/catalogue';
import { propsToQuery } from '@weco/common/utils/routes';
import { Toggles } from '@weco/toggles';

export const rootUris = {
  prod: 'https://api.wellcomecollection.org/catalogue',
  stage: 'https://api-stage.wellcomecollection.org/catalogue',
};

export type GlobalApiOptions = {
  env: 'prod' | 'stage';
  indexOverrideSuffix?: string;
};

export const globalApiOptions = (toggles?: Toggles): GlobalApiOptions => ({
  env: toggles?.stagingApi ? 'stage' : 'prod',
  indexOverrideSuffix: undefined,
});

export const queryString = (params: { [key: string]: any }): string => {
  const strings = Object.keys(propsToQuery(params)).map(key => {
    const val = params[key];
    return `${key}=${encodeURIComponent(val)}`;
  });
  return strings.length > 0 ? `?${strings.join('&')}` : '';
};

export const notFound = (): CatalogueApiError => ({
  errorType: 'http',
  httpStatus: 404,
  label: 'Not Found',
  description: '',
  type: 'Error',
});

export const catalogueApiError = (): CatalogueApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});
