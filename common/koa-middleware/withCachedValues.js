const { parse } = require('url');
const compose = require('koa-compose');
const withGlobalAlert = require('./withGlobalAlert');
const withOpeningtimes = require('./withOpeningTimes');
const withToggles = require('./withToggles');
const withPrismicPreviewStatus = require('./withPrismicPreviewStatus');
const withMemoizedPrismic = require('./withMemoizedPrismic');

const withCachedValues = compose([
  withGlobalAlert,
  withOpeningtimes,
  withToggles,
  withPrismicPreviewStatus,
  withMemoizedPrismic,
]);

async function route(path, page, router, app, extraParams = {}) {
  router.get(path, async ctx => {
    const { toggles, globalAlert, openingTimes, memoizedPrismic } = ctx;
    const params = ctx.params;
    const query = ctx.query;

    await app.render(ctx.req, ctx.res, page, {
      toggles,
      globalAlert,
      openingTimes,
      memoizedPrismic,
      ...params,
      ...query,
      ...extraParams,
    });
    ctx.respond = false;
  });
}

function handleAllRoute(handle) {
  return async function(ctx, extraCtxParams = {}) {
    const parsedUrl = parse(ctx.request.url, true);
    const { toggles, globalAlert, openingTimes, memoizedPrismic } = ctx;
    const query = {
      ...parsedUrl.query,
      ...extraCtxParams,
      toggles,
      globalAlert,
      openingTimes,
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
};
