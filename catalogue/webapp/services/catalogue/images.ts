import fetch from 'isomorphic-unfetch';
import {
  CatalogueApiError,
  CatalogueResultsList,
  Image,
} from '@weco/common/model/catalogue';
import { CatalogueImagesApiProps } from '@weco/common/services/catalogue/ts_api';
import {
  rootUris,
  globalApiOptions,
  queryString,
  catalogueApiError,
  notFound,
  getTeiIndexName,
} from './common';
import { Toggles } from '@weco/toggles';

type GetImagesProps = {
  params: CatalogueImagesApiProps;
  pageSize?: number;
  toggles: Toggles;
};

type ImageInclude =
  | 'visuallySimilar'
  | 'withSimilarColors'
  | 'withSimilarFeatures'
  | 'source.contributors'
  | 'source.languages';

type GetImageProps = {
  id: string;
  toggles: Toggles;
  include?: ImageInclude[];
};

export async function getImages({
  params,
  toggles,
  pageSize = 25,
}: GetImagesProps): Promise<CatalogueResultsList<Image> | CatalogueApiError> {
  const apiOptions = globalApiOptions(toggles);
  const index = await getTeiIndexName(toggles, 'images');

  const extendedParams = {
    ...params,
    pageSize,
    _index: index,
  };
  const filterQueryString = queryString(extendedParams);
  const url = `${rootUris[apiOptions.env]}/v2/images${filterQueryString}`;
  try {
    const res = await fetch(url);
    const json = await res.json();

    return json;
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
  const index = await getTeiIndexName(toggles, 'images');

  const params = {
    include: include,
    _index: index,
  };
  const query = queryString(params);
  const url = `${rootUris[apiOptions.env]}/v2/images/${id}${query}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    if (res.status === 404) {
      return notFound();
    }

    return json;
  } catch (e) {
    return catalogueApiError();
  }
}
