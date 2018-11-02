const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const Prismic = require('prismic-javascript');
const linkResolver = require('@weco/common/services/prismic/link-resolver');
const {
  middlesware, route
} = require('@weco/common/koa-middleware/withCachedValues');

// FIXME: Find a way to import this.
// We can't because it's not a standard es6 module (import and flowtype)
const Periods = {
  Today: 'today',
  ThisWeekend: 'this-weekend',
  CurrentAndComingUp: 'current-and-coming-up',
  Past: 'past',
  ComingUp: 'coming-up',
  ThisWeek: 'this-week'
};
const periodPaths = Object.keys(Periods).map(key => Periods[key]).join('|');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.argv[2] || 3000;

function pageVanityUrl(router, app, url, pageId) {
  router.get(url, async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/page', {
      id: pageId,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });
}

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();

  server.use(middlesware);

  route('/', '/homepage', router, app);
  route('/whats-on', '/whats-on', router, app);
  route(`/whats-on/:period(${periodPaths})`, '/whats-on', router, app);

  route('/exhibitions', '/exhibitions', router, app);
  route(`/exhibitions/:period(${periodPaths})`, '/exhibitions', router, app);
  route('/exhibitions/:id', '/exhibition', router, app);

  router.get('/events', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/events', {
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });
  router.get(`/events/:period(${periodPaths})`, async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/events', {
      period: ctx.params.period,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });
  router.get('/events/:id', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/event', {
      id: ctx.params.id,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/stories', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/stories', {
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/articles', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/articles', {
      id: ctx.params.id,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });
  router.get('/articles/:id', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/article', {
      id: ctx.params.id,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/series/:id', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/article-series', {
      id: ctx.params.id,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/books', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    const {page} = ctx.query;
    await app.render(ctx.req, ctx.res, '/books', {
      page,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });
  router.get('/books/:id', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/book', {
      id: ctx.params.id,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/event-series/:id', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/event-series', {
      id: ctx.params.id,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/places/:id', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/place', {
      id: ctx.params.id,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/pages/:id', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/page', {
      id: ctx.params.id,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/installations/:id', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/installation', {
      id: ctx.params.id,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/opening-times', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/opening-times', {
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/newsletter', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/newsletter', {
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/preview', async ctx => {
    // Kill any cookie we had set, as it think it is causing issues.
    ctx.cookies.set(Prismic.previewCookie);

    const token = ctx.request.query.token;
    const api = await Prismic.getApi('https://wellcomecollection.prismic.io/api/v2', {
      req: ctx.request
    });
    const url = await api.previewSession(token, linkResolver, '/');
    ctx.cookies.set('isPreview', 'true', {
      httpOnly: false
    });
    ctx.redirect(url);
  });

  router.get('/content/management/healthcheck', async ctx => {
    ctx.status = 200;
    ctx.body = 'ok';
  });

  pageVanityUrl(router, app, '/visit-us', 'WwLIBiAAAPMiB_zC');
  pageVanityUrl(router, app, '/what-we-do', 'WwLGFCAAAPMiB_Ps');
  pageVanityUrl(router, app, '/press', 'WuxrKCIAAP9h3hmw');
  pageVanityUrl(router, app, '/venue-hire', 'Wuw2MSIAACtd3SsC');
  pageVanityUrl(router, app, '/access', 'Wvm2uiAAAIYQ4FHP');
  pageVanityUrl(router, app, '/youth', 'Wuw2MSIAACtd3Ste');
  pageVanityUrl(router, app, '/schools', 'Wuw2MSIAACtd3StS');

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.use(router.routes());
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> ${process.env.NODE_ENV || 'development'} ready on http://localhost:${port}/`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
