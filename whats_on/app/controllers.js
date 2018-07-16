import React from 'react';
import ReactDOMServer from 'react-dom/server';
import searchQuery from 'search-query-parser';
import {getInstallation} from '@weco/common/services/prismic/installations';
import {
  getExhibitions,
  getExhibition,
  getExhibitionExhibits,
  getExhibitExhibition
} from '@weco/common/services/prismic/exhibitions';
import { getEvent, getEventSeries } from '@weco/common/services/prismic/events';
import {getEventbriteEventEmbed} from '@weco/common/services/eventbrite/event-embed';
import {isPreview as isPrismicPreview} from '@weco/common/services/prismic/api';
import {model, prismic} from 'common';
import Tags from '@weco/common/views/components/Tags/Tags';

import {
  shopPromo,
  cafePromo,
  readingRoomPromo,
  restaurantPromo,
  dailyTourPromo
} from '../../server/data/facility-promos';

const {createPageConfig} = model;
const {
  getExhibitionAndEventPromos
} = prismic;

export async function renderWhatsOn(ctx, next) {
  const exhibitionAndEventPromos = await getExhibitionAndEventPromos(ctx.query, ctx.intervalCache.get('collectionOpeningTimes'));

  ctx.render('pages/whats-on', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'What\'s on',
      inSection: 'whatson',
      category: 'public-programme',
      contentType: 'list',
      canonicalUri: '/whats-on',
      pageState: {
        dateRangeName: exhibitionAndEventPromos.active
      }
    }),
    exhibitionAndEventPromos,
    tryTheseTooPromos: [readingRoomPromo],
    eatShopPromos: [cafePromo, shopPromo, restaurantPromo],
    cafePromo,
    shopPromo,
    dailyTourPromo
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
  const paginatedResults = await getExhibitions(ctx.request, ctx.params.id);
  if (paginatedResults) {
    ctx.render('pages/exhibitions', {
      pageConfig: createPageConfig({
        path: '/exhibitions',
        title: 'Exhibitions',
        inSection: 'whatson',
        category: 'public-programme',
        contentType: 'listing',
        canonicalUri: 'https://wellcomecollection.org/exhibitions'
      }),
      paginatedResults
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

export async function renderEvent(ctx, next) {
  const event = await getEvent(ctx.request, {
    id: ctx.params.id,
    selectedDate: ctx.query.selectedDate
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
