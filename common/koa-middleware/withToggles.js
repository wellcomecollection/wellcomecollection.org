const fetch = require('isomorphic-unfetch');
let defaultToggleValues = {};
const cookiePrefix = 'toggle_';
const cookieExpiry = 31536000;

const validToggle = (toggles, toggleFeature) => {
  return Object.keys(toggles).includes(toggleFeature);
};

async function getDefaultToggleValues() {
  try {
    const togglesResp = await fetch(
      'https://toggles.wellcomecollection.org/toggles.json'
    ).then(response => response.json());

    defaultToggleValues = togglesResp.toggles.reduce(
      (acc, toggle) => ({ ...acc, [toggle.id]: toggle.defaultValue }),
      {}
    );
  } catch (e) {}
}
getDefaultToggleValues();
setInterval(getDefaultToggleValues, 2 * 60 * 1000); // 2 minutes

const parseCookies = function(req) {
  if (!req.headers.cookie) {
    return [];
  }

  return req.headers.cookie.split(';').map(cookieString => {
    const keyVal = cookieString.split('=');
    const key = keyVal[0] && keyVal[0].trim();
    const value = keyVal[1] && keyVal[1].trim();

    return { key, value };
  });
};

function withToggles(ctx, next) {
  const cookies = parseCookies(ctx.req);
  const togglesCookies = cookies.filter(cookie =>
    cookie.key.startsWith(cookiePrefix)
  );
  const toggles = togglesCookies.reduce((acc, cookie) => {
    return Object.assign({}, acc, {
      [cookie.key.replace(cookiePrefix, '')]: cookie.value === 'true',
    });
  }, {});

  ctx.toggles = { ...defaultToggleValues, ...toggles };
  enableDisableToggler(ctx);
  return next();
}

function enableDisableToggler(ctx) {
  if (ctx.toggles) {
    // enable toggler of feature
    if (ctx.query.toggles) {
      const toggleFeature = ctx.query.toggles;
      const validToggleFeature = validToggle(ctx.toggles, toggleFeature);
      if (validToggleFeature) {
        ctx.cookies.set(cookiePrefix + toggleFeature, true, {
          maxAge: cookieExpiry,
        });
      }
    } else if (ctx.query.togglesOff) {
      const toggleFeature = ctx.query.togglesOff;
      // remove toggler of feature
      const validToggleFeature = validToggle(ctx.toggles, toggleFeature);
      if (
        validToggleFeature &&
        ctx.cookies.get(cookiePrefix + toggleFeature) === 'true'
      ) {
        ctx.cookies.set(cookiePrefix + toggleFeature, null);
      }
    }
  }
}

module.exports = withToggles;
