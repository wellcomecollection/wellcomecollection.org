import path from 'path';
import { promises as fs } from 'fs';
import { GetServerSidePropsContext } from 'next';
import { ServerData } from './types';
import togglesHandler, { getTogglesFromContext } from './toggles';
import prismicHandler from './prismic';

export type Handler<Data> = {
  defaultValue: Data;
  fetch: () => Promise<Data>;
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
type DefaulVal<K extends Key> = typeof handlers[K]['defaultValue'];

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

const timers = new Map<Key, NodeJS.Timer>();
async function write(key: Key, fetch: () => Promise<DefaulVal<Key>>) {
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

  const timer = setTimeout(() => {
    clearTimeout(timer);
    write(key, fetch);
  }, minute);

  timers.set(key, timer);
}

export async function init() {
  await write('toggles', togglesHandler.fetch);
  await write('prismic', prismicHandler.fetch);
}

export function clear() {
  for (const [, timer] of timers) {
    clearTimeout(timer);
  }
}

/**
 * we should always keep the context here irrespective of if we use it
 * to ensure that we only ever run this in `getServerSideProps`, where
 * `fs`, `path`, and other server-side functionality is available
 */
export const getServerData = async (
  context: GetServerSidePropsContext
): Promise<ServerData> => {
  const togglesResp = await read('toggles', handlers.toggles.defaultValue);
  const prismic = await read('prismic', handlers.prismic.defaultValue);
  const { toggle } = context.query;

  const enableToggle: string | undefined =
    typeof toggle === 'string' ? toggle : undefined;

  const toggles = getTogglesFromContext(togglesResp, context);

  const isEnableToggleValid = Object.keys(toggles).some(
    id => id === enableToggle
  );

  if (enableToggle && isEnableToggleValid) {
    context.res.setHeader('Set-Cookie', `toggle_${enableToggle}=true; Path=/`);
    toggles[enableToggle] = true;
  }

  const serverData = { toggles, prismic };
  return serverData;
};
