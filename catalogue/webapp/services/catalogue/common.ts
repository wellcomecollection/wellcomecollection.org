import fetch from 'isomorphic-unfetch';
import { CatalogueApiError } from '@weco/common/model/catalogue';
import { propsToQuery } from '@weco/common/utils/routes';
import { Toggles } from '@weco/toggles';

export const rootUris = {
  prod: 'https://api.wellcomecollection.org/catalogue',
  stage: 'https://api-stage.wellcomecollection.org/catalogue',
};

export type GlobalApiOptions = {
  env: 'prod' | 'stage';
  index?: string;
};

export const globalApiOptions = (toggles?: Toggles): GlobalApiOptions => ({
  env: toggles?.stagingApi ? 'stage' : 'prod',
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

type ElasticConfig = {
  worksIndex: string;
  imagesIndex: string;
};

export const getElasticConfig = async (): Promise<ElasticConfig> => {
  const response = await fetch(
    'https://api.wellcomecollection.org/catalogue/v2/_elasticConfig'
  );
  const data: ElasticConfig = await response.json();
  return data;
};

// This only ever uses HTTP behind a toggle so that
// we only degrade performance for people with that
// toggle on
export const getTeiIndexName = async (
  toggles: Toggles,
  index: 'works' | 'images'
): Promise<string | undefined> => {
  const indexName = toggles.tei
    ? await getElasticConfig().then(config =>
        index === 'works'
          ? `${config.worksIndex}-tei-on`
          : `${config.imagesIndex}-tei-on`
      )
    : undefined;

  return indexName;
};
