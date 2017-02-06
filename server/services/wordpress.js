// @flow
import {type ArticlePromo, ArticlePromoFactory} from '../model/article-promo';
import {List} from 'immutable';
import request from 'superagent';
import {ArticleFactory} from '../model/article';
const baseUri = 'https://public-api.wordpress.com/rest/v1.1/sites/blog.wellcomecollection.org';

export async function getPosts(): Promise<List<ArticlePromo>> {
  const uri = `${baseUri}/posts/`;
  const response = await request(uri).query({fields: 'slug,title,excerpt,post_thumbnail'});

  const posts: List<ArticlePromo> = List(response.body.posts).map(post => {
    return (ArticlePromoFactory.fromWpApi(post): ArticlePromo);
  });

  return posts;
}

export async function getArticle(id: string) {
  const uri = `${baseUri}/posts/slug:${id}`;
  const response = await request(uri);
  const valid = response.type === 'application/json' && response.status === 200;

  if (valid) {
    return ArticleFactory.fromWpApi(response.body);
  }
}
