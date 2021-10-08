import path from 'path';
import { promises as fs } from 'fs';
import { Toggles, TogglesResp } from '@weco/toggles';
import { GetServerSidePropsContext } from 'next';
import cookies from 'next-cookies';
import { ServerData } from './model/server-data';

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

async function getToggles(): Promise<TogglesResp> {
  const fileName = path.join(pathName, 'toggles.json');
  try {
    const data = await fs.readFile(fileName, { encoding: 'utf-8' });
    return JSON.parse(data);
  } catch (e) {
    console.error(`Could not write ${fileName}`, e);
    // This is a default value for toggles
    return { toggles: [], tests: [] };
  }
}

async function writeToggles(): Promise<void> {
  const resp = await fetch(
    'https://toggles.wellcomecollection.org/toggles.json'
  );
  const data = await resp.json();
  const fileName = path.join(pathName, 'toggles.json');
  await fs.mkdir(pathName, { recursive: true });
  await fs.writeFile(fileName, JSON.stringify(data));
}

const minute = 60000;

async function initToggles() {
  await writeToggles();
  setTimeout(initToggles, minute);
}

/**
 * normally parsing like this should happen in `_app.parseServerDataToAppData`
 * but we need the `req` from the `context` for cookies which we don't
 * have in `_app` - so it lives here
 */
async function getTogglesFromContext(
  context: GetServerSidePropsContext
): Promise<Toggles> {
  const togglesResp = await getToggles();
  const allCookies = cookies(context);
  const toggles = [...togglesResp.toggles, ...togglesResp.tests].reduce(
    (acc, toggle) => ({
      ...acc,
      [toggle.id]:
        allCookies[`toggle_${toggle.id}`] === 'true' ?? toggle.defaultValue,
    }),
    {} as Toggles
  );
  return toggles;
}

export async function init() {
  await initToggles();
}

/**
 * we should always keep the context here irrespective of if we use it
 * to ensure that we only ever run this in `getServerSideProps`, where
 * `fs`, `path`, and other server-side functionality is available
 */
export const getServerData = async (
  context: GetServerSidePropsContext
): Promise<ServerData> => {
  const toggles = await getTogglesFromContext(context);
  const serverData = { toggles };
  return serverData;
};
