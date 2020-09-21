import fetch from 'isomorphic-unfetch';
import type {
  CatalogueApiError,
  CatalogueResultsList,
  Image,
} from '@weco/common/model/catalogue';
import { type CatalogueImagesApiProps } from '@weco/common/services/catalogue/api';
import {
  type Toggles,
  rootUris,
  globalApiOptions,
  queryString,
  catalogueApiError,
} from './common';

type GetImagesProps = {|
  params: CatalogueImagesApiProps,
  pageSize?: number,
  toggles: Toggles,
|};

type ImageInclude = 'visuallySimilar';

type GetImageProps = {|
  id: string,
  toggles: Toggles,
  include: ImageInclude[],
|};

export async function getImages({
  params,
  toggles,
  pageSize = 25,
}: GetImagesProps): Promise<CatalogueResultsList<Image> | CatalogueApiError> {
  const apiOptions = globalApiOptions(toggles);
  const extendedParams = {
    ...params,
    pageSize,
    _index: apiOptions.indexOverrideSuffix
      ? `images-${apiOptions.indexOverrideSuffix}`
      : null,
  };
  const filterQueryString = queryString(extendedParams);
  const url = `${rootUris[apiOptions.env]}/v2/images${filterQueryString}`;
  try {
    const res = await fetch(url);
    const json = await res.json();

    return (json: CatalogueResultsList<Image> | CatalogueApiError);
  } catch (error) {
    return catalogueApiError();
  }
}

export async function getImage({
  id,
  toggles,
  include = [],
}: GetImageProps): Promise<Image | CatalogueApiError> {
  const apiOptions = globalApiOptions(toggles);
  const params = {
    include: include,
    _index: apiOptions.indexOverrideSuffix
      ? `images-${apiOptions.indexOverrideSuffix}`
      : null,
  };
  const query = queryString(params);
  let url = `${rootUris[apiOptions.env]}/v2/images/${id}${query}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (e) {
    return catalogueApiError();
  }
}
