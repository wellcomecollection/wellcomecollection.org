const fetch = require('isomorphic-unfetch');
let allowableValues = { prod: [], staging: [] };

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
function getAllowedValuesEnum(json) {
  try {
    return json.paths['/works'].get.parameters.find(
      parameter => parameter.name === '_queryType'
    ).schema.enum;
  } catch {
    return [];
  }
}
async function getQueryType(staging = false) {
  try {
    const prodPromise = fetch(
      'https://api.wellcomecollection.org/catalogue/v2/swagger.json'
    );
    const stagingPromise = fetch(
      'https://api-stage.wellcomecollection.org/catalogue/v2/swagger.json'
    );
    const [prodResp, stagingResp] = await Promise.all([
      prodPromise,
      stagingPromise,
    ]);
    const [prodJson, stagingJson] = await Promise.all([
      prodResp.json(),
      stagingResp.json(),
    ]);
    allowableValues = {
      prod: getAllowedValuesEnum(prodJson),
      staging: getAllowedValuesEnum(stagingJson),
    };
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
  const stagingApiCookie = cookies.find(
    ({ key, value }) => key === 'toggle_stagingApi'
  );

  const validQueryTypeFromCookie =
    queryTypeCookie &&
    allowableValues[stagingApiCookie ? 'staging' : 'prod'].includes(
      queryTypeCookie.value
    )
      ? queryTypeCookie.value
      : null;

  const queryType =
    validQueryTypeFromCookie ||
    allowableValues[Math.floor(Math.random() * allowableValues.length)];

  if (!validQueryTypeFromCookie) {
    // This tells the browser to set the cookie
    // and acts as thought the cookie was already
    // set for the initial read of the value
    ctx.cookies.set('_queryType', queryType, { httpOnly: false });
    ctx.headers.cookie = `${ctx.headers.cookie}; _queryType=${queryType}`;
  }

  return next();
};
