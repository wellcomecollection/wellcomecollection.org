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
  indexOverrideSuffix: toggles.miroMergingTest
    ? 'miro-merging-test' // This is an index alias, not an actual index name
    : null,
});

export const queryString = (params: { [key: string]: any }): string => {
  const strings = Object.keys(serialiseUrl(params)).map(key => {
    const val = params[key];
    return `${key}=${encodeURIComponent(val)}`;
  });
  return strings.length > 0 ? `?${strings.join('&')}` : '';
};
