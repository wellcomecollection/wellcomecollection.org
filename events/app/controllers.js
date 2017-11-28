import {prismic, model} from 'common';
const {createPageConfig} = model;

export async function renderEvent(ctx, next, overrideId, gaExp) {
  const id = overrideId || `${ctx.params.id}`;
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
        url: 'https://wellcomecollection.org/whats-on/events/all-events'
      }].concat(event.programme ? [{
        text: event.programme.title
        // TODO: link through to others of this type?
      }] : []).concat([{
        text: 'Part of: Can Graphic Design Save Your Life',
        url: '/graphicdesign'
      }]);

      ctx.render('pages/event', {
        pageConfig: createPageConfig({
          path: path,
          title: event.title,
          inSection: 'whatson',
          category: 'publicprograms',
          contentType: 'event',
          canonicalUri: `${ctx.globals.rootDomain}/events/${event.id}`,
          gaExp
        }),
        event: event,
        tags: tags
      });
    }
  }

  return next();
}
