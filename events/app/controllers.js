import {model, prismic} from 'common';
const {createPageConfig} = model;

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
