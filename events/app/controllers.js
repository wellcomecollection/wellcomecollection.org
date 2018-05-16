import {model, prismic} from 'common';
import {getUiEventSeries} from '@weco/common/services/prismic/events';
const {createPageConfig} = model;
const {getPaginatedEventPromos, getEventsInSeries, asText, asHtml, createEventPromos, convertPrismicResultsToPaginatedResults, london} = prismic;

export async function renderEvent(ctx, next) {
  const id = `${ctx.params.id}`;
  const format = ctx.request.query.format;
  const isPreview = Boolean(ctx.params.preview);
  const event = await prismic.getEvent(id, isPreview ? ctx.request : null);
  const path = ctx.request.url;

  if (event) {
    if (format === 'json') {
      ctx.body = event;
    } else {
      // TODO: add the `Part of:` tag, we don't have a way of doing this in the model
      const tags = [{
        text: 'Events',
        url: '/events'
      }].concat(event.series.map(series => ({
        text: 'Part of ' + series.title,
        url: `/event-series/${series.id}`
      })));

      ctx.render('pages/event', {
        pageConfig: createPageConfig({
          path: path,
          title: event.title,
          inSection: 'whatson',
          category: 'public-programme',
          contentType: 'event',
          seriesUrl: event.series.map(series => `${series.title}:${series.id}`).join(','),
          canonicalUri: `${ctx.globals.rootDomain}/events/${event.id}`,
          pageState: {hasSchedule: Boolean(event.schedule.length > 0)}
        }),
        event: event,
        tags: {tags},
        isPreview
      });
    }
  }

  return next();
}

export async function renderEventSeries(ctx, next) {
  const page = ctx.request.query.page ? Number(ctx.request.query.page) : 1;
  const {id} = ctx.params;
  const eventsPromise = getEventsInSeries(id, { page });
  const uiEventSeriesPromise = getUiEventSeries(ctx.request, id);
  const [ events, uiEventSeries ] = await Promise.all([eventsPromise, uiEventSeriesPromise]);

  if (events.results.length > 0) {
    const promos = createEventPromos(events.results).reverse();
    const paginatedResults = convertPrismicResultsToPaginatedResults(promos);
    const paginatedEvents = paginatedResults(promos);
    const upcomingEvents = Object.assign({}, paginatedEvents, {results: promos.filter(e => london(e.end).isAfter(london()))});
    const pastEvents = {results: promos.filter(e => london(e.end).isBefore(london())).slice(0, 3).reverse()};

    ctx.render('pages/event-series', {
      pageConfig: createPageConfig({
        path: ctx.request.url,
        title: uiEventSeries.title,
        description: asText(uiEventSeries.description),
        inSection: 'whatson',
        category: 'public-programme',
        contentType: 'event-series',
        canonicalUri: `/event-series/${id}`
      }),
      htmlDescription: asHtml(uiEventSeries.description),
      paginatedEvents: upcomingEvents,
      pastEvents: pastEvents,
      backgroundTexture: uiEventSeries.backgroundTexture
    });
  }

  return next();
}

export async function renderEventsList(ctx, next) {
  const page = ctx.request.query.page ? Number(ctx.request.query.page) : 1;
  const paginatedEvents = await getPaginatedEventPromos(page);
  const description = 'Choose from an inspiring range of free talks, tours, discussions and more, all designed to challenge how we think and feel about health.';

  ctx.render('pages/events', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'Events',
      description: description,
      inSection: 'whatson',
      category: 'public-programme',
      contentType: 'event', // TODO: add pageType (list)
      canonicalUri: '/events'
    }),
    htmlDescription: `<p>${description}</p>`,
    paginatedEvents
  });

  return next();
}
