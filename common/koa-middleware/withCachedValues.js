
const compose = require('koa-compose');
const withGlobalAlert = require('./withGlobalAlert');
const withOpeningtimes = require('./withOpeningTimes');
const withToggles = require('./withToggles');

const withCachedValues = compose([
  withGlobalAlert,
  withOpeningtimes,
  withToggles
]);

async function route(path, page, router, app, extraParams = {}) {
  router.get(path, async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    const params = ctx.params;
    const query = ctx.query;

    await app.render(ctx.req, ctx.res, page, {
      toggles,
      globalAlert,
      openingTimes,
      ...params,
      ...query,
      ...extraParams
    });
    ctx.respond = false;
  });
}

module.exports = {
  middleware: withCachedValues,
  route
};
