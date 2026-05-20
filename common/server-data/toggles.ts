import { getCookies } from 'cookies-next';
import { IncomingMessage } from 'http';

import { FeatureFlags, Tests, Toggles, TogglesResp } from '@weco/toggles';

import { Handler } from './';

const defaultValue = { featureFlags: [], tests: [] };

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

export type Context = {
  req: IncomingMessage & {
    cookies: Partial<{
      [key: string]: string;
    }>;
  };
};

/**
 * normally parsing like this should happen in `_app.parseServerDataToAppData`
 * but we need the `req` from the `context` for cookies which we don't
 * have in `_app` - so it lives here
 */
export function getTogglesFromContext(
  togglesResp: TogglesResp,
  context: Context
): Toggles {
  const isStage = context.req.headers.host?.startsWith('www-stage');
  const allCookies = getCookies(context);
  const featureFlagsList = togglesResp.featureFlags ?? [];
  const featureFlags = featureFlagsList
    .filter(toggle => {
      return !(!isStage && toggle.type === 'stage');
    })
    .reduce(
      (acc, toggle) => ({
        ...acc,
        [toggle.id]:
          allCookies[`toggle_${toggle.id}`] === 'true'
            ? true
            : toggle.defaultValue,
      }),
      {} as FeatureFlags
    );
  const tests = togglesResp.tests.reduce((acc, test) => {
    function testToggleValue(Id: string): boolean | undefined {
      const cookieValue = allCookies[`toggle_${Id}`];
      switch (cookieValue) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return undefined;
      }
    }
    return {
      ...acc,
      [test.id]: testToggleValue(test.id),
    };
  }, {} as Tests);
  return { featureFlags, tests };
}

export default togglesHandler;
