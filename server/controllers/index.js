import request from 'superagent';
import Article from '../model/article';

export const article = async(ctx, next) => {
  const id = ctx.params.id;
  // TODO: This should be discoverable - not hard-coded
  const uri = `https://wellcomecollection.org/api/v0/${id}`;
  const response = await request(uri);
  const valid = response.type === 'application/json' && response.status === 200;

  if (valid) {
    return ctx.render('pages/article', Article.fromDrupalApi(response.body));
  } else {
    return next();
  }
};

export const wpArticle = async(ctx, next) => {
    const id = ctx.params.id;
    // TODO: This should be discoverable - not hard-coded
    const uri = `https://public-api.wordpress.com/rest/v1.1/sites/blog.wellcomecollection.org/posts/slug:${id}`;
    const response = await request(uri);
    const valid = response.type === 'application/json' && response.status === 200;

    if (valid) {
        return ctx.render('pages/article', Article.fromWpApi(response.body));
    } else {
        return next();
    }
};

export const explore = (ctx) => ctx.render('pages/explore');
export const favicon = (ctx) => ctx.body = '';
export const healthcheck = (ctx) => ctx.body = 'ok';
