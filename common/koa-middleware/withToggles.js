const fetch = require('isomorphic-unfetch');
let defaultToggleValues = {};
const cookiePrefix = 'toggle_';
const cookieExpiry = 31536000;

const validToggle = (toggles, featureToggle) => {
  return Object.keys(toggles).includes(featureToggle);
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
  if (ctx && ctx.toggles) {
    // enable toggler of feature
    if (ctx.query.toggles) {
      const reqFeatureToggle = ctx.query.toggles;
      // remove toggler feature
      if (reqFeatureToggle.startsWith('!')) {
        const nameFeatureToggle = reqFeatureToggle.substr(
          1,
          reqFeatureToggle.length
        );

        if (
          validToggle(ctx.toggles, nameFeatureToggle) &&
          ctx.cookies.get(cookiePrefix + nameFeatureToggle) === 'true'
        ) {
          // remove cookie
          ctx.cookies.set(cookiePrefix + nameFeatureToggle, null);
        }
      } else {
        // enable toggler feature
        if (validToggle(ctx.toggles, reqFeatureToggle)) {
          ctx.cookies.set(cookiePrefix + reqFeatureToggle, true, {
            maxAge: cookieExpiry,
          });
        }
      }
    }
  }
}

module.exports = withToggles;
