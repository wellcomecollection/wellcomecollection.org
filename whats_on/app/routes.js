import Router from 'koa-router';
import {renderWhatsOn, renderInstallation, renderExhibition} from './controllers';

const r = new Router({ sensitive: true });

r.get('/whats-on', renderWhatsOn);
r.get('/installations/:id', renderInstallation);
r.get('/exhibitions/:id', renderExhibition);

export const router = r.middleware();
