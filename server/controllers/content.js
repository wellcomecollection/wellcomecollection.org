import Prismic from 'prismic-javascript';
import {OrderedMap} from 'immutable';
import {prismicApi} from '../services/prismic-api';
import {createPageConfig, getEditorialAnalyticsInfo} from '../model/page-config';
import {getEventbriteEventEmbed} from '../services/eventbrite';
import {PromoFactory} from '../model/promo';
import {getArticleStubs} from '../services/wordpress';
import {getCuratedList} from '../services/prismic-curated-lists';
import {collectorsPromo} from '../data/series';
import {prismicAsText} from '../filters/prismic';
import {
  getArticle,
  getArticleList
} from '../services/prismic-content';
import {getEvent} from '../services/events';
import {getExhibition} from '../services/exhibitions';

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
  const event = await getEvent(id);
  const format = ctx.request.query.format;
  const path = ctx.request.url;

  if (event) {
    if (format === 'json') {
      ctx.body = event;
    } else {
      ctx.render('pages/event', {
        pageConfig: createPageConfig({
          path: path,
          title: event.title,
          inSection: 'whatson',
          category: 'publicprograms',
          contentType: 'event',
          canonicalUri: `${ctx.globals.rootDomain}/events/${event.id}`
        }),
        event: event
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

  const listRequests = [getCuratedList('explore'), getArticleStubs(10), contentListPromise];
  const [curatedList, articleStubs, contentList] = await Promise.all(listRequests);

  const wpPromos = articleStubs.data.map(PromoFactory.fromArticleStub);
  const contentPromos = contentList.map(PromoFactory.fromArticleStub);
  const promos = wpPromos.concat(contentPromos).sort((a, b) => {
    return a.datePublished.getTime() - b.datePublished.getTime();
  }).reverse();

  const dedupedPromos = promos.reduce((promoMap, promo) => {
    if (promo.url.match(/articles\/W|webcomics\//) || !promoMap.has(promo.title)) {
      return promoMap.set(promo.title, promo);
    } else {
      return promoMap;
    }
  }, OrderedMap()).toList().map((promo, index) => {
    if (index === 0) { // First promo on Explore page is treated differently
      return Object.assign({}, promo, {weight: 'lead'});
    } else {
      return promo;
    }
  });

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
    promos: dedupedPromos,
    curatedList,
    collectorsPromo, // TODO: Remove this, make it automatic
    latestTweets
  });

  return next();
}
