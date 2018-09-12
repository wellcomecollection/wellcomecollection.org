// @flow
import fetch from 'isomorphic-unfetch';

// TODO: create from swagger docs
type Work = Object; // JS Object

type GetWorkProps = {|
  id: string,
  version?: number
|}

// TODO: Type from swagger docs
type GetWorksProps = {|
  query: ?string,
  page: ?number,
  version?: number
|}

const rootUri = 'https://api.wellcomecollection.org/catalogue';
const include = [
  [],
  ['identifiers', 'thumbnail', 'items'],
  ['identifiers', 'items', 'contributors', 'subjects', 'genres', 'production']
];

export async function getWork({ id, version = 1 }: GetWorkProps): Work {
  const includeString = include[version].join(',');
  // We use include and includes as it will be changing at some point
  const url = `${rootUri}/v${version}/works/${id}?includes=${includeString}&include=${includeString}`;
  const res = await fetch(url);
  const json = res.json();
  // TODO: error handling
  return json;
}

export async function getWorks({ query, page, version = 1 }: GetWorksProps): Object {
  const includeString = include[version].join(',');
  // We use include and includes as it will be changing at some point
  const url = `${rootUri}/v${version}/works?includes=${includeString}&include=${includeString}`;
  const res = await fetch(
    `${url}&pageSize=100` +
    (query ? `&query=${query}` : '') +
    (page ? `&page=${page}` : '')
  );
  const json = await res.json();
  return json;
}
