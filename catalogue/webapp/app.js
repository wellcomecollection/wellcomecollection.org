const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const Cookies = require('cookies');
const { initialize, isEnabled } = require('@weco/common/services/unleash/feature-toggles');
const {
  middleware, route
} = require('@weco/common/koa-middleware/withCachedValues');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

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
  let userEnabledToggles = {};
  try {
    userEnabledToggles = JSON.parse(cookies.get('toggles'));
  } catch (e) {}

  ctx.toggles = {
    apiV2: isEnabled('apiV2', {
      isUserEnabled: userEnabledToggles.apiV2 === true
    })
  };

  return next();
}

module.exports = app.prepare().then(async () => {
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
  server.use(setUserEnabledToggles);
  server.use(getToggles);

  // server cached values
  server.use(middleware);

  // Next routing
  route('/embed/works/:id', '/embed', router, app);
  route('/works/progress', '/progress', router, app);
  route('/works/:id', '/work', router, app);
  route('/worksv2/:id', '/workv2', router, app);
  route('/worksv2', '/worksv2', router, app);
  route('/works', '/works', router, app);

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
  return server;
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
