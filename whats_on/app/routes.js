import Router from 'koa-router';
import {renderWhatsOn} from './controllers';

const r = new Router({ sensitive: true });

r.get('/whats-on', renderWhatsOn);

export const router = r.middleware();
