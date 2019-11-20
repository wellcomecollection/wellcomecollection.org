const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const withAuthRedirect = require('@weco/common/koa-middleware/withAuthRedirect');
const {
  middleware,
  route,
  handleAllRoute,
} = require('@weco/common/koa-middleware/withCachedValues');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

module.exports = app
  .prepare()
  .then(async () => {
    const server = new Koa();
    const router = new Router();

    // server cached values
    server.use(withAuthRedirect);
    server.use(middleware);

    // Next routing
    route('/oembed/works/:id', '/embed', router, app);
    route('/works/progress', '/progress', router, app);
    route('/works/:id', '/work', router, app);
    route('/works', '/works', router, app);
    route('/works/:workId/items', '/item', router, app);
    route('/works/:workId/download', '/download', router, app);

    router.get('/works/management/healthcheck', async ctx => {
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
