import {
  CatalogueApiError,
  CatalogueResultsList,
  Image,
} from '@weco/common/model/catalogue';
import { CatalogueImagesApiProps } from '@weco/common/services/catalogue/ts_api';
import {
  rootUris,
  globalApiOptions,
  catalogueApiError,
  notFound,
  getTeiIndexName,
} from './common';
import { Toggles } from '@weco/toggles';
import { propsToQuery } from '@weco/common/utils/routes';

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

  const searchParams = new URLSearchParams(
    propsToQuery(extendedParams)
  ).toString();

  const url = `${
    rootUris[apiOptions.env]
  }/v2/images?${searchParams.toString()}`;

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

  const searchParams = new URLSearchParams(propsToQuery(params));

  const url = `${
    rootUris[apiOptions.env]
  }/v2/images/${id}?${searchParams.toString()}`;

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
