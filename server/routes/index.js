import Router from 'koa-router';
import {index, article, articles, explore, healthcheck, featureFlags, performanceTest, explosion, preview, series} from '../controllers';
import {seriesNav, seriesTransporter, latestTweets, latestInstagramPosts} from '../controllers/async-controllers';
import {renderPrismicArticle, renderPreviewPrismicArticle, setContentPreviewSession} from '../controllers/content';
import {work, search} from '../controllers/work';

const r = new Router({
  sensitive: true
});

r.get('/', index);
r.get('/healthcheck', healthcheck);
r.get('/explore', explore);
r.get('/articles', articles);
r.get('/articles/(W):id', renderPrismicArticle);
r.get('/preview/:id', renderPreviewPrismicArticle);
r.get('/preview', setContentPreviewSession);
r.get('/articles/:slug', article);
r.get('/series/:id', series);
r.get('/series-nav/:id', seriesNav);
r.get('/series-transporter/:id', seriesTransporter);
r.get('/performance-test.js', performanceTest);
r.get('/explosion/:errorCode', explosion);
r.get('/articles/preview/:id', preview);
r.get('/works/:id', work);
r.get('/flags', featureFlags);
r.get('/latest-tweets/', latestTweets);
r.get('/latest-instagram-posts', latestInstagramPosts);
r.get('/search', search);

export const router = r.middleware();
