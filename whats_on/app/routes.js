import Router from 'koa-router';
import {
  renderWhatsOn,
  renderInstallation,
  renderExhibitions,
  renderExhibition,
  renderExhibits
} from './controllers';

const r = new Router({ sensitive: true });

r.get('/whats-on', renderWhatsOn);
r.get('/installations/:id', renderInstallation);
r.get('/exhibitions', renderExhibitions);
r.get('/exhibitions/:id', renderExhibition);
r.get('/exhibitions/:id/exhibits', renderExhibits);

export const router = r.middleware();
