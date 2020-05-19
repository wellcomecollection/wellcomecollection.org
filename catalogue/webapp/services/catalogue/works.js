// @flow
import fetch from 'isomorphic-unfetch';
import {
  type CatalogueResultsList,
  type CatalogueApiError,
  type Work,
  type CatalogueApiRedirect,
} from '@weco/common/model/catalogue';
import { type IIIFCanvas } from '@weco/common/model/iiif';
import Raven from 'raven-js';
import { serialiseUrl } from '@weco/common/services/catalogue/routes';
import { type CatalogueApiProps } from '@weco/common/services/catalogue/api';

const rootUris = {
  prod: 'https://api.wellcomecollection.org/catalogue',
  stage: 'https://api-stage.wellcomecollection.org/catalogue',
};

type Environment = {|
  env?: $Keys<typeof rootUris>,
|};

type GetWorkProps = {|
  id: string,
  ...Environment,
|};

type GetWorksProps = {|
  params: CatalogueApiProps,
  pageSize?: number,
  ...Environment,
|};

const worksIncludes = ['identifiers', 'production', 'contributors', 'subjects'];

const workIncludes = [
  'identifiers',
  'items',
  'subjects',
  'genres',
  'contributors',
  'production',
  'notes',
];

export async function getWorks({
  params,
  env = 'prod',
  pageSize = 25,
}: GetWorksProps): Promise<CatalogueResultsList | CatalogueApiError> {
  const filterQueryString = Object.keys(serialiseUrl(params)).map(key => {
    const val = params[key];
    return `${key}=${encodeURIComponent(val)}`;
  });
  const url =
    `${rootUris[env]}/v2/works?include=${worksIncludes.join(',')}` +
    `&pageSize=${pageSize}` +
    (filterQueryString.length > 0 ? `&${filterQueryString.join('&')}` : '');
  try {
    const res = await fetch(url);
    const json = await res.json();

    return (json: CatalogueResultsList | CatalogueApiError);
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

export async function getWork({
  id,
  env = 'prod',
}: GetWorkProps): Promise<Work | CatalogueApiError | CatalogueApiRedirect> {
  const url = `${rootUris[env]}/v2/works/${id}?include=${workIncludes.join(
    ','
  )}`;
  const res = await fetch(url, { redirect: 'manual' });

  // When records from Miro have been merged with Sierra data, we redirect the
  // latter to the former. This would happen quietly on the API requtes, but we
  // would then have duplicates emerging, which wouldn't be useful for search
  // engines so we respect the redirect on the client
  if (res.status === 301 || res.status === 302) {
    const id = res.headers.get('location').match(/works\/([^?].*)\?/);
    return {
      type: 'Redirect',
      status: res.status,
      redirectToId: id[1],
    };
  }

  const json = await res.json();

  return json;
}

export async function getCanvasOcr(canvas: IIIFCanvas) {
  const textContent =
    canvas.otherContent &&
    canvas.otherContent.find(
      content =>
        content['@type'] === 'sc:AnnotationList' &&
        content.label === 'Text of this page'
    );

  const textService = textContent && textContent['@id'];

  if (textService) {
    try {
      const textJson = await fetch(textService);
      const text = await textJson.json();
      const textString = text.resources
        .filter(resource => {
          return resource.resource['@type'] === 'cnt:ContentAsText';
        })
        .map(resource => resource.resource.chars)
        .join(' ');
      return textString.length > 0 ? textString : 'text unavailable';
    } catch (e) {
      Raven.captureException(new Error(`IIIF text service error: ${e}`), {
        tags: {
          service: 'dlcs',
        },
      });

      return 'text unavailable';
    }
  }
}
