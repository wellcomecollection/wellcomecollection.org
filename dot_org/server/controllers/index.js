// TODO: FlowType this module
import type {Series} from '../model/series';
import {createPageConfig, getEditorialAnalyticsInfo} from '../model/page-config';
import {getArticleStubs, getArticle, getSeries} from '../services/wordpress';
import {PromoListFactory} from '../model/promo-list';
import {PaginationFactory} from '../model/pagination';

const maxItemsPerPage = 32;

export const article = async(ctx, next) => {
  const slug = ctx.params.slug;
  const format = ctx.request.query.format;
  const article = await getArticle(`slug:${slug}`);
  const path = ctx.request.url;

  if (article) {
    if (format === 'json') {
      ctx.body = article;
    } else {
      const editorialAnalyticsInfo = getEditorialAnalyticsInfo(article);
      const pageConfig = createPageConfig(Object.assign({}, {
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
  const articleStubsResponse = await getArticleStubs(maxItemsPerPage, {page}, q);
  const series: Series = {
    url: '/articles',
    name: 'Articles',
    items: articleStubsResponse.data,
    total: articleStubsResponse.total
  };
  const promoList = PromoListFactory.fromSeries(series);
  const pagination = PaginationFactory.fromList(promoList.items, promoList.total, parseInt(page, 10) || 1, 32, { format: 'archive' });

  ctx.render('pages/list', {
    pageConfig: createPageConfig({
      path: path,
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
  const path = ctx.request.url;

  if (series) {
    const promoList = PromoListFactory.fromSeries(series);
    const pagination = PaginationFactory.fromList(promoList.items, promoList.total, parseInt(page, 10) || 1, maxItemsPerPage);

    ctx.render('pages/list', {
      pageConfig: createPageConfig({
        path: path,
        title: series.name,
        inSection: 'explore',
        category: 'list',
        seriesUrl: id
      }),
      list: promoList,
      pagination
    });
  }

  return next();
};

export const index = (ctx, next) => ctx.render('pages/index', {
  pageConfig: createPageConfig({inSection: 'index', path: '/'})
}) && next();

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
