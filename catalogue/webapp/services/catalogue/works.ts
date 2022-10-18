import {
  CatalogueApiError,
  CatalogueApiRedirect,
  CatalogueResultsList,
  ItemsList,
  Work,
} from '@weco/common/model/catalogue';
import { IIIFCanvas } from '../../services/iiif/types/manifest/v2';
import { CatalogueWorksApiProps } from '@weco/common/services/catalogue/api';
import {
  catalogueApiError,
  globalApiOptions,
  looksLikeCanonicalId,
  rootUris,
  notFound,
  catalogueFetch,
  catalogueQuery,
  QueryProps,
} from '.';
import { Toggles } from '@weco/toggles';
import { propsToQuery } from '@weco/common/utils/routes';
import {
  emptyWorksProps,
  toQuery,
  WorksProps,
} from '@weco/common/views/components/WorksLink/WorksLink';

type GetWorkProps = {
  id: string;
  toggles: Toggles;
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
  'holdings',
];

export const missingAltTextMessage =
  'No text description is available for this image';

const redirect = (id: string, status = 302): CatalogueApiRedirect => ({
  type: 'Redirect',
  redirectToId: id,
  status,
});

/** Creates the YYYY-MM-DD date string we pass to the API.
 *
 * Note: the filter GUI expects users to enter dates as a four-digit year (e.g. 1939).
 * We pin to the start/end of the year so that the range is inclusive.
 *
 * e.g. a user who searches for works 'to 2001' should find works created in 2001.
 */
function toIsoDateString(
  s: string | undefined,
  range: 'to' | 'from'
): string | undefined {
  if (s) {
    try {
      const d = new Date(s);
      return range === 'from'
        ? `${d.getUTCFullYear()}-01-01`
        : `${d.getUTCFullYear()}-12-31`;
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
}

/** Run a query with the works API.
 *
 * Note: this method is responsible for encoding parameters in an API-compatible
 * way, e.g. wrapping strings in quotes.  Callers should pass in an unencoded
 * set of parameters.
 *
 * https://wellcomecollection.org/works?subjects.label=%22Thackrah%2C+Charles+Turner%2C+1795-1833%22
 */
export async function getWorks(
  props: QueryProps<CatalogueWorksApiProps>
): Promise<CatalogueResultsList<Work> | CatalogueApiError> {
  const params: WorksProps = {
    ...emptyWorksProps,
    ...props.params,
  };
  const query = toQuery(params);

  const extendedParams = {
    ...params,
    ...query,
    'production.dates.from': toIsoDateString(
      query['production.dates.from'] as string,
      'from'
    ),
    'production.dates.to': toIsoDateString(
      query['production.dates.to'] as string,
      'to'
    ),
    include: worksIncludes,
  };

  return catalogueQuery('works', {
    ...props,
    params: extendedParams,
  });
}

type WorkResponse = Work | CatalogueApiError | CatalogueApiRedirect;

export async function getWork({
  id,
  toggles,
}: GetWorkProps): Promise<WorkResponse> {
  if (!looksLikeCanonicalId(id)) {
    return notFound();
  }

  const apiOptions = globalApiOptions(toggles);

  const params = {
    include: workIncludes,
  };

  const searchParams = new URLSearchParams(propsToQuery(params)).toString();
  const url = `${rootUris[apiOptions.env]}/v2/works/${id}?${searchParams}`;

  const res = await catalogueFetch(url, { redirect: 'manual' });

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

  if (res.status === 404) {
    return notFound();
  }

  try {
    return await res.json();
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
        content.label.startsWith('Text of page')
    );

  const textService = textContent && textContent['@id'];

  if (textService) {
    try {
      const textJson = await fetch(encodeURI(textService));
      const text = await textJson.json();
      const textString = text.resources
        .filter(resource => {
          return resource.resource['@type'] === 'cnt:ContentAsText';
        })
        .map(resource => resource.resource.chars)
        .join(' ');
      return textString.length > 0 ? textString : missingAltTextMessage;
    } catch (e) {
      return missingAltTextMessage;
    }
  }
}

export async function getWorkClientSide(workId: string): Promise<WorkResponse> {
  // passing credentials: 'same-origin' ensures we pass the cookies to
  // the API; in particular the toggle cookies
  const response = await fetch(`/api/works/${workId}`, {
    credentials: 'same-origin',
  });

  const work: WorkResponse = await response.json();
  return work;
}

export async function getWorkItemsClientSide(
  workId: string,
  signal: AbortSignal | null
): Promise<ItemsList | CatalogueApiError> {
  // passing credentials: 'same-origin' ensures we pass the cookies to
  // the API; in particular the toggle cookies
  const response = await fetch(`/api/works/items/${workId}`, {
    signal,
    credentials: 'same-origin',
  });

  const items = await response.json();
  return items;
}
