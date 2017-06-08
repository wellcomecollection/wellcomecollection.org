import Router from 'koa-router';
import {index, article, articles, explore, healthcheck, featureFlags, performanceTest, explosion, preview, series} from '../controllers';
import {seriesNav, seriesTransporter, latestTweets, latestInstagramPosts} from '../controllers/async-controllers';
import {catalogueItem} from '../controllers/catalogue';

const r = new Router();

r.get('/', index);
r.get('/healthcheck', healthcheck);
r.get('/explore', explore);
r.get('/articles', articles);
r.get('/articles/:slug', article);
r.get('/series/:id', series);
r.get('/series-nav/:id', seriesNav);
r.get('/series-transporter/:id', seriesTransporter);
r.get('/performance-test.js', performanceTest);
r.get('/explosion/:errorCode', explosion);
r.get('/articles/preview/:id', preview);
r.get('/catalogue/:id', catalogueItem);
r.get('/flags', featureFlags);
r.get('/latest-tweets/:count?', latestTweets);
r.get('/latest-instagram-posts', latestInstagramPosts);

export const router = r.middleware();
