import request from 'superagent';
import Article from '../model/article';
const baseUri = 'https://wellcomecollection.org/api/v0';

export async function getArtefact(id) {
  const uri = `${baseUri}/articles/${id}`;
  const response = await request(uri);
  const valid = response.type === 'application/json' && response.status === 200;

  if (valid) {
    return Article.fromDrupalApi(response.body);
  }
}
