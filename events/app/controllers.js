import {model, prismic} from 'common';
const {createPageConfig} = model;
const {getPaginatedEventPromos} = prismic;

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
      }].concat(event.series.map(series => ({ text: 'Part of ' + series.title })));

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

export async function renderEventsList(ctx, next) {
  const page = ctx.request.query.page ? Number(ctx.request.query.page) : 1;
  const paginatedEvents = await getPaginatedEventPromos(page);

  ctx.render('pages/events', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'Events',
      inSection: 'whatson',
      category: 'public-programme',
      contentType: 'event', // TODO: add pageType (list)
      canonicalUri: '/events'
    }),
    paginatedEvents
  });

  return next();
}
