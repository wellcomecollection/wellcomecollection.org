
const compose = require('koa-compose');
const withGlobalAlert = require('./withGlobalAlert');
const withOpeningtimes = require('./withOpeningtimes');
const withToggles = require('./withToggles');

const withCachedValues = compose([
  withGlobalAlert,
  withOpeningtimes,
  withToggles
]);

async function route(path, page, router, app) {
  router.get(path, async ctx => {
    const {toggles, globalAlert, openingTimes} = ctx;
    const params = ctx.params;
    await app.render(ctx.req, ctx.res, page, {
      toggles,
      globalAlert,
      openingTimes,
      ...params
    });
    ctx.respond = false;
  });
}

module.exports = {
  middlesware: withCachedValues,
  route
};
