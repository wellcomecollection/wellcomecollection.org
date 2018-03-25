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
import {placesOpeningHours} from '../model/opening-hours';
import {isDatePast} from '../filters/format-date';
import groupBy from 'lodash.groupby';
import moment from 'moment';

function london(d) {
  // $FlowFixMe
  return moment.tz(d, 'Europe/London');
};

// TODO fix moment warning

function returnExceptionalOpeningDates(placesHoursArray) {
  return [].concat.apply([], placesHoursArray.map(place => {
    return place.openingHours.exceptional &&
      place.openingHours.exceptional.map(exceptionalDate => exceptionalDate.overrideDate);
  }).filter(_ => _))
    .sort((a, b) => Number(a) - Number(b))
    .filter((item, i, array) => {
      const firstDate = item;
      const prevDate = array[i - 1];
      if (!i) {
        return true;
      } else if (firstDate instanceof Date && prevDate instanceof Date) {
        return firstDate.toString() !== prevDate.toString();
      }
    });
};

const exceptionalDates = returnExceptionalOpeningDates(placesOpeningHours);

// TODO use this in OpeningHours, instead of generating it there
export const upcomingExceptionalDates = exceptionalDates.filter(exceptionalDate => !isDatePast(exceptionalDate));

function returnUpcomingExceptionalOpeningHours(upcomingDates) {
  // TODO maybe highlight what is different
  return [].concat.apply([], upcomingDates.reduce((acc, exceptionalDate) => {
    const exceptionalDay = london(exceptionalDate).format('dddd');
    const overrides = placesOpeningHours.map(place => {
      const override = place.openingHours.exceptional &&
      place.openingHours.exceptional.filter(item => item.overrideDate.toString() === exceptionalDate.toString());
      const openingHours = override && override.length > 0 ? override[0] : place.openingHours.regular.find(item => item.dayOfWeek === exceptionalDay);
      return {
        exceptionalDate,
        exceptionalDay,
        id: place.id,
        name: place.name,
        openingHours
      };
    });
    acc.push(overrides);

    return acc;
  }, []));
}

const upcomingExceptionalOpeningHours = returnUpcomingExceptionalOpeningHours(upcomingExceptionalDates);

const exceptionalOpeningHours = groupBy(upcomingExceptionalOpeningHours, item => item.exceptionalDate);

export const renderOpeningTimes = (ctx, next) => { // TODO meta data
  const path = ctx.request.url;
  const trackingInfo = {}; // TODO

  ctx.render('pages/opening-times', {
    pageConfig: Object.assign({}, createPageConfig({
      path: path,
      title: 'Opening Times',
      // inSection: '??', // TODO
      // category: 'public-programme??', // TODO
      canonicalUri: `${ctx.globals.rootDomain}/opening-times`
    }), trackingInfo),
    placesOpeningHours,
    exceptionalOpeningHours
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
      const displayType = article.displayType;
      const trackingInfo = getEditorialAnalyticsInfo(article);
      ctx.render(`pages/${displayType || 'article'}`, {
        pageConfig: Object.assign({}, createPageConfig({
          path: path,
          title: article.headline,
          inSection: 'explore',
          category: 'editorial',
          canonicalUri: `${ctx.globals.rootDomain}/articles/${id}`
        }), trackingInfo),
        article: article,
        page: article,
        isPreview: isPreview
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
        case 'exhibitions' : return `/exhibitions/${doc.id}/preview`;
        case 'events' : return `/events/${doc.id}/preview`;
        // We don't use a `/preview` prefix here.
        // It's just a way for editors to get to the content via Prismic
        case 'series' : return `/series/${doc.id}`;
        case 'webcomic-series' : return `/webcomic-series/${doc.id}`;
        case 'event-series' : return `/event-series/${doc.id}`;
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
