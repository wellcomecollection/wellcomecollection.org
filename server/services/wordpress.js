// @flow
import {List} from 'immutable';
import request from 'superagent';
import {type ArticleStub, ArticleStubFactory} from '../model/article-stub';
import {type Series} from "../model/series";
import {ArticleFactory} from '../model/article';

export type ArticleStubsResponse = {|
  length: number;
  total: number;
  data: List<ArticleStub>;
|}

const baseUri = 'https://public-api.wordpress.com/rest/v1.1/sites/blog.wellcomecollection.org';

export async function getArticleStubs(size: number = 20, page: number = 1, q: string = ''): Promise<ArticleStubsResponse> {
  const uri = `${baseUri}/posts/`;
  const queryObj = constructQueryFromQueryString(q);
  const queryToWpQueryMap = { categories: 'category', tags: 'tag' };
  const wpQueryObject = Object.keys(queryObj).reduce((acc, key) => {
    const newKey = queryToWpQueryMap[key] || key;
    return Object.assign({}, acc, {[newKey]: queryObj[key]});
  }, {});
  console.info(wpQueryObject)

  const query = Object.assign({}, {
    fields: 'slug,title,excerpt,post_thumbnail,date,categories,format',
    number: size
  }, {page}, wpQueryObject);

  // console.info(query);

  const response = await request(uri).query(query);

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


export async function getSeries(id: string, size: number, page: number = 1): Promise<?Series> {
  const posts = await getArticleStubs(size, page, `categories:${id}`);
  const {total} = posts;
  const items = posts.data;

  if (items.size !== 0) {
    // TODO: What a fudge !_!
    // $FlowFixMe as this is a hack
    const {name, description} = items.first().series[0];

    return ({
      url: id,
      name,
      description,
      total,
      items,
      color: 'purple'
    }: Series);
  } else {
    return null;
  }
}

export function constructQueryFromQueryString(q: string): { page?: number, categories?: string, tags?: string } {
  const allowedProps = ['categories', 'tags'];

  return q.split(' ').reduce((acc, keyAndValue) => {
    const [key, value] = keyAndValue.split(':');
    return allowedProps.indexOf(key) !== -1 && value ? Object.assign({}, acc, {[key]: value}) : acc;
  }, {});
}
