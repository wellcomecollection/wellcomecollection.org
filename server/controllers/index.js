// TODO: FlowType this module
import type {Series} from '../model/series';
import type {Promo} from '../model/promo';
import {PromoFactory} from '../model/promo';
import {createPageConfig} from '../model/page-config';
import {getArticleStubs, getArticle, getSeries} from '../services/wordpress';
import {getForwardFill, getUnpublishedSeries} from '../model/series';
import { getSeriesColor } from '../data/series';
import {PromoListFactory} from '../model/promo-list';
import {PaginationFactory} from '../model/pagination';
import {createNumberedList} from '../model/numbered-list';
import { getLatestTweets } from '../services/twitter';

const maxItemsPerPage = 32;

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
      inSection: 'explore'
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
      inSection: 'explore'
    }),
    list: promoList,
    pagination
  });

  return next();
};

export const seriesNav = async(ctx, next) => {
  const {id} = ctx.params;
  const {current} = ctx.request.query;
  const seriesResponse = await getSeries(id, 6, 1);
  const series = seriesResponse ? getForwardFill(seriesResponse) : getUnpublishedSeries(id);

  const color = getSeriesColor(id);
  const promoList = PromoListFactory.fromSeries(series);
  const items = promoList.items.toJS();
  const image = items[0].image;
  const seriesNavModel = createNumberedList({
    name: promoList.name,
    image: image,
    items: items,
    color: color
  });

  ctx.render('components/numbered-list/index', {
    current,
    model: seriesNavModel,
    modifiers: ['horizontal', 'sticky'],
    data: {
      classes: ['js-series-nav'],
      sliderId: `series-nav--${id}`
    }
  });

  ctx.body = {
    html: ctx.body
  };

  return next();
};

export const seriesTransporter = async(ctx, next) => {
  const { id } = ctx.params;
  const { current } = ctx.request.query;
  const seriesResponse = await getSeries(id, 6, {page: 1});
  const series = seriesResponse ? getForwardFill(seriesResponse) : getUnpublishedSeries(id);

  const color = getSeriesColor(id);
  const promoList = PromoListFactory.fromSeries(series);
  const items = promoList.items.toJS();
  const image = items[0].image;
  const seriesNavModel = createNumberedList({
    name: promoList.name,
    image: image,
    items: items,
    color: color
  });

  ctx.render('components/numbered-list/index', {
    current,
    model: seriesNavModel,
    modifiers: ['transporter'],
    data: {
      classes: ['js-numbered-list-transporter'],
      sliderId: `transporter--${id}`
    }
  });

  ctx.body = {
    html: ctx.body
  };

  return next();
};

export const latestTweets = async(ctx, next) => {
  const count = ctx.params.count || 4;
  const tweets = await getLatestTweets(count);

  ctx.render('components/social-media-block/index', {
    model: {
      posts: tweets,
      service: 'Twitter',
      icon: 'social/twitter',
      url: 'https://twitter.com/explorewellcome',
      handle: 'explorewellcome'
    }
  });

  ctx.body = {
    html: ctx.body
  };
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
    pageConfig: createPageConfig({inSection: 'index'}),
    flags: ctx.intervalCache.get('flags'),
    cohorts: ctx.intervalCache.get('cohorts')
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
