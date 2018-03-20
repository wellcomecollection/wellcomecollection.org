import Router from 'koa-router';
import {renderWhatsOn, renderInstallation} from './controllers';

const r = new Router({ sensitive: true });

r.get('/whats-on', renderWhatsOn);
r.get('/installations/:id', renderInstallation);

export const router = r.middleware();
