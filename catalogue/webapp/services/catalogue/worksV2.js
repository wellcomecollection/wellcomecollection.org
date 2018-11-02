// @flow
import fetch from 'isomorphic-unfetch';

type GetWorksProps = {|
  query: ?string,
  page: ?number,
  version?: number
|}

const rootUri = 'https://api.wellcomecollection.org/catalogue';
const includes = ['identifiers', 'items', 'contributors', 'subjects', 'genres', 'production'];

export async function getWorks({ query, page }: GetWorksProps): Object {
  const url = `${rootUri}/v2/works?include=${includes.join(',')}` +
    `&pageSize=10` +
    '&workType=q,k' +
    '&items.locations.locationType=iiif-image,iiif-presentation' +
    (query ? `&query=${encodeURIComponent(query)}` : '') +
    (page ? `&page=${page}` : '');
  const res = await fetch(url);
  const json = await res.json();
  return json;
}
