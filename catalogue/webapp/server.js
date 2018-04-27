const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  router.get('/catalogue/works/:id', async ctx => {
    await app.render(ctx.req, ctx.res, '/catalogue/work', {id: ctx.params.id});
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
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log(`> ${process.env.NODE_ENV} ready on http://localhost:3000`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
