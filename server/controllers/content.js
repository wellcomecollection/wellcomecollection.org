import Prismic from 'prismic-javascript';
import {List} from 'immutable';
import {prismicApi} from '../services/prismic-api';
import {createPageConfig, getEditorialAnalyticsInfo} from '../model/page-config';
import {getEventbriteEventEmbed} from '../services/eventbrite';
import {PromoFactory} from '../model/promo';
import {prismicAsText} from '../filters/prismic';
import {
  getArticle, getSeriesAndArticles, getArticleList, getCuratedList,
  defaultPageSize
} from '../services/prismic';
import {PromoListFactory} from '../model/promo-list';
import {PaginationFactory} from '../model/pagination';
import {getPage, getPageFromDrupalPath} from '../../common/services/prismic/pages';
import {getMultiContent} from '../../common/services/prismic/multi-content';
import {getCollectionOpeningTimes} from '../../common/services/prismic/opening-times';
import {isPreview as getIsPreview} from '../../common/services/prismic/api';

export const renderOpeningTimes = async(ctx, next) => {
  const path = ctx.request.url;
  const pageOpeningHours = await getCollectionOpeningTimes();
  const galleriesLibrary = pageOpeningHours && pageOpeningHours.placesOpeningHours && pageOpeningHours.placesOpeningHours.filter(venue => {
    return venue.name.toLowerCase() === 'galleries' || venue.name.toLowerCase() === 'library';
  });
  const restaurantCafeShop = pageOpeningHours && pageOpeningHours.placesOpeningHours && pageOpeningHours.placesOpeningHours.filter(venue => {
    return venue.name.toLowerCase() === 'restaurant' || venue.name.toLowerCase() === 'café' || venue.name.toLowerCase() === 'shop';
  });
  const groupedVenues = {
    galleriesLibrary: {
      title: 'Venue',
      hours: galleriesLibrary
    },
    restaurantCafeShop: {
      title: 'Eat & Shop',
      hours: restaurantCafeShop
    }
  };

  ctx.render('pages/opening-times', {
    pageConfig: Object.assign({}, createPageConfig({
      path: path,
      title: 'Opening Times',
      category: 'information',
      canonicalUri: `${ctx.globals.rootDomain}/info/opening-times`
    })),
    pageOpeningHours: Object.assign({}, pageOpeningHours, {groupedVenues})
  });

  return next();
};

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
      const tags = article.contentType === 'comic' ? article.series.map(series => ({
        url: `/webcomic-series/${series.id}`,
        text: `Part of ${series.name}`
      })) : [];
      const trackingInfo = getEditorialAnalyticsInfo(article);
      ctx.render(`pages/article`, {
        pageConfig: Object.assign({}, createPageConfig({
          path: path,
          title: article.headline,
          inSection: 'explore',
          category: 'editorial',
          canonicalUri: `${ctx.globals.rootDomain}/articles/${id}`
        }), trackingInfo),
        article: article,
        page: article,
        isPreview: isPreview,
        tags
      });
    }
  }
};

export async function setPreviewSession(ctx, next) {
  const {token} = ctx.request.query;
  ctx.cookies.set(Prismic.previewCookie, token, {
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
    httpOnly: false
  });

  const redirectUrl = await getPreviewSession(token);

  ctx.response.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  ctx.set('Pragma', 'no-cache');
  ctx.response.redirect(redirectUrl);
}

async function getPreviewSession(token) {
  const prismic = await prismicApi();

  return new Promise((resolve, reject) => {
    prismic.previewSession(token, (doc) => {
      switch (doc.type) {
        case 'articles'    : return `/preview/articles/${doc.id}`;
        case 'webcomics'   : return `/preview/articles/${doc.id}`;
        case 'exhibitions' : return `/exhibitions/${doc.id}`;
        case 'events' : return `/events/${doc.id}/preview`;
        // We don't use a `/preview` prefix here.
        // It's just a way for editors to get to the content via Prismic
        case 'series' : return `/series/${doc.id}`;
        case 'webcomic-series' : return `/webcomic-series/${doc.id}`;
        case 'event-series' : return `/event-series/${doc.id}`;
        case 'installations' : return `/installations/${doc.id}`;
        case 'pages' : return `/pages/${doc.id}`;
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

export const renderEventbriteEmbed = async(ctx, next) => {
  const {id} = ctx.params;
  const eventEmbedHtml = await getEventbriteEventEmbed(id);
  ctx.body = eventEmbedHtml;

  return next();
};

export async function renderExplore(ctx, next) {
  // TODO: Remove WP content
  const contentListPromise = getArticleList(1, {pageSize: 11});
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

  const path = ctx.request.url;

  ctx.render('pages/curated-lists', {
    pageConfig: createPageConfig({
      path: path,
      title: prismicAsText(curatedList.data.title),
      inSection: 'explore',
      category: 'editorial',
      canonicalUri: `${ctx.globals.rootDomain}/explore`
    }),
    promos: promos,
    curatedList
  });

  return next();
}

export async function renderWebcomicSeries(ctx, next) {
  const page = Number(ctx.request.query.page);
  const pageSize = defaultPageSize;
  const {id} = ctx.params;
  const seriesWebcomics = await getSeriesAndArticles(id, page, 'webcomics');

  if (seriesWebcomics) {
    const {series, paginatedResults} = seriesWebcomics;
    const pageSeries: Series = {
      url: `/webcomic-series/${series.id}`,
      name: series.name,
      description: series.description,
      items: List(paginatedResults.results),
      total: paginatedResults.totalResults
    };

    const promoList = PromoListFactory.fromSeries(pageSeries);
    const pagination = PaginationFactory.fromList(promoList.items, promoList.total, parseInt(page, 10) || 1, pageSize);
    const path = ctx.request.url;

    ctx.render('pages/list', {
      pageConfig: createPageConfig({
        path: path,
        title: series.name,
        inSection: 'explore',
        category: 'editorial'
      }),
      description: series.description,
      list: promoList,
      pagination
    });

    return next();
  }
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
        title: series.name,
        inSection: 'explore',
        category: 'editorial'
      }),
      description: series.description,
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
  const moreLink = articlesList.totalPages === 1 || articlesList.currentPage === articlesList.totalPages ? '/articles/archive' : null;

  ctx.render('pages/list', {
    pageConfig: createPageConfig({
      path: path,
      title: 'Articles',
      inSection: 'explore',
      category: 'editorial'
    }),
    list: promoList,
    pagination,
    moreLink
  });

  return next();
}

export async function renderPage(ctx, next) {
  const {id} = ctx.params;
  const page = await getPage(ctx.request, id);

  if (page) {
    ctx.render('pages/page', {
      pageConfig: createPageConfig({
        path: ctx.request.url,
        title: page.title,
        inSection: 'what-we-do',
        category: 'info'
      }),
      page: page,
      isPreview: getIsPreview(ctx.request)
    });
  }

  return next();
}

export function renderTagPage(tag, url, title, inSection, description) {
  return async (ctx, next) => {
    const content = await getMultiContent(ctx.request, {tags: [tag]});
    const promoList = content.results.map(content => {
      return {
        url: `/pages/${content.id}`,
        contentType: 'Information',
        image: content.promo.image,
        title: content.title,
        description: content.promo.caption
      };
    });

    ctx.render('pages/list', {
      pageConfig: createPageConfig({
        path: url,
        title: title,
        inSection: inSection
      }),
      list: {
        name: title,
        description: description,
        items: List(promoList)
      },
      pagination: null,
      moreLink: null
    });
  };
}

export function renderNewsletterPage(ctx, next) {
  const { result } = ctx.query;

  ctx.render('pages/newsletter', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'Newsletter',
      category: 'info'
    }),
    isSuccess: result === 'success',
    isError: result === 'error',
    isConfirmed: result === 'confirmed'
  });

  return next();
}

export async function searchForDrupalRedirect(ctx, next) {
  const {path} = ctx.params;
  const page = await getPageFromDrupalPath(ctx.request, `/${path}`);

  if (page) {
    ctx.status = 301;
    ctx.redirect(`/pages/${page.id}`);
  }

  return next();
}
