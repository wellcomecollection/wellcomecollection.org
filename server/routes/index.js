import Router from 'koa-router';
import {article, explore, healthcheck, favicon} from '../controllers';

const r = new Router();

r.get('/healthcheck', healthcheck);
r.get('/favicon.ico', favicon);
r.get('/explore', explore);
r.get('/articles/:id*', article);

export const router = r.middleware();
