import request from 'superagent';
import Article from '../model/article';
import {ArticleFactory} from '../model/articleV2';
const baseUri = 'https://public-api.wordpress.com/rest/v1.1/sites/blog.wellcomecollection.org';

export async function getPosts() {
  const uri = `${baseUri}/posts/`;
  const response = await request(uri).query({fields: 'slug,title'});

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
