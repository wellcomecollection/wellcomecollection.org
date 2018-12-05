// @flow
import fetch from 'isomorphic-unfetch';

type GetWorksProps = {|
  query: string,
  page: number,
  filters: Object
|}

type GetWorkProps = {|
  id: string
|}

export type Work = {
  type: 'Work',
  ...Object
}

export type CatalogueApiError = {|
  errorType: string,
  httpStatus: number,
  label: string,
  description: string,
  type: 'Error'
|}

export type CatalogueResultsList = {
  type: 'ResultList',
  totalResults: number,
  results: Work[]
}

const rootUri = 'https://api.wellcomecollection.org/catalogue';
const includes = ['identifiers', 'items', 'contributors', 'subjects', 'genres', 'production'];

export async function getWorks({
  query,
  page,
  filters
}: GetWorksProps): Promise<CatalogueResultsList | CatalogueApiError> {
  const filterQueryString = Object.keys(filters).map(key => {
    const val = filters[key];
    return `${key}=${val}`;
  });
  const url = `${rootUri}/v2/works?include=${includes.join(',')}` +
    `&pageSize=100` +
    (filterQueryString.length > 0 ? `&${filterQueryString.join('&')}` : '') +
    (query ? `&query=${encodeURIComponent(query)}` : '') +
    (page ? `&page=${page}` : '');

  const res = await fetch(url);
  const json = await res.json();

  return (json: CatalogueResultsList | CatalogueApiError);
}

export async function getWork({
  id
}: GetWorkProps): Promise<Work | CatalogueApiError> {
  const url = `${rootUri}/v2/works/${id}?include=${includes.join(',')}`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
}
