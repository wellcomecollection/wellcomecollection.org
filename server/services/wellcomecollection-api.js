// @flow
import superagent from 'superagent';
import type {Work} from '../model/work';

const version = 'v0';
const baseUri = `https://api.wellcomecollection.org/catalogue/${version}`;

export async function getWork(id: string): Promise<Work> {
  return await superagent.get(`${baseUri}/works/${id}`)
    .query({includes: 'identifiers,thumbnail'})
    .then((request) => request.body);
}

export async function getWorks(query: string, page: string): Promise<Work> {
  return await superagent.get(`${baseUri}/works`)
    .query({query, includes: 'identifiers', page, pageSize: 96})
    .then((request) => {
      return request.body;
    }).catch((error) => {
      return { error };
    });
}
