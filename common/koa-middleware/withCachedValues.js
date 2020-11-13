const { parse } = require('url'); // eslint-disable-line node/no-deprecated-api
const compose = require('koa-compose');
const withGlobalAlert = require('./withGlobalAlert');
const withPopupDialog = require('./withPopupDialog');
const withOpeningtimes = require('./withOpeningTimes');
const withToggles = require('./withToggles');
const withPrismicPreviewStatus = require('./withPrismicPreviewStatus');
const withMemoizedPrismic = require('./withMemoizedPrismic');

const withCachedValues = compose([
  withGlobalAlert,
  withPopupDialog,
  withOpeningtimes,
  withToggles,
  withPrismicPreviewStatus,
  withMemoizedPrismic,
]);

async function route(path, page, router, app, extraParams = {}) {
  router.get(path, async ctx => {
    const {
      toggles,
      globalAlert,
      popupDialog,
      openingTimes,
      memoizedPrismic,
    } = ctx;
    const params = ctx.params;
    const query = ctx.query;

    await app.render(ctx.req, ctx.res, page, {
      toggles,
      globalAlert,
      popupDialog,
      openingTimes,
      memoizedPrismic,
      ...params,
      ...query,
      ...extraParams,
    });
    ctx.respond = false;
  });
}

async function renderIfToggleOn(
  path,
  page,
  router,
  app,
  extraParams,
  toggleToCheck
) {
  router.get(path, async ctx => {
    const {
      toggles,
      globalAlert,
      popupDialog,
      openingTimes,
      memoizedPrismic,
    } = ctx;
    const params = ctx.params;
    const query = ctx.query;

    await app.render(ctx.req, ctx.res, toggles[toggleToCheck] ? page : '404', {
      toggles,
      globalAlert,
      popupDialog,
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
    const {
      toggles,
      globalAlert,
      popupDialog,
      openingTimes,
      memoizedPrismic,
    } = ctx;
    const query = {
      ...parsedUrl.query,
      ...extraCtxParams,
      toggles,
      globalAlert,
      popupDialog,
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
  renderIfToggleOn,
};
