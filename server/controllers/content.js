import Prismic from 'prismic-javascript';
import {List} from 'immutable';
import {prismicApi} from '../services/prismic-api';
import {createPageConfig, getEditorialAnalyticsInfo} from '../model/page-config';
import {getEventbriteEventEmbed} from '../services/eventbrite';
import {PromoFactory} from '../model/promo';
import {collectorsPromo} from '../data/series';
import {prismicAsText} from '../filters/prismic';
import {getArticle, getEvent, getSeriesAndArticles, getArticleList, getCuratedList} from '../services/prismic';
import {PromoListFactory} from '../model/promo-list';
import {PaginationFactory} from '../model/pagination';

export const renderArticle = async(ctx, next) => {
  const format = ctx.request.query.format;
  const path = ctx.request.url;
  // We rehydrate the `W` here as we take it off when we have the route.
  const id = `W${ctx.params.id}`;
  const isPreview = Boolean(ctx.params.preview);
  const article = await getArticle(id, isPreview ? ctx.request : null);

  if (article) {
    if (format === 'json') {
      ctx.body = article;
    } else {
      const trackingInfo = getEditorialAnalyticsInfo(article);
      ctx.render('pages/article', {
        pageConfig: Object.assign({}, createPageConfig({
          path: path,
          title: article.headline,
          inSection: 'explore',
          category: 'editorial',
          canonicalUri: `${ctx.globals.rootDomain}/articles/${id}`
        }), trackingInfo),
        article: article,
        isPreview: isPreview
      });
    }
  }
};

export async function setPreviewSession(ctx, next) {
  const {token} = ctx.request.query;
  ctx.cookies.set(Prismic.previewCookie, token, {
    maxAge: 60 * 30 * 1000,
    path: '/',
    httpOnly: false
  });

  const redirectUrl = await getPreviewSession(token);
  ctx.response.redirect(redirectUrl);
}

async function getPreviewSession(token) {
  const prismic = await prismicApi();

  return new Promise((resolve, reject) => {
    prismic.previewSession(token, (doc) => {
      switch (doc.type) {
        case 'articles'    : return `/preview/articles/${doc.id}`;
        case 'webcomics'   : return `/preview/articles/${doc.id}`;
        case 'exhibitions' : return `/preview/exhibitions/${doc.id}`;
        case 'events' : return `/preview/events/${doc.id}`;
        // We don't use a `/preview` prefix here.
        // It's just a way for editors to get to the content via Prismic
        case 'series' : return `/series/${doc.id}`;
      }
    }, '/', (err, redirectUrl) => {
      if (err) {
        reject(err);
      } else {
        resolve(redirectUrl);
      }
    });
  });
}

export async function renderEvent(ctx, next, overrideId, gaExp) {
  const id = overrideId || `${ctx.params.id}`;
  const format = ctx.request.query.format;
  const isPreview = Boolean(ctx.params.preview);
  const event = await getEvent(id, isPreview ? ctx.request : null);
  const path = ctx.request.url;

  if (event) {
    if (format === 'json') {
      ctx.body = event;
    } else {
      // TODO: add the `Part of:` tag, we don't have a way of doing this in the model
      const tags = [{
        text: 'Events',
        url: 'https://wellcomecollection.org/whats-on/events/all-events'
      }].concat(event.programme ? [{
        text: event.programme.title
        // TODO: link through to others of this type?
      }] : []).concat([{
        text: 'Part of: Can Graphic Design Save Your Life',
        url: '/graphicdesign'
      }]);

      ctx.render('pages/event', {
        pageConfig: createPageConfig({
          path: path,
          title: event.title,
          inSection: 'whatson',
          category: 'publicprograms',
          contentType: 'event',
          canonicalUri: `${ctx.globals.rootDomain}/events/${event.id}`,
          gaExp
        }),
        event: event,
        tags: tags
      });
    }
  }

  return next();
}

export const renderEventbriteEmbed = async(ctx, next) => {
  const {id} = ctx.params;
  const eventEmbedHtml = await getEventbriteEventEmbed(id);
  ctx.body = eventEmbedHtml;

  return next();
};

export async function renderExplore(ctx, next) {
  // TODO: Remove WP content
  const contentListPromise = getArticleList();

  const listRequests = [getCuratedList('explore'), contentListPromise];
  const [curatedList, contentList] = await Promise.all(listRequests);

  const contentPromos = contentList.results.map(PromoFactory.fromArticleStub);
  const promos = List(contentPromos.map((promo, index) => {
    // First promo on Explore page is treated differently
    if (index === 0) {
      return Object.assign({}, promo, {weight: 'lead'});
    } else {
      return promo;
    }
  }));

  // TODO: Remove this, make it automatic
  const latestTweets = ctx.intervalCache.get('tweets');
  const path = ctx.request.url;

  ctx.render('pages/curated-lists', {
    pageConfig: createPageConfig({
      path: path,
      title: prismicAsText(curatedList.data.title),
      inSection: 'explore',
      category: 'list',
      canonicalUri: `${ctx.globals.rootDomain}/explore`
    }),
    promos: promos,
    curatedList,
    collectorsPromo, // TODO: Remove this, make it automatic
    latestTweets
  });

  return next();
}

export async function renderSeries(ctx, next) {
  const page = Number(ctx.request.query.page);
  const {id} = ctx.params;
  const seriesArticles = await getSeriesAndArticles(`W${id}`);

  if (seriesArticles) {
    const {series, paginatedResults} = seriesArticles;
    const pageSeries: Series = {
      url: `/series/${series.id}`,
      name: series.name,
      description: series.description,
      items: List(paginatedResults.results.reverse()),
      total: paginatedResults.totalResults
    };

    const promoList = PromoListFactory.fromSeries(pageSeries);
    const pagination = PaginationFactory.fromList(promoList.items, promoList.total, parseInt(page, 10) || 1);
    const path = ctx.request.url;

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
  }
}

export async function renderArticlesList(ctx, next) {
  // TODO: Remove WP content
  const page = Number(ctx.request.query.page);
  const articlesList = await getArticleList(page, {pageSize: 96});
  const contentPromos = List(articlesList.results);

  const series: Series = {
    url: '/articles',
    name: 'Articles',
    items: contentPromos,
    total: articlesList.totalResults
  };
  const promoList = PromoListFactory.fromSeries(series);
  const pagination = PaginationFactory.fromList(promoList.items, articlesList.totalResults, page || 1, articlesList.pageSize);
  const path = ctx.request.url;
  const moreLink = articlesList.totalPages === 1 || articlesList.currentPage === articlesList.totalPages ? '/articles?format=archive' : null;

  ctx.render('pages/list', {
    pageConfig: createPageConfig({
      path: path,
      title: 'Articles',
      inSection: 'explore',
      category: 'list'
    }),
    list: promoList,
    pagination,
    moreLink
  });

  return next();
}
