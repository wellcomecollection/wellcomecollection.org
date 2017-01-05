import request from 'superagent';
import Article from '../model/article';
<<<<<<< HEAD
import {PageConfig}from '../model/page-config';
=======
import {getPosts, getArticle} from '../services/wordpress';
>>>>>>> 9e4d3dbc122a26d7909fd358cc9c18625619a76b

export const article = async(ctx, next) => {
  const id = ctx.params.id;
  // TODO: This should be discoverable - not hard-coded
  const uri = `https://wellcomecollection.org/api/v0/${id}`;
  const response = await request(uri);
  const valid = response.type === 'application/json' && response.status === 200;

  if (valid) {
    return ctx.render('pages/article', {
      pageConfig: new PageConfig({inSection: 'explore'}),
      article: Article.fromDrupalApi(response.body)
    });
  } else {
    return next();
  }
};

export const wpArticle = async(ctx, next) => {
    const id = ctx.params.id;
    const article = await getArticle(id);

    return article ? ctx.render('pages/article', {
      pageConfig: new PageConfig({inSection: 'explore'}),
      article: Article.fromWpApi(response.body)
    }) : next();
};

export const explore = async(ctx) => {
  const wpPosts = await getPosts();
  return ctx.render('pages/explore', {wpPosts});
};

export const favicon = (ctx) => ctx.body = '';
export const healthcheck = (ctx) => ctx.body = 'ok';
