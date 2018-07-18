import {model, prismic} from 'common';
import {getEventSeries} from '@weco/common/services/prismic/events';
const {createPageConfig} = model;
const {
  getPaginatedEventPromos,
  asText,
  asHtml
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

function convertEventToEventPromos(events) {
  return events.map(event => {
    const hasNotFullyBookedTimes = event.times.find(time => !time.isFullyBooked);
    return event.times.map(time => {
      return {
        id: event.id,
        title: event.title,
        url: `/events/${event.id}`,
        format: event.format,
        audience: event.audiences.length > 0 ? event.audiences[0] : null,
        hasNotFullyBookedTimes: hasNotFullyBookedTimes,
        isFullyBooked: time.isFullyBooked,
        start: time.range.startDateTime,
        end: time.range.endDateTime,
        image: (event.promo && event.promo.image) || {},
        description: event.promo && event.promo.caption,
        bookingType: event.bookingType,
        interpretations: event.interpretations,
        eventbriteId: event.eventbriteId,
        series: event.series,
        schedule: event.schedule
      };
    });
  }).reduce((acc, val) => acc.concat(val), []);
}

export async function renderEventSeries(ctx, next) {
  const {id} = ctx.params;
  const {events, series} = await getEventSeries(ctx.request, { id });

  if (events.length > 0) {
    const upcomingEvents = convertEventToEventPromos(events.filter(event => {
      const lastStartTime = event.times.length > 0 ? event.times[event.times.length - 1].range.startDateTime : null;
      const inTheFuture = lastStartTime ? new Date(lastStartTime) > new Date() : false;
      return inTheFuture;
    }));

    const upcomingEventsIds = upcomingEvents.map(event => event.id);

    const pastEvents = convertEventToEventPromos(events
      .filter(event => upcomingEventsIds.indexOf(event.id) === -1)).slice(0, 3);

    ctx.render('pages/event-series', {
      pageConfig: createPageConfig({
        path: ctx.request.url,
        title: series.title,
        description: asText(series.description),
        inSection: 'whatson',
        category: 'public-programme',
        contentType: 'event-series',
        canonicalUri: `/event-series/${id}`
      }),
      series: series,
      htmlDescription: asHtml(series.description),
      paginatedEvents: upcomingEvents,
      pastEvents: pastEvents,
      backgroundTexture: series.backgroundTexture
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
