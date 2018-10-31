const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const Cookies = require('cookies');
const Prismic = require('prismic-javascript');
const linkResolver = require('@weco/common/services/prismic/link-resolver');
const { initialize, isEnabled } = require('@weco/common/services/unleash/feature-toggles');
const withGlobalAlert = require('@weco/common/koa-middleware/withGlobalAlert');
const withOpeningTimes = require('@weco/common/koa-middleware/withOpeningTimes');

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

function setUserEnabledToggles(ctx, next) {
  const togglesRequest = ctx.query.toggles;

  if (togglesRequest) {
    const toggles = togglesRequest.split(',').reduce((acc, toggle) => {
      const toggleParts = toggle.split(':');
      return Object.assign({}, acc, {
        [toggleParts[0]]: Boolean(toggleParts[1])
      });
    }, {});

    if (Object.keys(toggles).length > 0) {
      const cookies = new Cookies(ctx.req, ctx.res);
      const togglesCookie = cookies.get('toggles');
      let previousToggles = {};
      try {
        previousToggles = JSON.parse(togglesCookie);
      } catch (e) {}
      const mergedToggles = Object.assign({}, previousToggles, toggles);
      cookies.set('toggles', JSON.stringify(mergedToggles));
    }
  }
  return next();
}

function getToggles(ctx, next) {
  const cookies = new Cookies(ctx.req, ctx.res);
  // Leaving this here as we might need it for `ActiveForUserInCohort`
  // const cohort = cookies.get('WC_featuresCohort');
  let userEnabledToggles = {};
  try {
    userEnabledToggles = JSON.parse(cookies.get('toggles'));
  } catch (e) {}

  ctx.toggles = {
    outro: isEnabled('outro', {
      isUserEnabled: userEnabledToggles.outro === true
    }),
    outroAB: isEnabled('outroAB')
  };

  return next();
}

function setCohortCookie(ctx, next) {
  const cohort = ctx.query.cohort;
  if (cohort) {
    const cookies = new Cookies(ctx.req, ctx.res);
    cookies.set('WC_featuresCohort', cohort, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      overwrite: true,
      path: '/',
      domain: dev ? null : 'wellcomecollection.org'
    });
  }
  return next();
}

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
  const instance = initialize({
    appName: 'content'
  });

  try {
    await new Promise((resolve, reject) => {
      instance.on('ready', async () => {
        resolve(true);
      });
      instance.on('error', async () => {
        reject(new Error('unleash: unable to initialize unleash'));
      });
    });
  } catch (e) {
    // TODO: We don't want to not start the app here
    // but we should report to sentry.
    console.error(e);
  }

  // Feature toggles
  server.use(setCohortCookie);
  server.use(setUserEnabledToggles);
  server.use(getToggles);

  // server cached values
  server.use(withGlobalAlert);
  server.use(withOpeningTimes);

  // Next routing
  router.get('/', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/homepage', {
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/whats-on', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/whats-on', {
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });
  router.get(`/whats-on/:period(${periodPaths})`, async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/whats-on', {
      period: ctx.params.period,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

  router.get('/exhibitions', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    const {page} = ctx.query;
    await app.render(ctx.req, ctx.res, '/exhibitions', {
      page,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });
  router.get(`/exhibitions/:period(${periodPaths})`, async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    const {page} = ctx.query;
    await app.render(ctx.req, ctx.res, '/exhibitions', {
      period: ctx.params.period,
      page,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });
  router.get('/exhibitions/:id', async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    await app.render(ctx.req, ctx.res, '/exhibition', {
      id: ctx.params.id,
      toggles,
      globalAlert,
      openingTimes
    });
    ctx.respond = false;
  });

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
