const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const Cookies = require('cookies');
const { initialize, isEnabled } = require('@weco/common/services/unleash/feature-toggles');

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
    apiV2: isEnabled('apiV2', {
      enabled: userEnabledToggles.apiV2 === true
    }),
    catalogueApiStaging: isEnabled('catalogueApiStaging', {
      enabled: userEnabledToggles.catalogueApiStaging === true
    })
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

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  const instance = initialize({
    appName: 'works'
  });

  try {
    await new Promise((resolve, reject) => {
      instance.on('ready', async (things) => {
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

  // Next routing
  router.get('/embed/works/:id', async ctx => {
    const {toggles} = ctx;
    await app.render(ctx.req, ctx.res, '/embed', {
      id: ctx.params.id,
      toggles
    });
    ctx.respond = false;
  });

  router.get('/works/:id', async ctx => {
    const {toggles} = ctx;
    await app.render(ctx.req, ctx.res, '/work', {
      page: ctx.query.page,
      query: ctx.query.query,
      id: ctx.params.id,
      toggles
    });
    ctx.respond = false;
  });

  router.get('/works', async ctx => {
    const {toggles} = ctx;
    await app.render(ctx.req, ctx.res, '/works', {
      page: ctx.query.page,
      query: ctx.query.query,
      toggles
    });
    ctx.respond = false;
  });

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
    console.log(`> ${process.env.NODE_ENV || 'development'} ready on http://localhost:${port}/works`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
