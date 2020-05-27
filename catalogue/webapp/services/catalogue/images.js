import fetch from 'isomorphic-unfetch';
import type {
  CatalogueApiError,
  CatalogueResultsList,
  Image,
} from '@weco/common/model/catalogue';
import { type CatalogueImagesApiProps } from '@weco/common/services/catalogue/api';
import { serialiseUrl } from '@weco/common/services/catalogue/routes';
import { type Environment, rootUris } from './common';

type GetImagesProps = {|
  params: CatalogueImagesApiProps,
  pageSize?: number,
  ...Environment,
|};

export async function getImages({
  params,
  env = 'stage', // TODO switch this to prod once the images search is deployed
  pageSize = 25,
}: GetImagesProps): Promise<CatalogueResultsList<Image> | CatalogueApiError> {
  const filterQueryString = Object.keys(serialiseUrl(params)).map(key => {
    const val = params[key];
    return `${key}=${encodeURIComponent(val)}`;
  });
  const url =
    `${rootUris[env]}/v2/images?pageSize=${pageSize}` +
    (filterQueryString.length > 0 ? `&${filterQueryString.join('&')}` : '');
  try {
    const res = await fetch(url);
    const json = await res.json();

    return (json: CatalogueResultsList<Image> | CatalogueApiError);
  } catch (error) {
    return {
      description: '',
      errorType: 'http',
      httpStatus: 500,
      label: 'Internal Server Error',
      type: 'Error',
    };
  }
}
