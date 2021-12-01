const { parse } = require('url'); // eslint-disable-line node/no-deprecated-api
const compose = require('koa-compose');
const withPrismicPreviewStatus = require('./withPrismicPreviewStatus');
const withMemoizedPrismic = require('./withMemoizedPrismic');

const withCachedValues = compose([
  withMemoizedPrismic,
  withPrismicPreviewStatus,
]);

async function route(path, page, router, app, extraParams = {}) {
  router.get(path, async ctx => {
    const { memoizedPrismic } = ctx;
    const params = ctx.params;
    const query = ctx.query;

    await app.render(ctx.req, ctx.res, page, {
      memoizedPrismic,
      ...params,
      ...query,
      ...extraParams,
    });
    ctx.respond = false;
  });
}

function handleAllRoute(handle) {
  return async function (ctx, extraCtxParams = {}) {
    const parsedUrl = parse(ctx.request.url, true);
    const { memoizedPrismic } = ctx;
    const query = {
      ...parsedUrl.query,
      ...extraCtxParams,
      memoizedPrismic,
    };
    const url = {
      ...parsedUrl,
      query,
    };
    await handle(ctx.req, ctx.res, url);
    ctx.respond = false;
  };
}

module.exports = {
  middleware: withCachedValues,
  route,
  handleAllRoute,
  timers: [withMemoizedPrismic.timer],
};
