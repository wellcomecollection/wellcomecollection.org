// TODO: FlowType this module
import type {Series} from '../model/series';
import {createPageConfig, getEditorialAnalyticsInfo} from '../model/page-config';
import {getArticleStubs, getArticle, getSeries} from '../services/wordpress';
import {PromoListFactory} from '../model/promo-list';
import {PaginationFactory} from '../model/pagination';
import {getGlobalAlert} from '../services/prismic';

const maxItemsPerPage = 32;

export const article = async(ctx, next) => {
  const slug = ctx.params.slug;
  const format = ctx.request.query.format;
  const articlePromise = getArticle(`slug:${slug}`);
  const globalAlertPromise = getGlobalAlert();
  const [ article, globalAlert ] = await Promise.all([articlePromise, globalAlertPromise]);
  const path = ctx.request.url;

  if (article) {
    if (format === 'json') {
      ctx.body = article;
    } else {
      const editorialAnalyticsInfo = getEditorialAnalyticsInfo(article);
      const pageConfig = createPageConfig(Object.assign({}, {
        globalAlert: globalAlert,
        path: path,
        title: article.headline,
        inSection: 'explore',
        category: 'editorial'
      }, editorialAnalyticsInfo));

      ctx.render('pages/article', {pageConfig, article});
    }
  }

  return next();
};

export const articles = async(ctx, next) => {
  const path = ctx.request.url;
  const {page, q} = ctx.request.query;
  const articleStubsResponsePromise = getArticleStubs(maxItemsPerPage, {page}, q);
  const globalAlertPromise = getGlobalAlert();
  const [ articleStubsResponse, globalAlert ] = await Promise.all([articleStubsResponsePromise, globalAlertPromise]);
  const series: Series = {
    url: '/articles/archive',
    name: 'Articles',
    items: articleStubsResponse.data,
    total: articleStubsResponse.total
  };
  const promoList = PromoListFactory.fromSeries(series);
  const pagination = PaginationFactory.fromList(promoList.items, promoList.total, parseInt(page, 10) || 1, 32);

  ctx.render('pages/list', {
    pageConfig: createPageConfig({
      globalAlert: globalAlert,
      path: path,
      title: 'Articles',
      inSection: 'explore',
      category: 'editorial'
    }),
    list: promoList,
    pagination
  });
};

export const series = async(ctx, next) => {
  const {id, page} = ctx.params;
  const seriesPromise = getSeries(id, maxItemsPerPage, page);
  const globalAlertPromise = getGlobalAlert();
  const [ series, globalAlert ] = await Promise.all([seriesPromise, globalAlertPromise]);
  const path = ctx.request.url;

  if (series) {
    const promoList = PromoListFactory.fromSeries(series);
    const pagination = PaginationFactory.fromList(promoList.items, promoList.total, parseInt(page, 10) || 1, maxItemsPerPage);

    ctx.render('pages/list', {
      pageConfig: createPageConfig({
        globalAlert: globalAlert,
        path: path,
        title: series.name,
        inSection: 'explore',
        category: 'editorial',
        seriesUrl: id
      }),
      list: promoList,
      pagination
    });
  }

  return next();
};

export const preview = async(ctx, next) => {
  const id = ctx.params.id;
  const format = ctx.request.query.format;
  const authToken = ctx.cookies.get('WC_wpAuthToken');
  const article = await getArticle(id, authToken);
  const path = ctx.request.url;

  if (article) {
    if (format === 'json') {
      ctx.body = article;
    } else {
      ctx.render('pages/article', {
        pageConfig: createPageConfig({
          path: path,
          title: article.headline,
          inSection: 'explore'
        }),
        article: article
      });
    }
  }

  return next();
};
