import {model, prismic} from 'common';
const {createPageConfig} = model;
const {
  getPaginatedEventPromos
} = prismic;

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
