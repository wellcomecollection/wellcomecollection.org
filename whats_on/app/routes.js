import Router from 'koa-router';
import {Periods} from '@weco/common/model/periods';
import {
  renderWhatsOn,
  renderInstallation,
  renderExhibitions,
  renderExhibition,
  renderExhibits,
  renderExhibitExhibitionLink,
  renderEvent,
  renderEvents,
  renderEventbriteEmbed,
  renderEventSeries
} from './controllers';

const periodPaths = Object.keys(Periods).map(key => Periods[key]).join('|');
const r = new Router({ sensitive: true });

r.get('/whats-on', renderWhatsOn);
r.get('/whats-on/:period', renderWhatsOn);

r.get('/installations/:id/exhibition', renderExhibitExhibitionLink);
r.get('/installations/:id', renderInstallation);

r.get('/exhibitions', renderExhibitions);
r.get(`/exhibitions/:period(${periodPaths})`, renderExhibitions);
r.get('/exhibitions/:id', renderExhibition);
r.get('/exhibitions/:id/exhibits', renderExhibits);

r.get('/events', renderEvents);
r.get(`/events/:period(${periodPaths})`, renderEvents);
r.get('/events/:id', renderEvent);
r.get('/eventbrite-event-embed/:id', renderEventbriteEmbed);
r.get('/event-series/:id', renderEventSeries);

export const router = r.middleware();
