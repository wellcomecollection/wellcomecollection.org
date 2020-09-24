import type { CatalogueApiError } from '@weco/common/model/catalogue';
import { serialiseUrl } from '@weco/common/services/catalogue/routes';

export const rootUris = {
  prod: 'https://api.wellcomecollection.org/catalogue',
  stage: 'https://api-stage.wellcomecollection.org/catalogue',
};

export type Toggles = { [key: string]: boolean };

type GlobalApiOptions = {|
  env: 'prod' | 'stage',
  indexOverrideSuffix: ?string,
|};

export const globalApiOptions = (toggles: Toggles): GlobalApiOptions => ({
  env: toggles.stagingApi ? 'stage' : 'prod',
  indexOverrideSuffix: null,
});

export const queryString = (params: { [key: string]: any }): string => {
  const strings = Object.keys(serialiseUrl(params)).map(key => {
    const val = params[key];
    return `${key}=${encodeURIComponent(val)}`;
  });
  return strings.length > 0 ? `?${strings.join('&')}` : '';
};

export const catalogueApiError = (): CatalogueApiError => ({
  description: '',
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  type: 'Error',
});
