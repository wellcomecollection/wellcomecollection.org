import Prismic from 'prismic-javascript';
import {List} from 'immutable';
import {prismicApi} from '../services/prismic-api';
import {createPageConfig, getEditorialAnalyticsInfo} from '../model/page-config';
import {getEventbriteEventEmbed} from '../services/eventbrite';
import {PromoFactory} from '../model/promo';
import {getCuratedList} from '../services/prismic-curated-lists';
import {collectorsPromo} from '../data/series';
import {prismicAsText} from '../filters/prismic';
import {
  getArticle,
  getArticleList,
  getSeriesArticles
} from '../services/prismic-content';
import {getEvent} from '../services/events';
import {getExhibition} from '../services/exhibitions';
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
      ctx.render('pages/article', {
        pageConfig: Object.assign({}, createPageConfig({
          path: path,
          title: article.headline,
          inSection: 'explore',
          category: 'editorial',
          canonicalUri: `${ctx.globals.rootDomain}/articles/${id}`
        }), getEditorialAnalyticsInfo(article)),
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

export async function renderEvent(ctx, next) {
  const id = `${ctx.params.id}`;
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
        text: 'Event',
        url: 'https://wellcomecollection.org/whats-on/events/all-events'
      }].concat(event.format ? [{
        text: event.format.title
        // TODO: link through to others of this type?
      }] : []);
      ctx.render('pages/event', {
        pageConfig: createPageConfig({
          path: path,
          title: event.title,
          inSection: 'whatson',
          category: 'publicprograms',
          contentType: 'event',
          canonicalUri: `${ctx.globals.rootDomain}/events/${event.id}`
        }),
        event: event,
        tags: tags
      });
    }
  }
}

export async function renderExhibition(ctx, next, overrideId, gaExp) {
  const id = overrideId || `${ctx.params.id}`;
  const isPreview = Boolean(ctx.params.preview);
  const exhibitionContent = await getExhibition(id, isPreview ? ctx.request : null);
  const format = ctx.request.query.format;
  const path = ctx.request.url;

  if (exhibitionContent) {
    if (format === 'json') {
      ctx.body = exhibitionContent;
    } else {
      ctx.render('pages/exhibition', {
        pageConfig: createPageConfig({
          path: path,
          title: exhibitionContent.exhibition.title,
          inSection: 'whatson',
          category: 'publicprograms',
          contentType: 'exhibitions',
          canonicalUri: `${ctx.globals.rootDomain}/exhibitions/${exhibitionContent.exhibition.id}`,
          gaExp
        }),
        exhibitionContent: exhibitionContent,
        isPreview: isPreview
      });
    }
  }
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
  const {id, page} = ctx.params;

  const seriesArticles = await getSeriesArticles(`W${id}`);

  if (seriesArticles) {
    const {series, paginatedResults} = seriesArticles;
    const pageSeries: Series = {
      url: `/series/${series.id}`,
      name: series.name,
      description: series.description,
      items: List(paginatedResults.results),
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
  const {page} = ctx.request.query;
  const articlesList = await getArticleList(['articles', 'webcomics'], 96, page);
  const contentPromos = List(articlesList.results);

  const series: Series = {
    url: '/articles',
    name: 'Articles',
    items: contentPromos,
    total: articlesList.totalResults
  };
  const promoList = PromoListFactory.fromSeries(series);
  const pagination = PaginationFactory.fromList(promoList.items, promoList.total, parseInt(page, 10) || 1);
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
