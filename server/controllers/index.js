import request from 'superagent';
import Article from '../model/article';

export const exploreArticle = async(ctx, next) => {
  const id = ctx.params.id;
  // TODO: This should be discoverable - not hard-coded
  const uri = `https://wellcomecollection.org/api/v0/${id}`;
  const response = await request(uri);
  const valid = response.type === 'application/json' && response.status === 200;

  if (valid) {
    return ctx.render('article/index', Article.fromExploreApi(response.body));
  } else {
    return next();
  }
};

export const libraryArticle = async(ctx, next) => {
  const id = ctx.params.id;
  // TODO: This should be discoverable - not hard-coded
  const uri = `http://blog.wellcomelibrary.org/wp-json/wp/v2/posts?slug==${id}`;
  const response = await request(uri);
  const valid = response.type === 'application/json' && response.status === 200;

  if (valid) {
    return ctx.render('article/index', Article.fromLibraryApi(response.body[0]));
  } else {
    return next();
  }
};


export const favicon = (ctx) => ctx.body = '';
export const healthcheck = (ctx) => ctx.body = 'ok';
