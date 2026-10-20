import { getCookies } from 'cookies-next';
import { IncomingMessage } from 'http';

import {
  FeatureFlags,
  Modes,
  PhasedFlags,
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
    // Null-prototype map: the keys come from a user-controlled query param, so
    // avoid any chance of a crafted id (e.g. `__proto__`) touching the prototype.
    Object.create(null) as Record<string, string>
  );
}

/**
 * Parse a `?toggle=id,id:value` query param into a map of raw string values.
 * A bare id means 'true', so the long-standing `?toggle=someFlag` form still
 * works; `id:value` picks a phased flag's phase or a mode's option. Pairs are
 * comma-separated, so one link can set several toggles at once.
 */
export function parseTogglePresets(
  raw: string | string[] | undefined
): Record<string, string> {
  const value = Array.isArray(raw) ? raw.join(',') : raw;
  if (!value) return {};
  return value.split(',').reduce(
    (acc, pair) => {
      const separatorIndex = pair.indexOf(':');
      const id = (
        separatorIndex === -1 ? pair : pair.slice(0, separatorIndex)
      ).trim();
      const val =
        separatorIndex === -1 ? 'true' : pair.slice(separatorIndex + 1).trim();
      if (id) acc[id] = val;
      return acc;
    },
    // Null-prototype map for the same reason as parseToggleOverrides.
    Object.create(null) as Record<string, string>
  );
}

const isStageHost = (context: Context): boolean =>
  context.req.headers.host?.startsWith('www-stage') ?? false;

/**
 * Keeps only the presets that name a toggle available on this host, with a
 * value that toggle accepts - so a typo'd id or phase never gets written to a
 * cookie. Feature flags only accept 'true': a 'false' cookie resolves to the
 * flag's defaultValue, not false, so writing one would be misleading.
 */
export function validTogglePresets(
  presets: Record<string, string>,
  togglesResp: TogglesResp,
  context: Context
): Record<string, string> {
  const isStage = isStageHost(context);
  const isAvailable = (toggle: { type: string }) =>
    isStage || toggle.type !== 'stage';

  const acceptsValue = (id: string, value: string): boolean => {
    const featureFlag = togglesResp.featureFlags.find(f => f.id === id);
    if (featureFlag) return isAvailable(featureFlag) && value === 'true';

    if (togglesResp.tests.some(t => t.id === id)) {
      return value === 'true' || value === 'false';
    }

    const phasedFlag = togglesResp.phasedFlags?.find(f => f.id === id);
    if (phasedFlag) {
      return (
        isAvailable(phasedFlag) &&
        phasedFlag.phases.some(phase => phase.id === value)
      );
    }

    const mode = togglesResp.modes?.find(m => m.id === id);
    if (mode) return mode.options.some(option => option.id === value);

    return false;
  };

  return Object.entries(presets).reduce(
    (acc, [id, value]) => {
      if (acceptsValue(id, value)) acc[id] = value;
      return acc;
    },
    Object.create(null) as Record<string, string>
  );
}

const oneYearInSeconds = 365 * 24 * 60 * 60;

/**
 * `Set-Cookie` values for validated presets. These match what the toggles
 * dashboard writes (a year long, shared across *.wellcomecollection.org), so
 * a link from either place sets the same cookie and the dashboard can reset
 * it - a host-only cookie of the same name would sit alongside the dashboard's
 * one and leave it ambiguous which the server reads.
 */
export function togglePresetCookies(
  presets: Record<string, string>,
  host: string | undefined
): string[] {
  const isWellcomeHost =
    host?.split(':')[0].endsWith('wellcomecollection.org') ?? false;
  const attributes = [
    'Path=/',
    `Max-Age=${oneYearInSeconds}`,
    ...(isWellcomeHost ? ['Domain=.wellcomecollection.org', 'Secure'] : []),
  ].join('; ');

  return Object.entries(presets).map(
    ([id, value]) => `toggle_${id}=${encodeURIComponent(value)}; ${attributes}`
  );
}

/**
 * Resolves the current value of a toggle whose value is one of a list of
 * named option ids - a mode's option, or a phased flag's phase. Shared by
 * both, since "which one is currently picked" is the same operation for
 * either; what a phased flag does with that value afterwards (ranking it
 * ordinally via phaseIsAtLeast) happens elsewhere, not here.
 */
function resolveOptionValue(
  id: string,
  validIds: string[],
  overrides: Record<string, string>,
  allCookies: Partial<Record<string, string>>,
  fallback: string | null
): string | null {
  const override = overrides[id];
  if (typeof override === 'string' && validIds.includes(override)) {
    return override;
  }
  const cookieValue = allCookies[`toggle_${id}`];
  const isValid =
    typeof cookieValue === 'string' && validIds.includes(cookieValue);
  return isValid ? cookieValue : fallback;
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
  const isStage = isStageHost(context);
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

  const phasedFlagsList = (togglesResp.phasedFlags ?? []).filter(flag => {
    return !(!isStage && flag.type === 'stage');
  });
  const phasedFlags = phasedFlagsList.reduce((acc, flag) => {
    const current = resolveOptionValue(
      flag.id,
      flag.phases.map(phase => phase.id),
      overrides,
      allCookies,
      flag.defaultPhase
    );
    return {
      ...acc,
      [flag.id]: { current, phases: flag.phases, title: flag.title },
    };
  }, {} as PhasedFlags);

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
    const current = resolveOptionValue(
      mode.id,
      mode.options.map(opt => opt.id),
      overrides,
      allCookies,
      null
    );
    return { ...acc, [mode.id]: current };
  }, {} as Modes);

  return { featureFlags, phasedFlags, tests, modes };
}

export default togglesHandler;
