const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const Prismic = require('prismic-javascript');
const linkResolver = require('@weco/common/services/prismic/link-resolver');
const bodyParser = require('koa-bodyparser');
const handleNewsletterSignup = require('./routeHandlers/handleNewsletterSignup');

const {
  middleware,
  route,
  handleAllRoute,
} = require('@weco/common/koa-middleware/withCachedValues');

// FIXME: Find a way to import this.
// We can't because it's not a standard es6 module (import and flowtype)
const Periods = {
  Today: 'today',
  ThisWeekend: 'this-weekend',
  CurrentAndComingUp: 'current-and-coming-up',
  Past: 'past',
  ComingUp: 'coming-up',
  ThisWeek: 'this-week',
};
const periodPaths = Object.keys(Periods)
  .map(key => Periods[key])
  .join('|');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

function pageVanityUrl(router, app, url, pageId, template = '/page') {
  route(url, template, router, app, { id: pageId });
}

module.exports = app
  .prepare()
  .then(async () => {
    const server = new Koa();
    const router = new Router();

    server.use(middleware);
    server.use(bodyParser());

    pageVanityUrl(router, app, '/', 'XphUbREAACMAgRNP', '/homepage');
    route('/whats-on', '/whats-on', router, app);
    route(`/whats-on/:period(${periodPaths})`, '/whats-on', router, app);

    route('/exhibitions', '/exhibitions', router, app);
    route(`/exhibitions/:period(${periodPaths})`, '/exhibitions', router, app);
    route('/exhibitions/:id', '/exhibition', router, app);

    route('/events', '/events', router, app);
    route(`/events/:period(${periodPaths})`, '/events', router, app);
    route('/events/:id', '/event', router, app);
    route('/event-series/:id', '/event-series', router, app);

    route('/stories', '/stories', router, app);
    route('/articles', '/articles', router, app);
    route('/articles/:id', '/article', router, app);
    route('/series/:id', '/article-series', router, app);
    route('/projects/:id', '/page', router, app);

    route('/books', '/books', router, app);
    route('/books/:id', '/book', router, app);

    route('/places/:id', '/place', router, app);
    route('/pages/:id', '/page', router, app);
    route('/seasons/:id', '/season', router, app);

    route('/newsletter', '/newsletter', router, app);

    route('/collections', '/page', router, app, {
      id: 'YBfeAhMAACEAqBTx',
    });

    route('/guides', '/guides', router, app);
    route('/guides/:id', '/page', router, app);

    pageVanityUrl(router, app, '/opening-times', 'WwQHTSAAANBfDYXU');
    pageVanityUrl(router, app, '/what-we-do', 'WwLGFCAAAPMiB_Ps');
    pageVanityUrl(router, app, '/press', 'WuxrKCIAAP9h3hmw');
    pageVanityUrl(router, app, '/venue-hire', 'Wuw2MSIAACtd3SsC');
    pageVanityUrl(router, app, '/access', 'Wvm2uiAAAIYQ4FHP');
    pageVanityUrl(router, app, '/youth', 'Wuw2MSIAACtd3Ste');
    pageVanityUrl(router, app, '/schools', 'Wuw2MSIAACtd3StS');
    pageVanityUrl(router, app, '/covid-welcome-back', 'X5amzBIAAB0Aq6Gm');
    pageVanityUrl(router, app, '/covid-book-your-ticket', 'X5aomxIAAB8Aq6n5');
    pageVanityUrl(router, app, '/visit-us', 'X8ZTSBIAACQAiDzY', '/page');
    pageVanityUrl(router, app, '/about-us', 'Wuw2MSIAACtd3Stq');
    pageVanityUrl(router, app, '/get-involved', 'YDaZmxMAACIAT9u8');
    pageVanityUrl(router, app, '/user-panel', 'YH17kRAAACoAyWTB');

    router.post('/newsletter-signup', handleNewsletterSignup);

    router.get('/preview', async ctx => {
      // Kill any cookie we had set, as it think it is causing issues.
      ctx.cookies.set(Prismic.previewCookie);

      const token = ctx.request.query.token;
      const api = await Prismic.getApi(
        'https://wellcomecollection.prismic.io/api/v2',
        {
          req: ctx.request,
        }
      );
      const url = await api.previewSession(token, linkResolver, '/');
      ctx.cookies.set('isPreview', 'true', {
        httpOnly: false,
      });
      ctx.redirect(url);
    });

    router.get('/content/management/healthcheck', async ctx => {
      ctx.status = 200;
      ctx.body = 'ok';
    });

    router.get('*', handleAllRoute(handle));

    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    });

    server.use(router.routes());

    return server;
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
