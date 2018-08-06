// @flow
import fetch from 'isomorphic-unfetch';

// TODO: create from swagger docs
type Work = Object; // JS Object

type GetWorkProps = {|
  id: string,
  version?: number
|}
export async function getWork({ id, version = 1 }: GetWorkProps): Work {
  const res = await fetch(`https://api.wellcomecollection.org/catalogue/v${version}/works/${id}?includes=identifiers,items,thumbnail`);
  const json = res.json();
  // TODO: error handling
  return json;
}

// TODO: Type from swagger docs
type GetWorksProps = {|
  query: ?string,
  page: ?number,
  version?: number
|}
export async function getWorks({ query, page, version = 1 }: GetWorksProps): Object {
  const res = await fetch(
    `https://api.wellcomecollection.org/catalogue/v${version}/works?` +
    `includes=identifiers,thumbnail,items&pageSize=100` +
    (query ? `&query=${query}` : '') +
    (page ? `&page=${page}` : '')
  );
  const json = await res.json();
  return json;
}
