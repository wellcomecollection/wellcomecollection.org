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
  const promos = postsToPromos(wpPosts.data);

  // TODO: We might change this to `index`
  return ctx.render('pages/articles', {
    pageConfig: createPageConfig({
      title: 'Explore',
      inSection: 'explore'
    }),
    total: wpPosts.total,
    promos
  });
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

export const explore = async(ctx) => {
  const wpPosts = await getPosts(50);

  const grouped = wpPosts.data.groupBy(post => post.headline.indexOf('A drop in the ocean:') === 0);
  const theRest = grouped.first();
  const aDropInTheOcean = grouped.last();
  const topPromo = postsToPromos(theRest.take(1), 'lead').first();
  const second3Promos = postsToPromos(theRest.slice(1, 4), 'default');
  const next8Promos = postsToPromos(theRest.slice(4, 12), 'default');

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

export const explosion = (ctx) => {
  const {errorCode} = ctx.params;
  const message = `Forced explosion of type ${errorCode}`;
  ctx.status = parseInt(errorCode, 10);
  ctx.body = { errorCode, message };
};

export const preview = async(ctx) => {
  const id = ctx.params.id;
  const authToken = ctx.cookies.get('WC_wpAuthToken');
  const article = await getArticle(id, authToken);

  if (article) {
    return ctx.render('pages/article', {
      pageConfig: createPageConfig({
        title: article.headline,
        inSection: 'explore'
      }),
      article: article
    });
  } else {
    return next();
  }
};
