import {
  CatalogueApiError,
  CatalogueApiRedirect,
  CatalogueResultsList,
  Work,
} from '@weco/common/model/catalogue';
import { IIIFCanvas } from '@weco/common/model/iiif';
import { CatalogueWorksApiProps } from '@weco/common/services/catalogue/ts_api';
import fetch from 'isomorphic-unfetch';
import Raven from 'raven-js';
import {
  catalogueApiError,
  globalApiOptions,
  queryString,
  rootUris,
  notFound,
} from './common';
import { Toggles } from '@weco/toggles';
import { parseCsv } from '@weco/common/utils/csv';

type GetWorkProps = {
  id: string;
  toggles?: Toggles;
};

type GetWorksProps = {
  params: CatalogueWorksApiProps;
  pageSize?: number;
  toggles?: Toggles;
};

const worksIncludes = [
  'identifiers',
  'production',
  'contributors',
  'subjects',
  'partOf',
];

const workIncludes = [
  'identifiers',
  'images',
  'items',
  'subjects',
  'genres',
  'contributors',
  'production',
  'notes',
  'parts',
  'partOf',
  'precededBy',
  'succeededBy',
  'languages',
];

const redirect = (id: string, status = 302): CatalogueApiRedirect => ({
  type: 'Redirect',
  redirectToId: id,
  status,
});

export async function getWorks({
  params,
  toggles,
  pageSize = 25,
}: GetWorksProps): Promise<CatalogueResultsList | CatalogueApiError> {
  const apiOptions = globalApiOptions(toggles);
  const extendedParams = {
    ...params,
    pageSize,
    include: worksIncludes,
    _index: apiOptions.indexOverrideSuffix
      ? `works-${apiOptions.indexOverrideSuffix}`
      : undefined,
  };
  const filterQueryString = queryString(extendedParams);
  const url = `${rootUris[apiOptions.env]}/v2/works${filterQueryString}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    return json;
  } catch (error) {
    return catalogueApiError();
  }
}

type WorkResponse = Work | CatalogueApiError | CatalogueApiRedirect;

export async function getWork({
  id,
  toggles,
}: GetWorkProps): Promise<WorkResponse> {
  const apiOptions = globalApiOptions(toggles);
  const params = {
    include: workIncludes,
    _index: apiOptions.indexOverrideSuffix
      ? `works-${apiOptions.indexOverrideSuffix}`
      : null,
  };
  const query = queryString(params);
  const url = `${rootUris[apiOptions.env]}/v2/works/${id}${query}`;
  const res = await fetch(url, { redirect: 'manual' });

  // When records from Miro have been merged with Sierra data, we redirect the
  // latter to the former. This would happen quietly on the API request, but we
  // would then have duplicates emerging, which wouldn't be useful for search
  // engines so we respect the redirect inside the catalogue webapp.

  // redirect: 'manual' returns the status code on the server only
  if (res.status === 301 || res.status === 302) {
    const location = res.headers.get('location');
    const id = location?.match(/works\/([^?].*)\?/)?.[1];
    return id ? redirect(id, res.status) : notFound();
  }

  // redirect: 'manual' returns an opaque response on the client only
  if (res.type === 'opaqueredirect') {
    const redirectedRes = await fetch(url, { redirect: 'follow' });
    const id = redirectedRes.url.match(/works\/([^?].*)\?/)?.[1];
    return id ? redirect(id, res.status) : notFound();
  }

  try {
    const json = await res.json();
    if (res.status === 404) {
      return notFound();
    }
    return json;
  } catch (e) {
    return catalogueApiError();
  }
}

export async function getCanvasOcr(
  canvas: IIIFCanvas
): Promise<string | undefined> {
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
