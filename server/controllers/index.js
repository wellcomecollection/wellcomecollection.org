// TODO: FlowType this module
import {type Promo} from '../model/promo';
import {createPageConfig} from '../model/page-config';
import {getPosts, getArticle} from '../services/wordpress';
import {Series} from "../model/series";

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
  const items = postsToPromos(wpPosts.data, 'default');
  const {total} = wpPosts;
  const series: Series = {
    url: '/articles',
    name: 'Articles',
    total,
    items
  };
  ctx.render('pages/list', {
    pageConfig: createPageConfig({
      title: 'Articles',
      inSection: 'explore'
    }),
    list: series
  });

  return next();
};

export const series = async(ctx, next) => {
  const {id} = ctx.params;
  const wpPosts = await getPosts(32, {category: id});
  const items = postsToPromos(wpPosts.data, 'default');
  // TODO: So So nasty
  const {name, description} = wpPosts.data.first().series[0];
  const {total} = wpPosts;
  const series: Series = {
    url: id,
    name,
    description,
    total,
    items
  };

  ctx.render('pages/list', {
    pageConfig: createPageConfig({
      title: name,
      inSection: 'explore'
    }),
    list: series
  });

  return next();
};

export const explore = async(ctx, next) => {
  const wpPosts = await getPosts(50);

  const grouped = wpPosts.data.groupBy(post => post.headline.indexOf('A drop in the ocean:') === 0);
  const theRest = grouped.first();
  const topPromo = postsToPromos(theRest.take(1), 'lead').first();
  const second3Promos = postsToPromos(theRest.slice(1, 4), 'default');
  const next8Promos = postsToPromos(theRest.slice(4, 12), 'default');
  const aDropInTheOceanPromos = postsToPromos(grouped.last().take(7), 'default');
  const aDropInTheOcean: Series = {
    url: '/series/a-drop-in-the-ocean',
    name: 'A drop in the ocean',
    items: aDropInTheOceanPromos,
    description: 'This series showcases many different voices and perspectives from people with\
                  lived experience of mental ill health and explores their ideas of personal asylum\
                  through sculpture, vlogging, poetry and more.'
  };

  ctx.render('pages/explore', {
    pageConfig: createPageConfig({
      title: 'Explore',
      inSection: 'explore'
    }),
    aDropInTheOcean,
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

export const preview = async(ctx, next) => {
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
