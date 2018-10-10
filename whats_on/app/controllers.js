import React from 'react';
import ReactDOMServer from 'react-dom/server';
import searchQuery from 'search-query-parser';
import Prismic from 'prismic-javascript';
import {getInstallation} from '@weco/common/services/prismic/installations';
import {
  getExhibitions,
  getExhibition,
  getExhibitionExhibits,
  getExhibitExhibition
} from '@weco/common/services/prismic/exhibitions';
import {
  getEvents,
  getEvent
} from '@weco/common/services/prismic/events';
import {getEventSeries} from '@weco/common/services/prismic/event-series';
import {getEventbriteEventEmbed} from '@weco/common/services/eventbrite/event-embed';
import {isPreview as isPrismicPreview} from '@weco/common/services/prismic/api';
import {model} from 'common';
import Tags from '@weco/common/views/components/Tags/Tags';
import {
  shopPromo,
  cafePromo,
  readingRoomPromo,
  restaurantPromo,
  dailyTourPromo
} from '../../server/data/facility-promos';
import pharmacyOfColourData from '@weco/common/data/the-pharmacy-of-colour';
import Breadcrumb from '@weco/common/views/components/Breadcrumb/Breadcrumb';
import { getListHeader, getMomentsForPeriod } from './utils';
const {createPageConfig} = model;

export async function renderWhatsOn(ctx, next) {
  const period = ctx.params.period || 'current-and-coming-up';
  const exhibitionsPromise = getExhibitions(ctx.request, {
    period,
    order: 'asc'
  });
  const eventsPromise = getEvents(ctx.request, {
    period,
    order: 'asc'
  });

  const [exhibitions, events] = await Promise.all([
    exhibitionsPromise, eventsPromise
  ]);
  const dateRange = getMomentsForPeriod(period);

  ctx.render('pages/whats-on', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'What\'s on',
      inSection: 'whatson',
      category: 'public-programme',
      contentType: 'list',
      canonicalUri: '/whats-on',
      pageState: {
        dateRangeName: period
      }
    }),
    events,
    exhibitions,
    pharmacyOfColourData,
    dateRange,
    listHeader: getListHeader(ctx.intervalCache.get('collectionOpeningTimes')),
    tryTheseTooPromos: [readingRoomPromo],
    eatShopPromos: [cafePromo, shopPromo, restaurantPromo],
    cafePromo,
    shopPromo,
    dailyTourPromo,
    period: period
  });

  return next();
}

export async function renderInstallation(ctx, next) {
  const installation = await getInstallation(ctx.request, ctx.params.id);
  const tags = [{
    text: 'Installations',
    url: '/installations'
  }];
  const isPreview = isPrismicPreview(ctx.request);

  if (installation) {
    ctx.render('pages/installation', {
      pageConfig: createPageConfig({
        path: ctx.request.url,
        title: installation.title,
        inSection: 'whatson',
        category: 'public-programme',
        contentType: 'installations',
        canonicalUri: `https://wellcomecollection.org/installation/${installation.id}`
      }),
      installation,
      tags,
      isPreview
    });
  }
}

export async function renderExhibitions(ctx, next) {
  const {period} = ctx.params;
  const {page = 1} = ctx.query;
  const paginatedResults = await getExhibitions(ctx.request, {
    order: 'desc',
    period,
    page
  });
  if (paginatedResults) {
    ctx.render('pages/exhibitions', {
      pageConfig: createPageConfig({
        path: '/exhibitions',
        // TODO: it might be better to add this as a value on the enum, but bah.
        title: `${period === 'past' ? 'Past e' : 'E'}xhibitions`,
        inSection: 'whatson',
        category: 'public-programme',
        contentType: 'listing',
        canonicalUri: 'https://wellcomecollection.org/exhibitions'
      }),
      paginatedResults,
      period
    });
  }
}

export async function renderExhibition(ctx, next) {
  const exhibition = await getExhibition(ctx.request, ctx.params.id);
  const tags = [{
    text: 'Exhibitions',
    url: '/exhibitions'
  }];
  const isPreview = isPrismicPreview(ctx.request);

  if (exhibition) {
    ctx.render('pages/exhibition', {
      pageConfig: createPageConfig({
        path: ctx.request.url,
        title: exhibition.title,
        inSection: 'whatson',
        category: 'public-programme',
        contentType: 'exhibitions',
        canonicalUri: `https://wellcomecollection.org/exhibitions/${exhibition.id}`
      }),
      exhibition,
      exhibitIds: exhibition.exhibits.map(exhibit => exhibit.item.id),
      tags,
      isPreview
    });
  }
}

export async function renderExhibits(ctx, next) {
  const query = searchQuery.parse(ctx.query.query, { keywords: ['ids'] });
  if (!query.ids) return;
  // searchQueryParser automatically changes comma seperated lists into arrays
  const ids = typeof query.ids === 'string' ? query.ids.split(',') : query.ids;
  const exhibits = await getExhibitionExhibits(ctx.request, {ids});

  ctx.render('components/exhibits/exhibits', {
    exhibits: exhibits.results
  });

  ctx.body = {
    html: ctx.body
  };
}

export async function renderExhibitExhibitionLink(ctx, next) {
  const {id} = ctx.params;
  const exhibition = await getExhibitExhibition(ctx.request, id);

  const tags = exhibition ? [{
    text: 'Installations'
  }, {
    text: `Part of ${exhibition.title}`,
    url: `/exhibitions/${exhibition.id}`
  }] : [{
    text: 'Installations'
  }];

  ctx.body = {
    html: ReactDOMServer.renderToString(
      React.createElement(Tags, { tags })
    )
  };
}

export async function renderEvents(ctx, next) {
  const {page = 1} = ctx.query;
  const {period} = ctx.params;
  const paginatedResults = await getEvents(ctx.request, {
    page,
    seriesId: null,
    period
  });
  if (paginatedResults) {
    ctx.render('pages/events', {
      pageConfig: createPageConfig({
        path: '/events',
        title: `${period === 'past' ? 'Past e' : 'E'}vents`,
        inSection: 'whatson',
        category: 'public-programme',
        contentType: 'listing',
        canonicalUri: 'https://wellcomecollection.org/events'
      }),
      paginatedResults
    });
  }
}

export async function renderEvent(ctx, next) {
  const event = await getEvent(ctx.request, {
    id: ctx.params.id
  });
  const tags = [{
    text: 'Events',
    url: '/events'
  }];
  const isPreview = isPrismicPreview(ctx.request);

  if (event) {
    ctx.render('pages/event', {
      pageConfig: createPageConfig({
        path: ctx.request.url,
        title: event.title,
        inSection: 'whatson',
        category: 'public-programme',
        contentType: 'events',
        canonicalUri: `https://wellcomecollection.org/events/${event.id}`
      }),
      event,
      tags,
      isPreview
    });
  }
}
export async function renderEventsScheduledInBreadcrumb(ctx, next) {
  const {id} = ctx.params;
  const eventsScheduledIn = await getEvents(ctx.req, {
    predicates: [
      Prismic.Predicates.at('my.events.schedule.event', id)
    ]
  });

  if (eventsScheduledIn.results.length > 0) {
    const scheduledInbreadcrumbs = eventsScheduledIn.results.map(event => ({
      prefix: 'Part of',
      text: event.title,
      url: `/events/${event.id}`
    }));
    // TODO: We don't cater forevent series here... hmmmm
    ctx.body = {
      html: ReactDOMServer.renderToString(
        React.createElement(Breadcrumb, { items: [
          {
            url: '/events',
            text: 'Events'
          },
          ...scheduledInbreadcrumbs
        ]})
      )
    };
  }

  return next();
}

export const renderEventbriteEmbed = async(ctx, next) => {
  const {id} = ctx.params;
  const eventEmbedHtml = await getEventbriteEventEmbed(id);
  ctx.body = eventEmbedHtml;

  return next();
};

export const renderEventSeries = async(ctx, next) => {
  const {id} = ctx.params;
  const isPreview = isPrismicPreview(ctx.request);
  const eventSeries = await getEventSeries(ctx.request, { id });

  if (eventSeries) {
    ctx.render('pages/event-series', {
      pageConfig: createPageConfig({
        path: ctx.request.url,
        title: eventSeries.series.title,
        inSection: 'whatson',
        category: 'public-programme',
        canonicalUri: `https://wellcomecollection.org/event-series/${id}`
      }),
      events: eventSeries.events,
      series: eventSeries.series,
      isPreview
    });
  }
};
