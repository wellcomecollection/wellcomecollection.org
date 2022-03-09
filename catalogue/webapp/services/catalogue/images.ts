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
  looksLikeCanonicalId,
  catalogueFetch,
} from '.';
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

  const extendedParams = {
    ...params,
    pageSize,
  };

  const searchParams = new URLSearchParams(
    propsToQuery(extendedParams)
  ).toString();

  const url = `${
    rootUris[apiOptions.env]
  }/v2/images?${searchParams.toString()}`;

  try {
    const res = await catalogueFetch(url);
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
  if (!looksLikeCanonicalId(id)) {
    return notFound();
  }

  const apiOptions = globalApiOptions(toggles);

  const params = {
    include: include,
  };

  const searchParams = new URLSearchParams(propsToQuery(params));

  const url = `${
    rootUris[apiOptions.env]
  }/v2/images/${id}?${searchParams.toString()}`;

  const res = await catalogueFetch(url);

  if (res.status === 404) {
    return notFound();
  }

  try {
    return await res.json();
  } catch (e) {
    return catalogueApiError();
  }
}

export async function getVisuallySimilarImagesClientSide(id: string): Promise<Image | undefined> {
  const response = await fetch(`/api/visuallySimilarImages/${id}`, {
    credentials: 'same-origin'
  });

  if (response.ok) {
    const image: Image = await response.json();
    return image;
  }
}
