const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const { initialize, isEnabled } = require('@weco/common/services/unleash/feature-toggles');
const withUserEnabledToggles = require('@weco/common/koa-middleware/withUserEnabledToggles');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.argv[2] || 3000;

function withToggles(ctx, next) {
  const {
    userEnabledToggles = {}
  } = ctx;

  ctx.toggles = {
    apiV2: isEnabled('apiV2', {
      isUserEnabled: userEnabledToggles.apiV2 === true
    })
  };

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
  server.use(withUserEnabledToggles);
  server.use(withToggles);

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
  router.get('/works/management/healthcheck', async ctx => {
    ctx.status = 200;
    ctx.body = 'ok';
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
