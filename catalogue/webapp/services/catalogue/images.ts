import {
  CatalogueApiError,
  CatalogueImagesApiProps,
  CatalogueResultsList,
  Image,
} from './types';
import {
  rootUris,
  globalApiOptions,
  catalogueApiError,
  notFound,
  looksLikeCanonicalId,
  catalogueFetch,
  catalogueQuery,
  QueryProps,
} from '.';
import { Toggles } from '@weco/toggles';
import { propsToQuery } from '@weco/common/utils/routes';
import {
  emptyImagesProps,
  ImagesProps,
  toQuery,
} from '@weco/common/views/components/ImagesLink/ImagesLink';

type ImageInclude =
  | 'visuallySimilar'
  | 'withSimilarColors'
  | 'withSimilarFeatures'
  | 'source.contributors'
  | 'source.languages'
  | 'source.subjects';

type GetImageProps = {
  id: string;
  toggles: Toggles;
  include?: ImageInclude[];
};

/** Run a query with the images API.
 *
 * Note: this method is responsible for encoding parameters in an API-compatible
 * way, e.g. wrapping strings in quotes.  Callers should pass in an unencoded
 * set of parameters.
 *
 * https://wellcomecollection.org/images?source.subjects.label=%22Germany%2C+East%22
 */
export async function getImages(
  props: QueryProps<CatalogueImagesApiProps>
): Promise<CatalogueResultsList<Image> | CatalogueApiError> {
  const params: ImagesProps = {
    ...emptyImagesProps,
    ...props.params,
  };

  const query = toQuery(params);

  const extendedParams = {
    ...params,
    ...query,
  };

  return catalogueQuery('images', { ...props, params: extendedParams });
}

type ImageResponse = {
  url?: string;
  image: Image | CatalogueApiError;
};

export async function getImage({
  id,
  toggles,
  include = [],
}: GetImageProps): Promise<ImageResponse> {
  if (!looksLikeCanonicalId(id)) {
    return { image: notFound() };
  }

  const apiOptions = globalApiOptions(toggles);

  const params = {
    include,
  };

  const searchParams = new URLSearchParams(propsToQuery(params));

  const url = `${
    rootUris[apiOptions.env]
  }/v2/images/${id}?${searchParams.toString()}`;

  const res = await catalogueFetch(url);

  if (res.status === 404) {
    return { image: notFound() };
  }

  try {
    const image = await res.json();
    return { url, image };
  } catch (e) {
    return { url, image: catalogueApiError() };
  }
}
