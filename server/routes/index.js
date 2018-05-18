import Router from 'koa-router';
import request from 'superagent';
import {healthcheck, featureFlags, progress} from '../controllers/utils';
import {seriesNav, seriesTransporter, renderSearch} from '../controllers/async-controllers';
import {work, search} from '../controllers/work';
import {article, preview, series, articles} from '../controllers/wordpress';
import {
  renderHomepage,
  renderArticle,
  setPreviewSession,
  renderEventbriteEmbed,
  renderExplore,
  renderSeries,
  renderArticlesList,
  renderWebcomicSeries,
  renderOpeningTimes,
  renderNewsletterPage,
  renderPage,
  renderTagPage,
  searchForDrupalRedirect
} from '../controllers/content';

const r = new Router({
  sensitive: true
});

// Util / function
r.get('/', renderHomepage);
r.get('/progress', progress);
r.get('/flags', featureFlags);
r.get('/kaboom', (ctx, next) => {
  ctx.throw('Error Message', 500);
});
r.get('/download', async (ctx, next) => {
  const uri = ctx.request.query.uri;
  const allowedDomains = [
    'https://iiif.wellcomecollection.org',
    'https://prismic-io.s3.amazonaws.com/wellcomecollection'
  ];

  if (uri && uri.match(new RegExp(allowedDomains.join('|')))) {
    ctx.body = request(uri);
  } else {
    ctx.throw('Invalid image host', 422);
  }
});
r.get('/management/healthcheck', healthcheck);
r.get('/management/manifest', async (ctx, next) => {
  const data = await require('../management/manifest');
  ctx.body = data;
});

// Content
r.get('/:preview(preview)?/articles/(W):id', renderArticle);
r.get('/explore', renderExplore);
r.get('/preview', setPreviewSession);
r.get('/eventbrite-event-embed/:id', renderEventbriteEmbed);
r.get('/series/(W):id', renderSeries);
r.get('/webcomic-series/:id', renderWebcomicSeries);
r.get('/info/opening-times', renderOpeningTimes);
r.get('/pages/:id', renderPage);
r.get('/newsletter', renderNewsletterPage);
r.get('/tag/what-we-do', renderTagPage(
  'what-we-do',
  '/what-we-do',
  'What we do',
  'what-we-do',
  'Activities, resources and projects from Wellcome Collection.'
));
r.get('/tag/visit-us', renderTagPage(
  'visit-us',
  '/visit-us',
  'Visit us',
  'visit-us',
  'Wellcome Collection is open 10.00-18.00 (11.00-18.00 Sundays) with late night opening on Thursday. The galleries and library are closed on Mondays.'
));
r.get('/tag/press', renderTagPage(
  'press',
  '/press',
  'Press',
  'press',
  'Press releases'
));

// root paths that we want to support.
// Each service should probably deal with their own
r.get('/press', async (ctx, next) => {
  ctx.params.id = 'WuxrKCIAAP9h3hmw';
  return renderPage(ctx, next);
});

// API
r.get('/works', search);
r.get('/works/:id', work);

// Deprecated: Wordpress content
r.get('/articles/archive', articles);
r.get('/articles/:slug', article);
r.get('/articles/preview/:id', preview);
r.get('/series/:id', series);
r.get('/articles', renderArticlesList);

// Async
r.get('/async/series-nav/:id', seriesNav);
r.get('/async/series-transporter/:id', seriesTransporter);
r.get('/async/search', renderSearch);

r.get('/:path*', searchForDrupalRedirect);

export const router = r.middleware();
