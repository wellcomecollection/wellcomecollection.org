import Router from 'koa-router';
import {exploreArticle, libraryArticle, healthcheck, favicon} from '../controllers';

const r = new Router();

r.get('/healthcheck', healthcheck);
r.get('/favicon.ico', favicon);
r.get('/ex/:id*', exploreArticle);
r.get('/wl/:id*', libraryArticle);

export const router = r.middleware();
