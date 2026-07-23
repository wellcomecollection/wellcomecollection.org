/**
 * This module fetches data from remote sources that:
 *
 *    - we need on every request/page
 *    - doesn't change very often
 *
 * e.g. default toggle values, or our opening hours.
 *
 * Because this data changes infrequently, it's helpful to cache it on
 * the server, than fetch it on every single request.  We do this by fetching
 * this data on a fixed interval, and saving it to a JSON file on the local disk.
 * When we need this data to serve a request, we read it from the JSON cache
 * rather than going back to the remote source.
 */

import { promises as fs } from 'fs';
import { GetServerSidePropsContext } from 'next';
import path from 'path';

import { getAllConsentStates } from '@weco/common/services/app/civic-uk';
import { Toggles, TogglesResp } from '@weco/toggles';

import prismicHandler from './prismic';
import togglesHandler, {
  getTogglesFromContext,
  parseToggleOverrides,
} from './toggles';
import { ServerData } from './types';

export type Handler<DefaultData, FetchedData> = {
  defaultValue: DefaultData;
  fetch: () => Promise<FetchedData>;
};

/**
 * This module will only run on the server side.
 * This check ensures we are not on the client, and throws an error explaining this.
 * The module would bork anyway as we would be trying to use fs, path etc
 * this would just make it easier to debug.
 */
if (typeof window !== 'undefined') {
  throw new Error('server-data module can only be used on the server-side');
}

const pathName = path.join(process.cwd(), '.server-data');
const minute = 60000;

const handlers = {
  toggles: togglesHandler,
  prismic: prismicHandler,
} as const;

type Key = keyof typeof handlers;
type DefaulVal<K extends Key> = (typeof handlers)[K]['defaultValue'];

async function read(key: Key, defaultValue: DefaulVal<Key>) {
  const fileName = path.join(pathName, `${key}.json`);
  try {
    const data = await fs.readFile(fileName, { encoding: 'utf-8' });
    return JSON.parse(data);
  } catch (e) {
    console.error(`Could not read ${fileName}`, e);
    return defaultValue;
  }
}

const timers = new Map<Key, NodeJS.Timeout>();
async function write(key: Key, fetch: () => Promise<DefaulVal<Key>>) {
  try {
    const data = await fetch();
    const fileName = path.join(pathName, `${key}.json`);
    await fs.mkdir(pathName, { recursive: true });

    // Write the JSON to a temp file, then rename it.  On most filesystems,
    // the rename is an atomic operation.
    //
    // This means that whenever you try to read ${key}.json, you'll always get
    // a valid JSON.  If we wrote directly to the file, you might get an
    // empty file or invalid JSON if you tried to read while we were writing.
    const tmpFileName = path.join(pathName, `${key}.json.tmp`);

    await fs.writeFile(tmpFileName, JSON.stringify(data));
    await fs.rename(tmpFileName, fileName);
  } catch (e) {
    // If we can't fetch the server data (e.g. because Prismic briefly times out),
    // we log an error and use the cached version of the data.
    console.error(
      `Could not update server data key '${key}'; waiting for next fetch interval`,
      e
    );
  }

  // We have to make sure this timer is set even if fetching the data fails
  // on a particular attempt, otherwise a single failure means a running app
  // will never fetch new server data again.
  const timer = setTimeout(() => {
    clearTimeout(timer);
    write(key, fetch);
  }, minute);

  timers.set(key, timer);
}

export async function init(): Promise<void> {
  await write('toggles', togglesHandler.fetch);
  await write('prismic', prismicHandler.fetch);
}

export function clear(): void {
  for (const [, timer] of timers) {
    clearTimeout(timer);
  }
}

/**
 * Read cached toggles from disk for use in API routes.
 * This is a lighter-weight alternative to getServerData for contexts
 * where you only need toggles and don't have a GetServerSidePropsContext.
 *
 * If the cache is empty (e.g., first request before cache is populated),
 * returns a minimal fallback configuration with the stagingApi toggle.
 */
export async function getCachedToggles(): Promise<TogglesResp> {
  // Use dynamic import to avoid circular dependency:
  // toggles.ts imports Handler from this file, so we can't import from toggles.ts at the top level
  const { fallbackTogglesForApiRoutes } = await import('./toggles');
  const togglesResp = await read('toggles', handlers.toggles.defaultValue);

  // Fallback to minimal toggle config if cache is empty
  if (togglesResp.featureFlags.length === 0) {
    return fallbackTogglesForApiRoutes;
  }

  return togglesResp;
}

/**
 * we should always keep the context here irrespective of if we use it
 * to ensure that we only ever run this in `getServerSideProps`, where
 * `fs`, `path`, and other server-side functionality is available
 */
export const getServerData = async (
  context: GetServerSidePropsContext
): Promise<ServerData> => {
  // Read the cached toggles and prismic data from disk (refreshed every minute)
  const togglesResp = await read('toggles', handlers.toggles.defaultValue);
  const prismic = await read('prismic', handlers.prismic.defaultValue);

  // Support ?toggle=someToggleName in the URL to enable a toggle via query param
  const { toggle } = context.query;
  const enableToggle: string | undefined =
    typeof toggle === 'string' ? toggle : undefined;

  // Support ?toggleOverride=id:value,id:value to override toggle state for this
  // render only, without writing any cookie. Lets two browser tabs render the
  // same page with different toggle states side by side.
  const overrides = parseToggleOverrides(context.query.toggleOverride);

  // Resolve toggle values from the cached config + user's cookies
  const { featureFlags, tests, modes } = getTogglesFromContext(
    togglesResp,
    context,
    overrides
  );

  // If a valid toggle was requested via query param, set a cookie and enable it
  const allToggleIds = [...Object.keys(featureFlags), ...Object.keys(tests)];
  const isEnableToggleValid = allToggleIds.some(id => id === enableToggle);

  if (enableToggle && isEnableToggleValid) {
    context.res.setHeader('Set-Cookie', `toggle_${enableToggle}=true; Path=/`);
    if (enableToggle in featureFlags) {
      featureFlags[enableToggle] = true;
    } else {
      tests[enableToggle] = true;
    }
  }

  // Read cookie consent status (analytics, marketing)
  const consentStatus = getAllConsentStates(context);

  const toggles: Toggles = { featureFlags, tests, modes };

  const serverData = {
    toggles,
    prismic,
    consentStatus,
  };

  return serverData;
};
