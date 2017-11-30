import {Prismic, services, prismic, model, prismicParsers} from 'common';

const {prismicImage, asText} = prismicParsers;
const {getPrismicApi} = services;
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

      ctx.render('event', {
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

async function getEvents() {
  const prismic = await getPrismicApi();
  const eventsList = await prismic.query([
    Prismic.Predicates.any('document.type', ['events'])
  ]);
  return eventsList;
}

function getNumberFromString(string: String): Number {
  return Number(string.replace(/\D/g, ''));
}

export async function renderEventsList(ctx, next) {
  const events = await getEvents();
  const path = ctx.request.url;
  const allEvents = events.results.map(event => {
    const promo = event.data.promo[0];
    const promoImage = promo && promo.primary.image;
    const promoCaption = promo && promo.primary.caption;

    return event.data.times.map(eventAtTime => {
      return {
        id: event.id,
        url: `/events/${event.id}`,
        start: eventAtTime.startDateTime,
        end: eventAtTime.endDateTime,
        image: prismicImage(promoImage),
        description: asText(promoCaption)
      };
    });
  }).reduce((acc, curr) => {
    return curr.concat(acc);
  }, []).sort((a, b) => {
    return getNumberFromString(b.start || '') - getNumberFromString(a.start || '');
  });

  ctx.render('pages/events', {
    pageConfig: createPageConfig({
      path: path,
      title: 'Events',
      inSection: 'whatson',
      category: 'list', // TODO: update to team (ev&ex)
      contentType: 'event', // TODO: add pageType (list)
      canonicalUri: '/events'
    }),
    allEvents: allEvents
  });

  return next();
}
