import Router from 'koa-router';
import {article, healthcheck, favicon} from '../controllers';

const r = new Router();

r.get('/healthcheck', healthcheck);
r.get('/favicon.ico', favicon);
r.get('/:id*', article);

export const router = r.middleware();
