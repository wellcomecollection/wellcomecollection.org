import Router from 'koa-router';
import request from 'superagent';
import {healthcheck, featureFlags} from '../controllers/utils';
import {seriesNav, seriesTransporter, latestInstagramPosts, seriesContainerPromoList} from '../controllers/async-controllers';
import {work, search} from '../controllers/work';
import {index, article, preview, series, articles} from '../controllers'; // Deprecated
import {
  renderArticle,
  setPreviewSession,
  renderEvent,
  renderExhibition,
  renderEventbriteEmbed,
  renderExplore,
  renderSeries,
  renderArticlesList
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
  const allowedDomains = [
    'https://iiif.wellcomecollection.org',
    'https://prismic-io.s3.amazonaws.com/wellcomecollection'
  ];

  if (uri.match(new RegExp(allowedDomains.join('|')))) {
    ctx.body = request(uri);
  } else {
    ctx.throw('Invalid image host', 422);
  }
});

// Content

r.get('/:preview(preview)?/articles/(W):id', renderArticle);
r.get('/explore', renderExplore);
r.get('/preview', setPreviewSession);
r.get('/:preview(preview)?/events/:id', renderEvent);
r.get('/:preview(preview)?/exhibitions/:id', renderExhibition);
r.get('/eventbrite-event-embed/:id', renderEventbriteEmbed);
r.get('/series/(W):id', renderSeries);

// Vanity URLs - should redirect
r.get('/graphicdesign', async (ctx, next) => {
  return renderExhibition(ctx, next, 'WZwh4ioAAJ3usf86', 'VSiVotDVSbeOS9orRMI-Wg.1');
});

// API
r.get('/works', search);
r.get('/works/:id', work);

// Deprecated: Wordpress content
r.get('/articles/:slug', article);
r.get('/articles/preview/:id', preview);
r.get('/series/:id', series);
r.get('/articles', articles);
r.get('/articles', async (ctx, next) => {
  const format = ctx.query.format;
  if (format === 'archive') {
    return articles(ctx, next);
  } else {
    return renderArticlesList(ctx, next);
  }
});

// Async
r.get('/async/series-nav/:id', seriesNav);
r.get('/async/series-transporter/:id', seriesTransporter);
r.get('/async/latest-instagram-posts', latestInstagramPosts);
r.get('/async/series-container-promos-list/:id', seriesContainerPromoList);

export const router = r.middleware();
