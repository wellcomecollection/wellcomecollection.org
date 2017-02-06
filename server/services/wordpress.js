import request from 'superagent';
import {ArticleFactory} from '../model/article';
const baseUri = 'https://public-api.wordpress.com/rest/v1.1/sites/blog.wellcomecollection.org';

export async function getPosts() {
  const uri = `${baseUri}/posts/`;
  const response = await request(uri).query({fields: 'slug,title,excerpt'});

  return response.body.posts;
}

export async function getArticle(id) {
  const uri = `${baseUri}/posts/slug:${id}`;
  const response = await request(uri);
  const valid = response.type === 'application/json' && response.status === 200;

  if (valid) {
    return ArticleFactory.fromWpApi(response.body);
  }
}
