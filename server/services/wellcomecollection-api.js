// @flow
import superagent from 'superagent';
import type {Work} from '../model/work';

const version = 'v1';
const baseUri = `https://api.wellcomecollection.org/catalogue/${version}`;

export async function getWork(id: string): Promise<Work> {
  return await superagent.get(`${baseUri}/works/${id}`)
    .query({includes: 'identifiers,thumbnail'})
    .then((request) => request.body);
}

export async function getWorks(query: string, page: string, imageIndex: string): Promise<Work> {
  const indexParam = imageIndex ? {'_index': imageIndex} : {};
  const totalQuery = Object.assign(indexParam, {query, includes: 'identifiers,thumbnail', page, pageSize: 96});
  return await superagent.get(`${baseUri}/works`)
    .query(totalQuery)
    .then((request) => {
      return request.body;
    }).catch((error) => {
      return { error };
    });
}
