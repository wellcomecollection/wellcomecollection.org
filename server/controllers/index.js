// TODO: FlowType this module
import {PromoFactory} from '../model/promo';
import {createPageConfig} from '../model/page-config';
import {getArticleStubs, getArticle, getSeries} from '../services/wordpress';
import {type Series} from '../model/series';
import {PromoListFactory} from '../model/promo-list';
import {PaginationFactory} from '../model/pagination';

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
  const {page} = ctx.request.query;
  const articleStubsResponse = await getArticleStubs(maxItemsPerPage, {page});
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
  const series = await getSeries(id, 6, 1);
  const promoList = PromoListFactory.fromSeries(series);
  // TODO: Commissioned length
  // TODO: Forward fill

  ctx.render('components/series-nav/index', {
    current,
    list: promoList,
  });

  ctx.body = {
    html: ctx.body
  };

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
  const aDropInTheOceanPromoList = PromoListFactory.fromSeries(aDropInTheOceanSeries);

  ctx.render('pages/explore', {
    pageConfig: createPageConfig({
      title: 'Explore',
      inSection: 'explore'
    }),
    aDropInTheOcean: aDropInTheOceanPromoList,
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

