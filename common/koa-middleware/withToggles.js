const fetch = require('isomorphic-unfetch');
let defaultToggleValues = {};
const cookiePrefix = 'toggle_';
const cookieExpiry = 31536000;

const validToggle = (toggles, featureToggle) => {
  if (featureToggle.startsWith('!')) {
    const featureToggleName = featureToggle.substr(1, featureToggle.length);
    return Object.keys(toggles).includes(featureToggleName);
  }
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
const interval = setInterval(getDefaultToggleValues, 2 * 60 * 1000); // 2 minutes

const parseCookies = function (req) {
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
  enableDisableToggle(ctx);
  return next();
}

function enableDisableToggle(ctx) {
  if (ctx && ctx.toggles) {
    if (ctx.query.toggle) {
      const reqFeatureToggle = ctx.query.toggle;
      const featureToggleName = reqFeatureToggle.replace(/^!/, '');
      const validFeatureToggle = validToggle(ctx.toggles, reqFeatureToggle);
      const stateFeatureToggle = !reqFeatureToggle.startsWith('!');
      const cookieName = `${cookiePrefix}${featureToggleName}`;

      if (validFeatureToggle) {
        if (stateFeatureToggle) {
          ctx.cookies.set(cookieName, true, {
            maxAge: cookieExpiry,
            httpOnly: false,
          });
          // Make sure we update toggles context so the toggle renders onload first time
          ctx.toggles[featureToggleName] = true;
        } else {
          // make sure the toggle gets updated to original default
          ctx.toggles[featureToggleName] =
            defaultToggleValues[featureToggleName];
          ctx.cookies.set(cookieName, null);
        }
      }
    }
  }
}

const withTogglesModule = (module.exports = withToggles);
withTogglesModule.enableDisableToggle = enableDisableToggle;
withTogglesModule.interval = interval;
