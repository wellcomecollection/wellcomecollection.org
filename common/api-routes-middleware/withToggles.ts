import { NextApiRequest, NextApiResponse } from 'next';
import { Toggles } from '@weco/toggles';

export type NextApiRequestWithToggles = NextApiRequest & {
  toggles: Toggles;
};
const cookiePrefix = 'toggle_';
let defaultToggleValues = {};

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
setInterval(getDefaultToggleValues, 2 * 60 * 1000);
const withToggles = handler => {
  return async (
    req: NextApiRequestWithToggles,
    res: NextApiResponse
  ): Promise<void> => {
    const cookies = parseCookies(req);
    const togglesCookies = cookies.filter(cookie =>
      cookie.key.startsWith(cookiePrefix)
    );
    const toggles = togglesCookies.reduce((acc, cookie) => {
      return Object.assign({}, acc, {
        [cookie.key.replace(cookiePrefix, '')]: cookie.value === 'true',
      });
    }, {});
    req.toggles = { ...defaultToggleValues, ...toggles };
    return handler(req, res);
  };
};

export default withToggles;
