import {model, prismic} from 'common';
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

      const eventbriteIdScheme = event.identifiers.find(id => id.identifierScheme === 'eventbrite-id');
      const eventbriteId = eventbriteIdScheme && eventbriteIdScheme.value;
      const isCompletelySoldOut = event.times.filter(time => !time.isFullyBooked).length === 0;
      const eventInfo = { eventbriteId, isCompletelySoldOut };

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
        tags: {tags}
      });
    }
  }

  return next();
}

export async function renderEventSeries(ctx, next) {
  const page = ctx.request.query.page ? Number(ctx.request.query.page) : 1;
  const {id} = ctx.params;
  const events = await getEventsInSeries(id, { page });
  const promos = createEventPromos(events.results).reverse();
  const paginatedResults = convertPrismicResultsToPaginatedResults(promos);
  const paginatedEvents = paginatedResults(promos);
  const series = paginatedEvents.results[0].series.find(series => series.id === id);
  const withFilteredPromos = Object.assign({}, paginatedEvents, {results: promos.filter(e => london(e.end).isAfter(london()))});
  // TODO pagination will be out of sync with Prismic, since we're removing items after the request.
  // If we use dateAfter to query prismic, this would fix it, but we may end up with no results and hence no way of getting the series data to display.
  // The other alternative is to make two API calls, but since this will only be an issue if there are more
  // than 40 events, which is unlikely, I've left as is.

  ctx.render('pages/events', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: series.title,
      description: asText(series.description),
      inSection: 'whatson',
      category: 'public-programme',
      contentType: 'event-series',
      canonicalUri: `/events-series/${id}`
    }),
    htmlDescription: asHtml(series.description),
    hideArchivedEventsLink: true,
    paginatedEvents: withFilteredPromos
  });

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
