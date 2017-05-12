import Router from 'koa-router';
import {index, article, articles, explore, healthcheck, featureFlags, performanceTest,
        explosion, preview, series, seriesNav} from '../controllers';
import {catalogueItem} from '../controllers/catalogue';

const r = new Router();

r.get('/', index);
r.get('/healthcheck', healthcheck);
r.get('/explore', explore);
r.get('/articles', articles);
r.get('/articles/:slug', article);
r.get('/series/:id', series);
r.get('/series-nav/:id', seriesNav);
r.get('/performance-test.js', performanceTest);
r.get('/explosion/:errorCode', explosion);
r.get('/articles/preview/:id', preview);
r.get('/catalogue/:id', catalogueItem);
r.get('/flags', featureFlags);

export const router = r.middleware();
