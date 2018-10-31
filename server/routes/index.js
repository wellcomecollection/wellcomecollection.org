import Router from 'koa-router';
import {healthcheck} from '../controllers/utils';

const r = new Router({
  sensitive: true
});

r.get('/management/healthcheck', healthcheck);

export const router = r.middleware();
