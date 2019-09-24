// @flow
import fetch from 'isomorphic-unfetch';
import {
  type CatalogueResultsList,
  type CatalogueApiError,
  type Work,
  type CatalogueApiRedirect,
} from '@weco/common/model/catalogue';
import { removeEmptyProps } from '@weco/common/utils/json';

const rootUris = {
  prod: 'https://api.wellcomecollection.org/catalogue',
  stage: 'https://api-stage.wellcomecollection.org/catalogue',
};

type Enviable = {|
  env?: $Keys<typeof rootUris>,
|};

type GetWorksProps = {|
  query: string,
  page: number,
  filters: Object,
  ...Enviable,
|};

type GetWorkProps = {|
  id: string,
  ...Enviable,
|};

const includes = [
  'identifiers',
  'items',
  'contributors',
  'subjects',
  'genres',
  'production',
];

export async function getWorks({
  query,
  page,
  filters,
  env = 'prod',
}: GetWorksProps): Promise<CatalogueResultsList | CatalogueApiError> {
  const filterQueryString = Object.keys(removeEmptyProps(filters)).map(key => {
    const val = filters[key];
    return `${key}=${val}`;
  });
  const url =
    `${rootUris[env]}/v2/works?include=${includes.join(',')}` +
    `&pageSize=25` +
    (filterQueryString.length > 0 ? `&${filterQueryString.join('&')}` : '') +
    (query ? `&query=${encodeURIComponent(query)}` : '') +
    (page ? `&page=${page}` : '');

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
  const url = `${rootUris[env]}/v2/works/${id}?include=${includes.join(',')}`;
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
