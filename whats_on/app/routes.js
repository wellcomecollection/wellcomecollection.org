import Router from 'koa-router';
import {
  renderWhatsOn,
  renderInstallation,
  renderExhibitions,
  renderExhibition,
  renderExhibits,
  renderExhibitExhibitionLink,
  renderEvent
} from './controllers';

const r = new Router({ sensitive: true });

r.get('/whats-on', renderWhatsOn);
r.get('/installations/:id/exhibition', renderExhibitExhibitionLink);
r.get('/installations/:id', renderInstallation);
r.get('/exhibitions', renderExhibitions);
r.get('/exhibitions/:id', renderExhibition);
r.get('/exhibitions/:id/exhibits', renderExhibits);
r.get('/events/:id', renderEvent);

export const router = r.middleware();
