// @flow
import superagent from 'superagent';
import {type CatalogueItem} from '../model/catalogue-item';

const version = 'v0';
const baseUri = `https://api.wellcomecollection.org/catalogue/${version}`;

export async function getCatalogueItem(id: string): Promise<CatalogueItem> {
  const request = await superagent.get(`${baseUri}/${id}`);
  return request;
}
