import Prismic from 'prismic-javascript';
import {List} from 'immutable';
import {prismicApi} from '../services/prismic-api';
import {createPageConfig, getEditorialAnalyticsInfo} from '../model/page-config';
import {getEventbriteEventEmbed} from '../services/eventbrite';
import {PromoFactory} from '../model/promo';
import {prismicAsText} from '../filters/prismic';
import {
  getArticle, getSeriesAndArticles, getArticleList, getCuratedList,
  defaultPageSize, getExhibitionAndEventPromos
} from '../services/prismic';
import {london} from '../filters/format-date';
import {PromoListFactory} from '../model/promo-list';
import {PaginationFactory} from '../model/pagination';
import {getPage, getPageFromDrupalPath} from '../../common/services/prismic/pages';
import {getBook} from '../../common/services/prismic/books';
import {search} from '../../common/services/prismic/search';
import {getCollectionOpeningTimes} from '../../common/services/prismic/opening-times';
import {isPreview as getIsPreview} from '../../common/services/prismic/api';

import {dailyTourPromo} from '../../server/data/facility-promos';

export const renderOpeningTimes = async(ctx, next) => {
  const path = ctx.request.url;

  // TODO: (Prismic perf) don't fetch these as two separate calls
  const [pageOpeningHours, page] = await Promise.all([
    getCollectionOpeningTimes(ctx.request),
    getPage(ctx.request, 'WwQHTSAAANBfDYXU')
  ]);
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
      title: page.title,
      category: 'information',
      canonicalUri: `${ctx.globals.rootDomain}/opening-times`
    })),
    page: page || {}, // overly cautious, but we getPage does return ?Page.
    pageOpeningHours: Object.assign({}, pageOpeningHours, {groupedVenues})
  });

  return next();
};

export async function renderHomepage(ctx, next) {
  const path = ctx.request.url;
  const todaysDate = london();
  const todaysDatePlusSix = todaysDate.clone().add(6, 'days');
  const exhibitionAndEventPromos = await getExhibitionAndEventPromos({startDate: todaysDate.format('YYYY-MM-DD'), endDate: todaysDatePlusSix.format('YYYY-MM-DD')}, ctx.intervalCache.get('collectionOpeningTimes'));
  const contentList = await getArticleList();
  const storiesPromos = contentList.results.map(PromoFactory.fromArticleStub).slice(0, 4);

  ctx.render('pages/homepage', {
    pageConfig: createPageConfig({
      path: path,
      title: null,
      inSection: 'index',
      canonicalUri: `${ctx.globals.rootDomain}`
    }),
    exhibitionAndEventPromos,
    storiesPromos,
    dailyTourPromo
  });

  return next();
}

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
        case 'books' : return `/books/${doc.id}`;
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
    articles: contentList.results,
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
        inSection: page.siteSection,
        category: 'info'
      }),
      page: page,
      isPreview: getIsPreview(ctx.request)
    });
  }

  return next();
}

export async function renderBooks(ctx, next) {
  const content = await search(ctx.request, 'type:books orderings:"my.books.datePublished desc"');
  const promoList = content.results.map(content => {
    return content.promo && {
      url: `/books/${content.id}`,
      contentType: 'Books',
      image: content.promo.image,
      title: content.title,
      description: content.promo.caption
    };
  }).filter(Boolean);

  ctx.render('pages/list', {
    pageConfig: createPageConfig({
      path: `/books`,
      title: 'Our books',
      inSection: 'what-we-do'
    }),
    list: {
      name: 'Books',
      description: 'Wellcome Collection publishes books that relate to our exhibitions, collections and areas of interest.',
      items: List(promoList)
    },
    pagination: null,
    moreLink: null
  });
};

export async function renderSearch(ctx, next) {
  const {query} = ctx.request.query;

  const content = await search(ctx.request, query);
  const promoList = content.results.map(content => {
    return content.promo && {
      url: `/events/${content.id}`,
      contentType: 'Event',
      image: content.promo.image,
      title: content.title,
      description: content.promo.caption
    };
  }).filter(Boolean);

  ctx.render('pages/list', {
    pageConfig: createPageConfig({
      path: `/search?query=${query}`,
      title: 'Search',
      inSection: 'search'
    }),
    list: {
      name: 'Search results',
      description: 'Search for events, exhibitions, books and more from Wellcome Collection',
      items: List(promoList)
    },
    pagination: null,
    moreLink: null
  });
};

export async function renderBook(ctx, next) {
  const {id} = ctx.params;
  const book = await getBook(ctx.request, id);

  if (book) {
    ctx.render('pages/book', {
      pageConfig: createPageConfig({
        path: ctx.request.url,
        title: book.title,
        inSection: 'what-we-do',
        category: 'info'
      }),
      book: book,
      isPreview: getIsPreview(ctx.request)
    });
  }

  return next();
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
