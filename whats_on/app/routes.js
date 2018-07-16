import Router from 'koa-router';
import {
  renderWhatsOn,
  renderInstallation,
  renderExhibitions,
  renderExhibition,
  renderExhibits,
  renderExhibitExhibitionLink,
  renderEvent,
  renderEventbriteEmbed,
  renderEventSeries
} from './controllers';

const r = new Router({ sensitive: true });

r.get('/whats-on', renderWhatsOn);
r.get('/installations/:id/exhibition', renderExhibitExhibitionLink);
r.get('/installations/:id', renderInstallation);
r.get('/exhibitions', renderExhibitions);
r.get('/exhibitions/:id', renderExhibition);
r.get('/exhibitions/:id/exhibits', renderExhibits);
r.get('/whats-on/events/:id', renderEvent); // For prototype testing
r.get('/eventbrite-event-embed/:id', renderEventbriteEmbed);
r.get('/event-series/:id', renderEventSeries);

export const router = r.middleware();
