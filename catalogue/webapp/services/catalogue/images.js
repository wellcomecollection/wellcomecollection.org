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

type GetImageProps = {|
  id: string,
  ...Environment,
|};

export async function getImages({
  params,
  env = 'prod',
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

const imageIncludes = ['visuallySimilar'];

export async function getImage({
  id,
  env = 'prod',
}: GetImageProps): Promise<Image | CatalogueApiError> {
  const url = `${rootUris[env]}/v2/images/${id}?include=${imageIncludes.join(
    ','
  )}`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
}
