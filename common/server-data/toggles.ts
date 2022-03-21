import cookies from 'next-cookies';
import { Toggles, TogglesResp } from '@weco/toggles';
import { Handler } from './';

const defaultValue = { toggles: [], tests: [] };

async function fetchToggles(): Promise<TogglesResp> {
  const resp = await fetch(
    'https://toggles.wellcomecollection.org/toggles.json'
  );
  const data = await resp.json();
  return data;
}

const togglesHandler: Handler<TogglesResp> = {
  defaultValue,
  fetch: fetchToggles,
};

/**
 * normally parsing like this should happen in `_app.parseServerDataToAppData`
 * but we need the `req` from the `context` for cookies which we don't
 * have in `_app` - so it lives here
 */
type CookiesContext = Parameters<typeof cookies>[0];
export function getTogglesFromContext(
  togglesResp: TogglesResp,
  context: CookiesContext
): Toggles {
  const allCookies = cookies(context);
  const toggles = [...togglesResp.toggles].reduce(
    (acc, toggle) => ({
      ...acc,
      [toggle.id]:
        allCookies[`toggle_${toggle.id}`] === 'true'
          ? true
          : toggle.defaultValue,
    }),
    {} as Toggles
  );
  const tests = [...togglesResp.tests].reduce(
    (acc, test) => ({
      ...acc,
      [test.id]: allCookies[`toggle_${test.id}`] === 'true',
    }),
    {} as Toggles
  );

  return { ...toggles, ...tests };
}

export default togglesHandler;
