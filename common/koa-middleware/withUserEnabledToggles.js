const Cookies = require('cookies');

function withUserEnabledCookies(ctx, next) {
  const togglesQuery = ctx.query.toggles;
  const cookies = new Cookies(ctx.req, ctx.res);

  // Kill all of your toggles
  if (togglesQuery === 'null') {
    cookies.set('toggles');
    ctx.userEnabledToggles = {};
    return next();
  }

  const togglesCookie = cookies.get('toggles');
  let toggles = {};
  try {
    toggles = JSON.parse(togglesCookie);
  } catch (e) {}

  if (togglesQuery) {
    const togglesRequest = togglesQuery.split(',').reduce((acc, toggle) => {
      const toggleParts = toggle.split(':');
      const key = toggleParts[0];
      const val = toggleParts[1];

      return Object.assign({}, acc, {
        [key]: val === 'true'
      });
    }, {});

    Object.keys(togglesRequest).map(key => {
      const val = togglesRequest[key];
      if (val === true) {
        toggles[key] = true;
      } else {
        delete toggles[key];
      }
    });

    if (Object.keys(toggles).length > 0) {
      cookies.set('toggles', JSON.stringify(toggles), {
        overwrite: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
        sameSite: 'strict'
      });
      ctx.userEnabledToggles = toggles;
    } else {
      cookies.set('toggles');
      ctx.userEnabledToggles = {};
    }
  } else {
    ctx.userEnabledToggles = toggles;
  }

  return next();
}

module.exports = withUserEnabledCookies;
