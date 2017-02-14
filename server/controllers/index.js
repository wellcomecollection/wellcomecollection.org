// TODO: FlowType this module
import {type Promo} from '../model/promo';
import {createPageConfig} from '../model/page-config';
import {getPosts, getArticle} from '../services/wordpress';

export const article = async(ctx, next) => {
  const slug = ctx.params.slug;
  const format = ctx.request.query.format;
  const article = await getArticle(`slug:${slug}`);

  if (article) {
    if (format === 'json') {
      ctx.body = article;
    } else {
      ctx.render('pages/article', {
        pageConfig: createPageConfig({
          title: article.headline,
          inSection: 'explore'
        }),
        article: article
      });
    }
  }

  return next();
};

export const articles = async(ctx, next) => {
  const wpPosts = await getPosts(32);
  const promos = postsToPromos(wpPosts.data);

  // TODO: We might change this to `index`
  ctx.render('pages/articles', {
    pageConfig: createPageConfig({
      title: 'Explore',
      inSection: 'explore'
    }),
    total: wpPosts.total,
    promos
  });

  return next();
};

export const explore = async(ctx, next) => {
  const wpPosts = await getPosts();
  const posts = wpPosts.data;
  const topPromo = postsToPromos(posts.take(1), 'lead').first();
  const second3Promos = postsToPromos(posts.slice(1, 4), 'default');
  const next8Promos = postsToPromos(posts.slice(4, 12), 'default');

  ctx.render('pages/explore', {
    pageConfig: createPageConfig({
      title: 'Explore',
      inSection: 'explore'
    }),
    topPromo,
    second3Promos,
    next8Promos
  });

  return next();
};

export const index = (ctx, next) => ctx.render('pages/index', {
  pageConfig: createPageConfig({inSection: 'index'})
}) && next();

export const healthcheck = (ctx, next) => {
  ctx.body = 'ok';
  return next();
};

export const performanceTest = async(ctx, next) => {
  const slug = 'a-drop-in-the-ocean-daniel-regan';
  const startTime = process.hrtime();
  const article = await getArticle(`slug:${slug}`);

  ctx.render('pages/article', {
    pageConfig: createPageConfig({inSection: 'explore'}),
    article: article
  });

  const endTime = process.hrtime(startTime);
  const endTimeFormatted = `${endTime[0]}s ${endTime[1]/1000000}ms`;

  ctx.type = 'application/javascript';
  ctx.body = `
    if (console) {
      console.log('Incoming from next.wellcomecollection.org, ${slug} took ${endTimeFormatted}');
    }
  `;

  return next();
};

export const explosion = (ctx, next) => {
  const {errorCode} = ctx.params;
  const message = `Forced explosion of type ${errorCode}`;
  ctx.status = parseInt(errorCode, 10);
  ctx.body = { errorCode, message };

  return next();
};

export const preview = async(ctx) => {
  const id = ctx.params.id;
  const authToken = ctx.cookies.get('WC_wpAuthToken');
  const article = await getArticle(id, authToken);

  if (article) {
    ctx.render('pages/article', {
      pageConfig: createPageConfig({
        title: article.headline,
        inSection: 'explore'
      }),
      article: article
    });
  }

  return next();
};

function postsToPromos(posts, weight) {
  return posts.map(articlePromo => {
    const promo: Promo = {
      modifiers: [],
      article: articlePromo,
      weight: weight
    };
    return promo;
  });
}
