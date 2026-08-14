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
  emptyWorksProps,
  toQuery,
  WorksProps,
} from '@weco/content/views/components/SearchPagesLink/Works';

import { catalogueQuery, looksLikeCanonicalId, notFound } from '.';
import {
  CatalogueApiRedirect,
  CatalogueResultsList,
  CatalogueWorksApiProps,
  ItemsList,
  Work,
} from './types';

export type ArchiveWorkData = {
  title: string;
  productionDates: string[];
  primaryContributorLabel: string | undefined;
  physicalDescription: string | undefined;
};

type GetWorkProps = {
  id: string;
  shouldUseStagingApi?: boolean;
  pipelineCluster?: string;
  include?: string[];
};

const worksIncludes = ['production', 'contributors', 'partOf', 'collection'];

const workIncludes = [
  ...worksIncludes,
  'identifiers',
  'images',
  'items',
  'subjects',
  'genres',
  'notes',
  'formerFrequency',
  'designation',
  'parts',
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
): Promise<CatalogueResultsList<Work> | WellcomeApiError> {
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

type WorkResponse =
  (Work & { url: string }) | WellcomeApiError | CatalogueApiRedirect;

export async function getWork({
  id,
  shouldUseStagingApi,
  pipelineCluster,
  include = workIncludes,
}: GetWorkProps): Promise<WorkResponse> {
  if (!looksLikeCanonicalId(id)) {
    return notFound();
  }

  const apiOptions = globalApiOptions(shouldUseStagingApi);

  const params = {
    include,
    // propsToQuery drops undefined values, so no param is added when the
    // cataloguePipeline mode is unset
    elasticCluster: pipelineCluster,
  };

  const searchParams = new URLSearchParams(propsToQuery(params)).toString();
  const url = `${rootUris[apiOptions.env.catalogue]}/catalogue/v2/works/${id}?${searchParams}`;

  const res = await wellcomeApiFetch(url, { redirect: 'manual' });

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
    const work = (await res.json()) as Work;
    return { ...work, url };
  } catch {
    return wellcomeApiError();
  }
}

export async function getWorkClientSide(workId: string): Promise<WorkResponse> {
  // passing credentials: 'same-origin' ensures we pass the cookies to
  // the API; in particular the toggle cookies
  const response = await fetch(`/api/works/${workId}`, {
    credentials: 'same-origin',
  });

  const resp = await response.json();

  if (resp.type === 'Redirect') {
    return getWorkClientSide(resp.redirectToId);
  } else {
    return resp;
  }
}

export async function getArchiveWorks(
  ids: string[],
  shouldUseStagingApi?: boolean,
  pipelineCluster?: string
): Promise<Record<string, ArchiveWorkData>> {
  const settled = await Promise.allSettled(
    ids.map(id =>
      getWork({
        id,
        shouldUseStagingApi,
        pipelineCluster,
        include: ['production', 'contributors'],
      })
    )
  );

  return Object.fromEntries(
    settled
      .flatMap((outcome, i) => {
        if (outcome.status === 'rejected') {
          console.warn(
            `Failed to fetch archive work ${ids[i]}:`,
            outcome.reason
          );
          return [];
        }
        const result = outcome.value;
        if (result.type === 'Error' || result.type === 'Redirect') return [];
        return [result];
      })
      .map(work => {
        const date = work.production?.[0]?.dates?.[0]?.label;
        const contributor = work.contributors.find(c => c.primary)?.agent.label;
        return [
          work.id,
          {
            title: work.title,
            productionDates: date ? [date] : [],
            primaryContributorLabel: contributor,
            physicalDescription: work.physicalDescription || undefined,
          } satisfies ArchiveWorkData,
        ];
      })
  );
}

// The shape ArchiveCard (content/webapp/views/components/ArchiveCard) needs -
// computed here, server-side, from the full catalogue Work so the page
// component doesn't have to know about contributors/production/etc.
export type ArchiveTypeWorkCard = {
  id: string;
  title: string;
  label?: string;
  description?: string;
  contributor?: string;
  isOrganisation: boolean;
  date?: string;
  extent?: string;
};

function toArchiveTypeWorkCard(work: Work): ArchiveTypeWorkCard {
  const primaryContributor = work.contributors.find(
    contributor => contributor.primary
  );

  return {
    id: work.id,
    title: work.title,
    label: work.referenceNumber,
    description: work.description,
    contributor: primaryContributor?.agent.label,
    isOrganisation: primaryContributor?.agent.type === 'Organisation',
    date: work.production?.[0]?.dates?.[0]?.label,
    extent: work.physicalDescription || undefined,
  };
}

export type ArchiveTypeWorksResult = {
  works: ArchiveTypeWorkCard[];
  totalResults: number;
  totalPages: number;
  pageSize: number;
  // Surfaced via apiToolbarLinks so staff can debug the underlying query.
  requestUrl: string;
};

export const archiveTypeWorksSortFields = [
  'collectionPath',
  'production.dates',
] as const;
export type ArchiveTypeWorksSortField =
  (typeof archiveTypeWorksSortFields)[number];

export async function fetchArchiveTypeWorks({
  id,
  page,
  pageSize = 24,
  sort = 'collectionPath',
  sortOrder = 'asc',
}: {
  id: string;
  page: number;
  pageSize?: number;
  sort?: ArchiveTypeWorksSortField;
  sortOrder?: 'asc' | 'desc';
}): Promise<ArchiveTypeWorksResult | WellcomeApiError> {
  const result = await catalogueQuery<unknown, Work>('works', {
    pageSize,
    params: {
      'archive.category': id,
      'collection.isRoot': 'true',
      workType: 'h,b,hdig',
      include: 'contributors,production',
      sort,
      sortOrder,
      page,
    },
  });

  if (result.type === 'Error') {
    return result;
  }

  return {
    works: result.results.map(toArchiveTypeWorkCard),
    totalResults: result.totalResults,
    totalPages: result.totalPages,
    pageSize: result.pageSize,
    requestUrl: result._requestUrl,
  };
}

export async function getWorkItemsClientSide(
  workId: string,
  signal: AbortSignal | null
): Promise<ItemsList | WellcomeApiError> {
  // passing credentials: 'same-origin' ensures we pass the cookies to
  // the API; in particular the toggle cookies
  const response = await fetch(`/api/works/items/${workId}`, {
    signal,
    credentials: 'same-origin',
  });

  const items = await response.json();
  return items;
}
