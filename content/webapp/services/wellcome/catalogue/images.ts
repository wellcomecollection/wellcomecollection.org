import { propsToQuery } from '@weco/common/utils/routes';
import {
  globalApiOptions,
  QueryProps,
  rootUris,
  wellcomeApiError,
  WellcomeApiError,
  wellcomeApiFetch,
} from '@weco/content/services/wellcome';
import { toIsoDateString } from '@weco/content/services/wellcome/catalogue/index';
import {
  emptyImagesProps,
  ImagesProps,
  toQuery,
} from '@weco/content/views/components/SearchPagesLink/Images';

import { catalogueQuery, looksLikeCanonicalId, notFound } from '.';
import { CatalogueImagesApiProps, CatalogueResultsList, Image } from './types';

type ImageInclude =
  | 'withSimilarFeatures'
  | 'source.contributors'
  | 'source.languages'
  | 'source.subjects';

type GetImageProps = {
  id: string;
  shouldUseStagingApi?: boolean;
  pipelineCluster?: string;
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
): Promise<CatalogueResultsList<Image> | WellcomeApiError> {
  const params: ImagesProps = {
    ...emptyImagesProps,
    ...props.params,
  };

  const query = toQuery(params);

  const extendedParams = {
    ...params,
    ...query,
    'source.production.dates.from': toIsoDateString(
      query['source.production.dates.from'] as string,
      'from'
    ),
    'source.production.dates.to': toIsoDateString(
      query['source.production.dates.to'] as string,
      'to'
    ),
  };

  return catalogueQuery('images', { ...props, params: extendedParams });
}

type ImageResponse = {
  url?: string;
  image: Image | WellcomeApiError;
};

export async function getImage({
  id,
  shouldUseStagingApi,
  pipelineCluster,
  include = [],
}: GetImageProps): Promise<ImageResponse> {
  if (!looksLikeCanonicalId(id)) {
    return { image: notFound() };
  }

  const apiOptions = globalApiOptions(shouldUseStagingApi);

  const params = {
    include,
    // propsToQuery drops undefined values, so no param is added when the
    // cataloguePipeline mode is unset
    elasticCluster: pipelineCluster,
  };

  const searchParams = new URLSearchParams(propsToQuery(params));

  const url = `${
    rootUris[apiOptions.env.catalogue]
  }/catalogue/v2/images/${id}?${searchParams.toString()}`;

  const res = await wellcomeApiFetch(url);

  if (res.status === 404) {
    return { image: notFound() };
  }

  try {
    const image = await res.json();
    return { url, image: image as Image };
  } catch {
    return { url, image: wellcomeApiError() };
  }
}
