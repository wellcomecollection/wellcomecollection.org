import { getCookies } from 'cookies-next';
import { IncomingMessage } from 'http';

import {
  FeatureFlags,
  Modes,
  Tests,
  Toggles,
  TogglesResp,
} from '@weco/toggles';

import { Handler } from './';

const defaultValue = { featureFlags: [], tests: [], modes: [] };

/**
 * Fallback toggle config for API routes when the cache is unavailable.
 * This matches the stagingApi toggle definition from toggles/webapp/toggles.ts
 * but in the published format (defaultValue instead of initialValue).
 */
export const fallbackTogglesForApiRoutes: TogglesResp = {
  featureFlags: [
    {
      id: 'stagingApi',
      title: 'Staging API',
      defaultValue: false,
      description: 'Use the staging Wellcome APIs',
      type: 'permanent',
    },
  ],
  tests: [],
  modes: [],
};

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
 * Parse a `?toggleOverride=id:value,id:value` query param into a map of raw
 * string values. Used to override toggle state for a single render without
 * writing any cookie (see getTogglesFromContext). Malformed pairs are skipped.
 */
export function parseToggleOverrides(
  raw: string | string[] | undefined
): Record<string, string> {
  const value = Array.isArray(raw) ? raw.join(',') : raw;
  if (!value) return {};
  return value.split(',').reduce(
    (acc, pair) => {
      const separatorIndex = pair.indexOf(':');
      if (separatorIndex === -1) return acc;
      const id = pair.slice(0, separatorIndex).trim();
      const val = pair.slice(separatorIndex + 1).trim();
      if (id) acc[id] = val;
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * normally parsing like this should happen in `_app.parseServerDataToAppData`
 * but we need the `req` from the `context` for cookies which we don't
 * have in `_app` - so it lives here
 */
export function getTogglesFromContext(
  togglesResp: TogglesResp,
  context: Context,
  // Render-only overrides from `?toggleOverride=` (see parseToggleOverrides).
  // These take precedence over cookies for this render and are never persisted.
  overrides: Record<string, string> = {}
): Toggles {
  const isStage = context.req.headers.host?.startsWith('www-stage');
  const allCookies = getCookies(context);
  const featureFlagsList = togglesResp.featureFlags ?? [];
  const featureFlags = featureFlagsList
    .filter(toggle => {
      return !(!isStage && toggle.type === 'stage');
    })
    .reduce((acc, toggle) => {
      const override = overrides[toggle.id];
      const value =
        override === 'true'
          ? true
          : override === 'false'
            ? false
            : allCookies[`toggle_${toggle.id}`] === 'true'
              ? true
              : toggle.defaultValue;
      return { ...acc, [toggle.id]: value };
    }, {} as FeatureFlags);
  const tests = togglesResp.tests.reduce((acc, test) => {
    function testToggleValue(Id: string): boolean | undefined {
      const override = overrides[Id];
      if (override === 'true') return true;
      if (override === 'false') return false;
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

  const modesList = togglesResp.modes ?? [];
  const modes = modesList.reduce((acc, mode) => {
    const override = overrides[mode.id];
    if (
      typeof override === 'string' &&
      mode.options.some(opt => opt.id === override)
    ) {
      return { ...acc, [mode.id]: override };
    }
    const cookieValue = allCookies[`toggle_${mode.id}`];
    const isValid =
      typeof cookieValue === 'string' &&
      mode.options.some(opt => opt.id === cookieValue);
    return {
      ...acc,
      [mode.id]: isValid ? cookieValue : null,
    };
  }, {} as Modes);

  return { featureFlags, tests, modes };
}

export default togglesHandler;
