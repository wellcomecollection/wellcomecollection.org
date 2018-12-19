const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const {
  middleware, route
} = require('@weco/common/koa-middleware/withCachedValues');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

module.exports = app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();

  // server cached values
  server.use(middleware);

  // Next routing
  route('/embed/works/:id', '/embed', router, app);
  route('/works/progress', '/progress', router, app);
  route('/works/:id', '/work', router, app);
  route('/works', '/works', router, app);

  router.get('/works/management/healthcheck', async ctx => {
    ctx.status = 200;
    ctx.body = 'ok';
  });

  router.get('*', async ctx => {
    console.info('--------------------------------------------');
    console.info('*');
    console.info('--------------------------------------------');
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    console.info('--------------------------------------------');
    console.info('nowt');
    console.info('--------------------------------------------');
    await next();
  });

  server.use(router.routes());
  return server;
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
