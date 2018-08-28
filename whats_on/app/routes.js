import Router from 'koa-router';
import {
  renderWhatsOn,
  renderInstallation,
  renderExhibitions,
  renderExhibitionsComingUp,
  renderExhibitionsCurrent,
  renderExhibitionsPast,
  renderExhibition,
  renderExhibits,
  renderExhibitExhibitionLink,
  renderEvent,
  renderEvents,
  renderEventbriteEmbed,
  renderEventSeries,
  renderExhibitionsCurrentAndComingUp
} from './controllers';

const r = new Router({ sensitive: true });

r.get('/whats-on', renderWhatsOn);
r.get('/whats-on/:period', renderWhatsOn);

r.get('/installations/:id/exhibition', renderExhibitExhibitionLink);
r.get('/installations/:id', renderInstallation);

r.get('/exhibitions', renderExhibitions);
r.get('/exhibitions/coming-up', renderExhibitionsComingUp);
r.get('/exhibitions/current', renderExhibitionsCurrent);
r.get('/exhibitions/past', renderExhibitionsPast);
r.get('/exhibitions/current-and-coming-up', renderExhibitionsCurrentAndComingUp);
r.get('/exhibitions/:id', renderExhibition);
r.get('/exhibitions/:id/exhibits', renderExhibits);

r.get('/events', renderEvents);
r.get('/events/:id', renderEvent);
r.get('/eventbrite-event-embed/:id', renderEventbriteEmbed);
r.get('/event-series/:id', renderEventSeries);

export const router = r.middleware();
