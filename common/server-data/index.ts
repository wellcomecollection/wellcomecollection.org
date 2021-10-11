import path from 'path';
import { promises as fs } from 'fs';
import { GetServerSidePropsContext } from 'next';
import { ServerData } from '../model/server-data';
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

const dataKeys = ['prismic', 'toggles'] as const;
export type DataKey = typeof dataKeys[number];

async function read(key, defaultValue) {
  const fileName = path.join(pathName, `${key}.json`);
  try {
    const data = await fs.readFile(fileName, { encoding: 'utf-8' });
    return JSON.parse(data);
  } catch (e) {
    console.error(`Could not read ${fileName}`, e);
    return defaultValue;
  }
}

async function write(key, fetch) {
  const data = await fetch();
  const fileName = path.join(pathName, `${key}.json`);
  await fs.mkdir(pathName, { recursive: true });
  await fs.writeFile(fileName, JSON.stringify(data));

  setTimeout(() => {
    write(key, fetch);
  }, minute);
}

const handlers = {
  toggles: togglesHandler,
  prismic: prismicHandler,
};
export async function init() {
  await write('toggles', togglesHandler.fetch);
  await write('prismic', prismicHandler.fetch);
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
  const toggles = getTogglesFromContext(togglesResp, context);
  const prismic = await read('prismic', handlers.prismic.defaultValue);
  const serverData = { toggles, prismic };
  return serverData;
};
