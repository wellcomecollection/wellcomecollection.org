const Cookies = require('cookies');

function withToggles(ctx, next) {
  // Any cookies set from anywhere
  // But normally from the lambdas@edge
  const cookies = new Cookies(ctx.req, ctx.res);
  const togglesCookie = cookies.get('toggles');
  let toggles = {};
  try {
    toggles = JSON.parse(togglesCookie);
  } catch (e) {}

  // Have we set any via the URL?
  const togglesQuery = ctx.query.toggles;
  const urlToggles = togglesQuery ? togglesQuery.split(',').reduce((acc, toggle) => {
    const toggleParts = toggle.split(':');
    const key = toggleParts[0];
    const val = toggleParts[1];
    return Object.assign({}, acc, {
      [key]: val === 'true'
    });
  }, {}) : {};

  ctx.toggles = Object.assign({}, toggles, urlToggles);

  return next();
}

module.exports = withToggles;
