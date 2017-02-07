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

export const articles = async(ctx) => {
  const wpPosts = await getPosts(32);
  const promos = postsToPromos(wpPosts);

  // TODO: We might change this to `index`
  return ctx.render('pages/articles', {
    pageConfig: createPageConfig({
      title: 'Explore',
      inSection: 'explore'
    }),
    promos
  });
};

function postsToPromos(posts) {
  return posts.map(articlePromo => {
    const promo: Promo = {
      modifiers: [],
      article: articlePromo,
      meta: {}
    };
    return promo;
  });
}

export const explore = async(ctx) => {
  const wpPosts = await getPosts();
  const topPromo = postsToPromos(wpPosts.take(1)).first();
  const second3Promos = postsToPromos(wpPosts.slice(1, 4));
  const next8Promos = postsToPromos(wpPosts.slice(4, 12));

  return ctx.render('pages/explore', {
    pageConfig: createPageConfig({
      title: 'Explore',
      inSection: 'explore'
    }),
    topPromo,
    second3Promos,
    next8Promos
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
