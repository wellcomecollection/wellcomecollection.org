import request from 'superagent';
import {ArticleFactory} from "../model/article";
import {prismicParser} from '../util/prismic-parser';

export async function exportPrismicArticles() {
  const uri = `https://public-api.wordpress.com/rest/v1.1/sites/blog.wellcomecollection.org/posts?number=1&fields=slug`;
  const resp = await request(uri);
  const total = resp.body.found;
  const numberOfRequests = Math.ceil(total/100);
  const requests = new Array(numberOfRequests).fill().map((_, i) => getArticles(i+1)); // no zero index for pages
  const allTheArticlesInArrays = await Promise.all(requests);
  const allTheArticles = allTheArticlesInArrays.reduce((all, articles) => all.concat(articles));

  return allTheArticles;
}

async function getArticles(page) {
  const uri = `https://public-api.wordpress.com/rest/v1.1/sites/blog.wellcomecollection.org/posts?number=100&page=${page}`;

  // console.info(uri)
  const resp = await request(uri);
  return resp.body.posts.map(post =>
    ({article: ArticleFactory.fromWpApi(post), slug: post.slug})
  ).map(({article, slug}) => prismicParser(slug, article));
}
