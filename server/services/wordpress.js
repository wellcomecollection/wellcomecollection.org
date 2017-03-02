// @flow
import {type ArticleStub, ArticleStubFactory} from '../model/article-stub§';
import {List} from 'immutable';
import request from 'superagent';
import {ArticleFactory} from '../model/article';

export type PostsResponse = {|
  length: number;
  total: number;
  data: List<ArticleStub>;
|}

const baseUri = 'https://public-api.wordpress.com/rest/v1.1/sites/blog.wellcomecollection.org';

export async function getPosts(size: number = 20, q: {category?:string}): Promise<PostsResponse> {
  const uri = `${baseUri}/posts/`;
  const response = await request(uri).query(Object.assign({}, {
    fields: 'slug,title,excerpt,post_thumbnail,date,categories',
    number: size
  }, q));

  const posts: List<ArticleStub> = List(response.body.posts).map(post => {
    return (ArticleStubFactory.fromWpApi(post): ArticleStub);
  });

  return {
    length: size,
    total: parseInt(response.body.found, 10),
    data: posts
  };
}

export async function getArticle(id: string, authToken: ?string = null) {
  const uri = `${baseUri}/posts/${id}`;
  const response = authToken ? await request(uri).set('Authorization', `Bearer ${authToken}`) : await request(uri);
  const valid = response.type === 'application/json' && response.status === 200;

  if (valid) {
    return ArticleFactory.fromWpApi(response.body);
  }
}
