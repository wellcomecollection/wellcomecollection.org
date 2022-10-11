import { getCookies } from 'cookies-next';
import { Toggles, TogglesResp } from '@weco/toggles';
import { Handler } from './';
import { NextApiRequest, NextApiResponse } from 'next';

const defaultValue = { toggles: [], tests: [] };

async function fetchToggles(): Promise<TogglesResp> {
  const resp = await fetch(
    'https://toggles.wellcomecollection.org/toggles.json'
  );
  const data = await resp.json();
  return data;
}

const togglesHandler: Handler<TogglesResp, TogglesResp> = {
  defaultValue,
  fetch: fetchToggles,
};

type Context = { req: NextApiRequest; res: NextApiResponse };

/**
 * normally parsing like this should happen in `_app.parseServerDataToAppData`
 * but we need the `req` from the `context` for cookies which we don't
 * have in `_app` - so it lives here
 */
export function getTogglesFromContext(
  togglesResp: TogglesResp,
  context: Context
): Toggles {
  const allCookies = getCookies(context);
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
