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

  ctx.toggles = {...toggles, help: 1};

  return next();
}

module.exports = withToggles;
