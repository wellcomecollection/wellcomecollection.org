// TODO: FlowType this module
import type {Series} from '../model/series';
import type {Promo} from '../model/promo';
import {PromoFactory} from '../model/promo';
import {createPageConfig, getEditorialAnalyticsInfo} from '../model/page-config';
import {getArticleStubs, getArticle, getSeries} from '../services/wordpress';
import {PromoListFactory} from '../model/promo-list';
import {PaginationFactory} from '../model/pagination';

const maxItemsPerPage = 32;

export const article = async(ctx, next) => {
  const slug = ctx.params.slug;
  const format = ctx.request.query.format;
  const article = await getArticle(`slug:${slug}`);
  const editorialAnalyticsInfo = getEditorialAnalyticsInfo(article);
  const pageConfig = createPageConfig(Object.assign({}, {
    title: article.headline,
    inSection: 'explore',
    category: 'editorial'
  }, editorialAnalyticsInfo));

  if (article) {
    if (format === 'json') {
      ctx.body = article;
    } else {
      ctx.render('pages/article', {pageConfig, article});
    }
  }

  return next();
};

export const articles = async(ctx, next) => {
  const {page, q} = ctx.request.query;
  const articleStubsResponse = await getArticleStubs(maxItemsPerPage, {page}, q);
  const series: Series = {
    url: '/articles',
    name: 'Articles',
    items: articleStubsResponse.data,
    total: articleStubsResponse.total
  };
  const promoList = PromoListFactory.fromSeries(series);
  const pagination = PaginationFactory.fromList(promoList.items, promoList.total, parseInt(page, 10) || 1);

  ctx.render('pages/list', {
    pageConfig: createPageConfig({
      title: 'Articles',
      inSection: 'explore',
      category: 'list'
    }),
    list: promoList,
    pagination
  });

  return next();
};

export const series = async(ctx, next) => {
  const {id, page} = ctx.params;
  const series = await getSeries(id, maxItemsPerPage, page);
  const promoList = PromoListFactory.fromSeries(series);
  const pagination = PaginationFactory.fromList(promoList.items, promoList.total, parseInt(page, 10) || 1);

  ctx.render('pages/list', {
    pageConfig: createPageConfig({
      title: series.name,
      inSection: 'explore',
      category: 'list',
      seriesUrl: id
    }),
    list: promoList,
    pagination
  });

  return next();
};

export const explore = async(ctx, next) => {
  const articleStubs = await getArticleStubs(50);
  const grouped = articleStubs.data.groupBy(stub => stub.headline.indexOf('A drop in the ocean:') === 0);
  const theRest = grouped.first();
  const topPromo = PromoFactory.fromArticleStub(theRest.first(), 'lead');
  const second3Promos = theRest.slice(1, 4).map(PromoFactory.fromArticleStub);
  const next8Promos = theRest.slice(4, 12).map(PromoFactory.fromArticleStub);
  const aDropInTheOceanStubs = grouped.last().take(7);
  const aDropInTheOceanSeries: Series = {
    url: '/series/a-drop-in-the-ocean',
    name: 'A drop in the ocean',
    items: aDropInTheOceanStubs,
    description: 'This series showcases many different voices and perspectives from people with\
                  lived experience of mental ill health and explores their ideas of personal asylum\
                  through sculpture, vlogging, poetry and more.'
  };

  const collectorsPromo: Promo = {
    modifiers: ['standalone'],
    url: 'http://digitalstories.wellcomecollection.org/pathways/2-the-collectors/',
    title: 'The Collectors',
    description: 'Searchers, secrets and the power of curiosity.',
    image: {
      contentUrl: 'https://wellcomecollection.files.wordpress.com/2017/03/the-collectors-promo.jpg',
      width: 1600,
      height: 900
    },
    positionInSeries: 1,
    series: [{
      color: 'turquoise',
      commissionedLength: 1,
      items: {
        size: 1
      }
    }]
  };

  const aDropInTheOceanPromoList = PromoListFactory.fromSeries(aDropInTheOceanSeries);
  const latestDigitalStory = 'electric-sublime';
  const latestTweets = ctx.intervalCache.get('tweets');

  ctx.render('pages/explore', {
    pageConfig: createPageConfig({
      title: 'Explore',
      inSection: 'explore'
    }),
    latestDigitalStory,
    aDropInTheOcean: aDropInTheOceanPromoList,
    topPromo,
    second3Promos,
    next8Promos,
    collectorsPromo,
    latestTweets
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

export const featureFlags = (ctx, next) => {
  ctx.render('pages/flags', {
    pageConfig: createPageConfig({inSection: 'index'})
  });
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
  const endTimeFormatted = `${endTime[0]}s ${endTime[1] / 1000000}ms`;

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
  const format = ctx.request.query.format;
  const authToken = ctx.cookies.get('WC_wpAuthToken');
  const article = await getArticle(id, authToken);

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
