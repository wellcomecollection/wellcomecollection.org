import {model, prismic} from 'common';
const {createPageConfig} = model;
const {getPaginatedEventPromos, getEventSeries, getEvent} = prismic;

export async function renderEvent(ctx, next) {
  const id = `${ctx.params.id}`;
  const format = ctx.request.query.format;
  const event = await getEvent(ctx.request, id);
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

      const eventbriteIdScheme = event.identifiers.find(id => id.identifierScheme === 'eventbrite-id');
      const eventbriteId = eventbriteIdScheme && eventbriteIdScheme.value;
      const eventInfo = { eventbriteId };

      ctx.render('pages/event', {
        pageConfig: createPageConfig({
          path: path,
          title: event.title,
          inSection: 'whatson',
          category: 'public-programme',
          contentType: 'event',
          canonicalUri: `${ctx.globals.rootDomain}/events/${event.id}`
        }),
        event: event,
        eventInfo: eventInfo,
        tags: tags
      });
    }
  }

  return next();
}

export async function renderEventSeries(ctx, next) {
  const page = ctx.request.query.page ? Number(ctx.request.query.page) : 1;
  const {id} = ctx.params;
  const paginatedEvents = await getEventSeries(id, { page });
  const series = paginatedEvents.results[0].series.find(series => series.id === id);

  ctx.render('pages/events', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: series.title,
      description: series.description || '',
      inSection: 'whatson',
      category: 'public-programme',
      contentType: 'event-series',
      canonicalUri: `/events-series/${id}`
    }),
    hideArchivedEventsLink: true,
    paginatedEvents
  });

  return next();
}

export async function renderEventsList(ctx, next) {
  const page = ctx.request.query.page ? Number(ctx.request.query.page) : 1;
  const paginatedEvents = await getPaginatedEventPromos(page);

  ctx.render('pages/events', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'Events',
      description: 'Choose from an inspiring range of free talks, tours, discussions and more, all designed to challenge how we think and feel about health.',
      inSection: 'whatson',
      category: 'public-programme',
      contentType: 'event', // TODO: add pageType (list)
      canonicalUri: '/events'
    }),
    paginatedEvents
  });

  return next();
}
