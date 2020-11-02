const fetch = require('isomorphic-unfetch');
let defaultToggleValues = {};
const prefixName = 'toggle_';
const cookieExpiry = 31536000;

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
    cookie.key.startsWith(prefixName)
  );
  const toggles = togglesCookies.reduce((acc, cookie) => {
    return Object.assign({}, acc, {
      [cookie.key.replace(prefixName, '')]: cookie.value === 'true',
    });
  }, {});

  ctx.toggles = { ...defaultToggleValues, ...toggles };
  enableDisableToggler(ctx);
  return next();
}

function enableDisableToggler(ctx) {
  const validToggle = (toggles, toggleItem) => {
    return Object.keys(toggles).filter(toggle => {
      return toggle === toggleItem;
    });
  };

  if (ctx.toggles) {
    // enable toggler of feature
    if (ctx.query.toggler_test) {
      const toggleFeature = ctx.query.toggler_test;
      const validToggleFeature = validToggle(ctx.toggles, toggleFeature);
      if (validToggleFeature.length) {
        ctx.cookies.set(prefixName + toggleFeature, true, {
          maxAge: cookieExpiry,
        });
      }
    } else if (ctx.query.toggler_test_off) {
      const toggleFeature = ctx.query.toggler_test_off;
      // remove toggler of feature
      const validToggleFeature = validToggle(ctx.toggles, toggleFeature);
      if (
        validToggleFeature.length &&
        ctx.cookies.get(prefixName + toggleFeature) === 'true'
      ) {
        ctx.cookies.set(prefixName + toggleFeature, null);
      }
    }
  }
}

module.exports = withToggles;
