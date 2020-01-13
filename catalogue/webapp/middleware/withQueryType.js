const fetch = require('isomorphic-unfetch');
let allowableValues = [];

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

async function getQueryType() {
  try {
    const resp = await fetch(
      'https://api.wellcomecollection.org/catalogue/v2/swagger.json'
    );
    const json = await resp.json();
    allowableValues = json.paths['/works'].get.parameters.find(
      parameter => parameter.name === '_queryType'
    ).schema.enum;
  } catch (e) {
    console.info(e);
  }
}
getQueryType();
setInterval(getQueryType, 2 * 60 * 1000); // 2 minutes

module.exports = function withQueryType(ctx, next) {
  const cookies = parseCookies(ctx.req);
  const queryTypeCookie = cookies.find(
    ({ key, value }) => key === '_queryType'
  );
  const validQueryTypeFromCookie =
    queryTypeCookie && allowableValues.includes(queryTypeCookie.value)
      ? queryTypeCookie.value
      : null;

  const queryType =
    validQueryTypeFromCookie ||
    allowableValues[Math.floor(Math.random() * allowableValues.length)];

  if (!validQueryTypeFromCookie) {
    ctx.cookies.set('_queryType', queryType);
  }

  ctx.query._queryType = queryType;

  return next();
};
