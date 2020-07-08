import fetch from 'isomorphic-unfetch';
import type {
  CatalogueApiError,
  CatalogueResultsList,
  Image,
} from '@weco/common/model/catalogue';
import { type CatalogueImagesApiProps } from '@weco/common/services/catalogue/api';
import { serialiseUrl } from '@weco/common/services/catalogue/routes';
import { type Toggles, isomorphicGetApiOptions, rootUris } from './common';

type GetImagesProps = {|
  params: CatalogueImagesApiProps,
  pageSize?: number,
  toggles?: Toggles,
|};

type GetImageProps = {|
  id: string,
  toggles?: Toggles,
|};

export async function getImages({
  params,
  toggles,
  pageSize = 25,
}: GetImagesProps): Promise<CatalogueResultsList<Image> | CatalogueApiError> {
  const apiOptions = isomorphicGetApiOptions(toggles);
  if (apiOptions.indexOverrideSuffix) {
    params._index = `&_index=images-${apiOptions.indexOverrideSuffix}`;
  }
  const filterQueryString = Object.keys(serialiseUrl(params)).map(key => {
    const val = params[key];
    return `${key}=${encodeURIComponent(val)}`;
  });
  const url =
    `${rootUris[apiOptions.env]}/v2/images?pageSize=${pageSize}` +
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
  toggles,
}: GetImageProps): Promise<Image | CatalogueApiError> {
  const apiOptions = isomorphicGetApiOptions(toggles);
  let url = `${
    rootUris[apiOptions.env]
  }/v2/images/${id}?include=${imageIncludes.join(',')}`;
  if (apiOptions.indexOverrideSuffix) {
    url += `&_index=images-${apiOptions.indexOverrideSuffix}`;
  }
  const res = await fetch(url);
  const json = await res.json();
  return json;
}
