// @flow
import fetch from 'isomorphic-unfetch';
import {
  type CatalogueResultsList,
  type CatalogueApiError,
  type CatalogueAggregationBucket,
  type Work,
  type CatalogueApiRedirect,
} from '@weco/common/model/catalogue';
import { removeEmptyProps } from '@weco/common/utils/json';
import { defaultWorkTypes } from '@weco/common/services/catalogue/search-params';

const rootUris = {
  prod: 'https://api.wellcomecollection.org/catalogue',
  stage: 'https://api-stage.wellcomecollection.org/catalogue',
};

type Enviable = {|
  env?: $Keys<typeof rootUris>,
|};

type GetWorksProps = {|
  filters: Object,
  ...Enviable,
|};

type GetWorkProps = {|
  id: string,
  ...Enviable,
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
  filters,
  env = 'prod',
}: GetWorksProps): Promise<CatalogueResultsList | CatalogueApiError> {
  const filterQueryString = Object.keys(removeEmptyProps(filters)).map(key => {
    const val = filters[key];
    return `${key}=${val}`;
  });
  const url =
    `${rootUris[env]}/v2/works?include=${worksIncludes.join(',')}` +
    `&pageSize=25` +
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

export async function getWorkTypeAggregations({
  filters,
  unfilteredSearchResults,
  env = 'prod',
}: any): Promise<CatalogueAggregationBucket[]> {
  const filterQueryString = Object.keys(removeEmptyProps(filters)).map(key => {
    const val = filters[key];
    return key !== 'workType' && `${key}=${val}`;
  });
  const url =
    `${rootUris[env]}/v2/works?include=${workIncludes.join(',')}` +
    `&aggregations=workType&workType=${
      unfilteredSearchResults ? '' : defaultWorkTypes.join(',')
    }` +
    (filterQueryString.length > 0 ? `&${filterQueryString.join('&')}` : '');

  const res = await fetch(url);
  const json = await res.json();

  return json.aggregations.workType.buckets;
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
