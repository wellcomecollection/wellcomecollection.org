const { parse } = require('url'); // eslint-disable-line
const compose = require('koa-compose');
const withGlobalAlert = require('./withGlobalAlert');
const withOpeningtimes = require('./withOpeningTimes');
const withToggles = require('./withToggles');
const withPrismicPreviewStatus = require('./withPrismicPreviewStatus');

const withCachedValues = compose([
  withGlobalAlert,
  withOpeningtimes,
  withToggles,
  withPrismicPreviewStatus,
]);

async function route(path, page, router, app, extraParams = {}) {
  router.get(path, async ctx => {
    const { toggles, globalAlert, openingTimes, isPreview } = ctx;
    const params = ctx.params;
    const query = ctx.query;

    await app.render(ctx.req, ctx.res, page, {
      toggles,
      globalAlert,
      openingTimes,
      isPreview,
      ...params,
      ...query,
      ...extraParams,
    });
    ctx.respond = false;
  });
}

function handleAllRoute(handle) {
  return async function(ctx) {
    const parsedUrl = parse(ctx.request.url, true);
    const { toggles, globalAlert, openingTimes, isPreview } = ctx;
    const query = {
      ...parsedUrl.query,
      toggles,
      globalAlert,
      openingTimes,
      isPreview,
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
