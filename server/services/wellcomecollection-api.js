// @flow
import superagent from 'superagent';
import type {Work} from '../model/work';

const version = 'v1';
const baseUri = `https://api.wellcomecollection.org/catalogue/${version}`;

type WorkQuery = {
  includes: string;
  _index?: string;
};

type WorksQuery = {
  query: string;
  includes: string;
  page: number;
  pageSize: number;
  _index?: string;
};

export async function getWork(id: string, imageIndex: string): Promise<Work> {
  const indexParam = imageIndex ? {'_index': imageIndex} : {};
  const totalQuery: WorkQuery = Object.assign({}, indexParam, {includes: 'identifiers,thumbnail,items'});
  const resp = await superagent.get(`${baseUri}/works/${id}`).query(totalQuery);

  return resp.body;
}

export async function getWorks(query: string, page: number, imageIndex: string): Promise<Work> {
  const indexParam = imageIndex ? {'_index': imageIndex} : {};
  const totalQuery: WorksQuery = Object.assign({}, indexParam, {query, includes: 'identifiers,thumbnail', page, pageSize: 96});

  const resp = await superagent.get(`${baseUri}/works`).query(totalQuery);
  return resp.body;
}
