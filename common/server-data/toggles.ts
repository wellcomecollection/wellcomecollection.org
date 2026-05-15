import { getCookies } from 'cookies-next';
import { IncomingMessage } from 'http';

import { ContextValues, Toggles, TogglesResp } from '@weco/toggles';

import { Handler } from './';

const defaultValue = { toggles: [], tests: [], contexts: [] };

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

type Context = {
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
): { toggles: Toggles; contexts: ContextValues } {
  const isStage = context.req.headers.host?.startsWith('www-stage');
  const allCookies = getCookies(context);
  const toggles = [...togglesResp.toggles]
    .filter(toggle => {
      return !(!isStage && toggle.type === 'stage');
    })
    .reduce(
      (acc, toggle) => ({
        ...acc,
        [toggle.id]: {
          value:
            allCookies[`toggle_${toggle.id}`] === 'true'
              ? true
              : toggle.defaultValue,
          type: toggle.type,
        },
      }),
      {} as Toggles
    );
  const tests = [...togglesResp.tests].reduce((acc, test) => {
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
      [test.id]: {
        value: testToggleValue(test.id),
        type: 'test',
      },
    };
  }, {} as Toggles);

  const contexts = togglesResp.contexts.reduce((acc, ctx) => {
    const cookieValue = allCookies[`context_${ctx.id}`];
    let parsed: Record<string, unknown> | undefined;

    if (cookieValue) {
      try {
        parsed = JSON.parse(cookieValue);
      } catch {
        parsed = undefined;
      }
    }

    return {
      ...acc,
      [ctx.id]: parsed,
    };
  }, {} as ContextValues);

  return { toggles: { ...toggles, ...tests } as Toggles, contexts };
}

export default togglesHandler;
