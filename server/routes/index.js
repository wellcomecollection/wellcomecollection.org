import Router from 'koa-router';
import request from 'request';
import {healthcheck, featureFlags} from '../controllers/utils';
import {seriesNav, seriesTransporter, latestInstagramPosts, seriesContainerPromoList} from '../controllers/async-controllers';
import {work, search} from '../controllers/work';
import {index, article, articles, preview, series} from '../controllers'; // Deprecated
import {
  renderArticle,
  setPreviewSession,
  renderEvent,
  renderExhibition,
  renderEventbriteEmbed,
  renderExplore
} from '../controllers/content';

const r = new Router({
  sensitive: true
});

// Util / function
r.get('/', index);
r.get('/healthcheck', healthcheck);
r.get('/flags', featureFlags);
r.get('/kaboom', (ctx, next) => {
  ctx.throw('Error Message', 500);
});
r.get('/download', (ctx, next) => {
  const uri = ctx.request.query.uri;
  if (uri.match('https://iiif.wellcomecollection.org')) {
    ctx.body = request(uri);
  } else {
    ctx.throw('Invalid image host', 422);
  }
});

// Content
r.get('/:preview?/articles/(W):id', renderArticle);
r.get('/explore', renderExplore);
r.get('/preview', setPreviewSession);
r.get('/events/:id', renderEvent);
r.get('/exhibitions/:id', renderExhibition);
r.get('/eventbrite-event-embed/:id', renderEventbriteEmbed);

// API
r.get('/search', search);
r.get('/works/:id', work);

// Deprecated: Wordpress content
r.get('/articles/:slug', article);
r.get('/articles/preview/:id', preview);
r.get('/series/:id', series);
r.get('/articles', articles);

// Async
r.get('/series-nav/:id', seriesNav);
r.get('/series-transporter/:id', seriesTransporter);
r.get('/latest-instagram-posts', latestInstagramPosts);
r.get('/series-container-promos-list/:id', seriesContainerPromoList);

export const router = r.middleware();
