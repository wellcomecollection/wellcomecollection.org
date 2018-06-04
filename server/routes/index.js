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
  searchForDrupalRedirect,
  renderBooks,
  renderBook,
  renderSearch as renderSearchPage
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
r.get('/pages/:id', renderPage);
r.get('/books', renderBooks);
r.get('/books/:id', renderBook);
r.get('/search', renderSearchPage);
r.get('/newsletter', renderNewsletterPage);

// root paths that we want to support.
// Each service should probably deal with their own
function pageWithId(id) {
  return async (ctx, next) => {
    ctx.params.id = id;
    return renderPage(ctx, next);
  };
}
r.get('/visit-us', pageWithId('WwLIBiAAAPMiB_zC'));
r.get('/what-we-do', pageWithId('WwLGFCAAAPMiB_Ps'));
r.get('/press', pageWithId('WuxrKCIAAP9h3hmw'));
r.get('/venue-hire', pageWithId('Wuw2MSIAACtd3SsC'));
r.get('/access', pageWithId('Wvm2uiAAAIYQ4FHP'));
r.get('/youth', pageWithId('Wuw2MSIAACtd3Ste'));
r.get('/schools', pageWithId('Wuw2MSIAACtd3StS'));
// This is a bit crap.
// It allows us to always serve the combo page.
// When this info is stored in Prismic, we can just use the `/opening-hours`
// on the promo
r.get('/pages/WwQHTSAAANBfDYXU', (ctx, next) => {
  ctx.status = 301;
  ctx.redirect(`/opening-times`);
});
r.get('/opening-times', renderOpeningTimes);

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
