import Router from 'koa-router';
import {index, article, articles, explore, healthcheck, performanceTest,
        explosion} from '../controllers';

const r = new Router();

r.get('/', index);
r.get('/healthcheck', healthcheck);
r.get('/explore', explore);
r.get('/articles', articles);
r.get('/articles/:slug', article);
r.get('/performance-test.js', performanceTest);
r.get('/explosion/:errorCode', explosion);
r.get('/preview/:id', explosion);

export const router = r.middleware();
