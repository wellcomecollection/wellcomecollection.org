const fetch = require('isomorphic-unfetch');

let defaultToggleValues = {};
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
    const key = keyVal[0].trim();
    const value = keyVal[1].trim();

    return { key, value };
  });
};

function withToggles(ctx, next) {
  const cookies = parseCookies(ctx.req);
  const togglesCookies = cookies.filter(cookie =>
    cookie.key.startsWith('toggle_')
  );
  const toggles = togglesCookies.reduce((acc, cookie) => {
    return Object.assign({}, acc, {
      [cookie.key.replace('toggle_', '')]: cookie.value === 'true',
    });
  }, {});

  ctx.toggles = { ...defaultToggleValues, ...toggles };
  return next();
}

module.exports = withToggles;
