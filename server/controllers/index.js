// TODO: FlowType this module
import {type Promo} from '../model/promo';
import {createPageConfig} from '../model/page-config';
import {getPosts, getArticle} from '../services/wordpress';

export const article = async(ctx, next) => {
    const id = ctx.params.id;
    const format = ctx.request.query.format;
    const article = await getArticle(id);

    if (article) {
      if (format === 'json') {
        ctx.body = article;
        return article;
      } else {
        return ctx.render('pages/article', {
          pageConfig: createPageConfig({
            title: article.headline,
            inSection: 'explore'
          }),
          article: article
        });
      }
    } else {
      return next();
    }
};

export const explore = async(ctx) => {
  const wpPosts = await getPosts();
  const top4ArticlePromos = wpPosts.take(4);
  const top4Promos = top4ArticlePromos.map(articlePromo => {
    const promo: Promo = {
      modifiers: [],
      article: articlePromo,
      url: articlePromo.url,
      meta: {}
    };
    return promo;
  });

  return ctx.render('pages/explore', {
    pageConfig: createPageConfig({
      title: 'Explore',
      inSection: 'explore'
    }),
    top4Promos
  });
};

export const index = (ctx) => ctx.render('pages/index', {
  pageConfig: createPageConfig({inSection: 'index'})
});

export const healthcheck = (ctx) => ctx.body = 'ok';

export const performanceTest = async(ctx, next) => {
  const articleId = 'a-drop-in-the-ocean-daniel-regan';
  const startTime = process.hrtime();
  const article = await getArticle(articleId);

  ctx.render('pages/article', {
    pageConfig: createPageConfig({inSection: 'explore'}),
    article: article
  });

  const endTime = process.hrtime(startTime);
  const endTimeFormatted = `${endTime[0]}s ${endTime[1]/1000000}ms`;

  ctx.type = 'application/javascript';
  ctx.body = `
    if (console) {
      console.log('Incoming from next.wellcomecollection.org, ${articleId} took ${endTimeFormatted}');
    }
  `;

  return next();
};

export const explosion = (ctx) => {
  const {errorCode} = ctx.params;
  const message = `Forced explosion of type ${errorCode}`;
  ctx.status = parseInt(errorCode, 10);
  ctx.body = { errorCode, message };
};
