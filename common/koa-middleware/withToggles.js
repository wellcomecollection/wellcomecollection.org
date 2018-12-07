const fetch = require('isomorphic-unfetch');

let defaultToggleValues = {};
async function getDefaultToggleValues() {
  try {
    const defaultValues = await fetch('https://dash.wellcomecollection.org/toggles/defaults.json')
      .then(response => response.json());

    defaultToggleValues = defaultValues;
  } catch (e) {}
}
setInterval(getDefaultToggleValues, 30000);

const parseCookies = function(req) {
  if (!req.headers.cookie) {
    return [];
  }

  return (req.headers.cookie).split(';').map(cookieString => {
    const keyVal = cookieString.split('=');
    const key = keyVal[0].trim();
    const value = keyVal[1].trim();

    return {key, value};
  });
};

function withToggles(ctx, next) {
  const cookies = parseCookies(ctx.req);
  const togglesCookies = cookies.filter(cookie => cookie.key.startsWith('toggle_'));
  const toggles = togglesCookies.reduce((acc, cookie) => {
    return Object.assign({}, acc, {
      [cookie.key.replace('toggle_', '')]: cookie.value === 'true'
    });
  }, {});

  ctx.toggles = Object.assign({}, defaultToggleValues, toggles);
  return next();
}

module.exports = withToggles;
