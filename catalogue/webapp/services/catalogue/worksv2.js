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

const rootUri = 'https://api.wellcomecollection.org/catalogue';
const includes = ['identifiers', 'items', 'contributors', 'subjects', 'genres', 'production'];

export async function getWorks({
  query,
  page,
  filters
}: GetWorksProps): Object {
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

  return json;
}

export async function getWork({ id }: GetWorkProps): Object {
  const url = `${rootUri}/v2/works/${id}?include=${includes.join(',')}`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
}
