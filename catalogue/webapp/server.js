const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const { initialize } = require('@weco/common/services/unleash/feature-flags');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.argv[2] || 3000;

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  const instance = initialize({
    appName: 'works'
  });
  await new Promise((resolve, reject) => {
    instance.on('ready', async () => {
      resolve(true);
    });
    instance.on('error', async () => {
      reject(new Error('unleash: unable to initialize unleash'));
    });
  });

  router.get('/embed/works/:id', async ctx => {
    await app.render(ctx.req, ctx.res, '/embed', {id: ctx.params.id});
    ctx.respond = false;
  });

  router.get('/works/:id', async ctx => {
    await app.render(ctx.req, ctx.res, '/work', {id: ctx.params.id});
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
    console.log(`> ${process.env.NODE_ENV} ready on http://localhost:${port}/works`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
