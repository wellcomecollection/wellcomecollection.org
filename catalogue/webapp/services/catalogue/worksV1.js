// @flow
import fetch from 'isomorphic-unfetch';

type GetWorksProps = {|
  query: ?string,
  page: ?number,
  version?: number
|}

const rootUri = 'https://api.wellcomecollection.org/catalogue';
const includes = ['identifiers', 'thumbnail', 'items'];
export async function getWorks({ query, page }: GetWorksProps): Object {
  const url = `${rootUri}/v1/works?includes=${includes.join(',')}`;
  const res = await fetch(
    `${url}&pageSize=10` +
    (query ? `&query=${encodeURIComponent(query)}` : '') +
    (page ? `&page=${page}` : '')
  );
  const json = await res.json();
  return json;
}
