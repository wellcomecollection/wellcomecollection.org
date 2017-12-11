import Router from 'koa-router';
import {getEventbriteEvent} from './controllers';

const r = new Router({ sensitive: true });
r.get('/eventbrite/:id', getEventbriteEvent);

export const router = r.middleware();
