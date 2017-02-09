// @flow
import {type ArticlePromo, ArticlePromoFactory} from '../model/article-promo';
import {List} from 'immutable';
import request from 'superagent';
import {ArticleFactory} from '../model/article';

export type PostsResponse = {
  length: number;
  total: number;
  data: List<ArticlePromo>;
}

const baseUri = 'https://public-api.wordpress.com/rest/v1.1/sites/blog.wellcomecollection.org';

export async function getPosts(size: number = 20): Promise<PostsResponse> {
  const uri = `${baseUri}/posts/`;
  const response = await request(uri).query({
    fields: 'slug,title,excerpt,post_thumbnail,date',
    number: size
  });

  const posts: List<ArticlePromo> = List(response.body.posts).map(post => {
    return (ArticlePromoFactory.fromWpApi(post): ArticlePromo);
  });

  return {
    length: size,
    total: parseInt(response.body.found, 10),
    data: posts
  };
}

export async function getArticle(id: string) {
  const uri = `${baseUri}/posts/${id}`;
  const response = await request(uri);
  const valid = response.type === 'application/json' && response.status === 200;

  if (valid) {
    return ArticleFactory.fromWpApi(response.body);
  }
}
