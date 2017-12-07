import {model, prismic} from 'common';
const {createPageConfig} = model;
const {getPaginatedResults} = prismic;

// used to attach some view specific logic
type EventInfo = {|
  isDropIn: boolean;
  eventbriteId: ?string;
|};

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

      const eventbriteIdScheme = event.identifiers.find(id => id.identifierScheme === 'eventbrite-id');
      const eventbriteId = eventbriteIdScheme && eventbriteIdScheme.value;
      const isDropIn = !event.bookingEnquiryTeam && !eventbriteId;
      const eventInfo = { isDropIn, eventbriteId };

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
        eventInfo: eventInfo,
        tags: tags
      });
    }
  }

  return next();
}

export async function renderEventsList(ctx, next) {
  const page = Number(ctx.request.query.page);
  const eventsList = await getPaginatedResults(page, 'event');

  ctx.render('pages/events', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'Events',
      inSection: 'whatson',
      category: 'list', // TODO: update to team (ev&ex)
      contentType: 'event', // TODO: add pageType (list)
      canonicalUri: '/events'
    }),
    eventsList
  });

  return next();
}
