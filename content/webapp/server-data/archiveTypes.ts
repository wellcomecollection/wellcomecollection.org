/**
 * Archive type counts (from the catalogue API's archives-by-type
 * aggregation - see services/wellcome/catalogue/archiveTypes.ts).
 * These are needed on more than one page, change only rarely,
 * and only need to be accurate to within a day.
 *
 * Rather than fetching them on every request, this follows the same
 * approach as @weco/common/server-data (see its README): fetch once on an
 * interval and cache to disk, reading the cache to serve requests. This is
 * a separate, content-webapp-only cache rather than an addition to the
 * shared module, since identity has no use for this data and a daily
 * interval doesn't fit that module's fixed one-minute refresh loop.
 */
import { promises as fs } from 'fs';
import path from 'path';

import {
  ArchiveType,
  fetchArchiveTypes as fetchArchiveTypesFromCatalogue,
} from '@weco/content/services/wellcome/catalogue/archiveTypes';

if (typeof window !== 'undefined') {
  throw new Error(
    'content/webapp/server-data/archiveTypes module can only be used on the server-side'
  );
}

const day = 24 * 60 * 60 * 1000;
const fileName = path.join(process.cwd(), '.server-data', 'archiveTypes.json');
const tmpFileName = `${fileName}.tmp`;

let timer: NodeJS.Timeout | undefined;

async function write(): Promise<void> {
  try {
    const data = await fetchArchiveTypesFromCatalogue();
    await fs.mkdir(path.dirname(fileName), { recursive: true });

    // Write to a temp file then rename, so a concurrent read never sees a
    // half-written file (rename is atomic on most filesystems).
    await fs.writeFile(tmpFileName, JSON.stringify(data));
    await fs.rename(tmpFileName, fileName);
  } catch (e) {
    console.error(
      'Could not update cached archive types; keeping the existing cache until the next daily fetch',
      e
    );
  }

  // Set the next timer even on failure, so one bad fetch doesn't stop
  // future attempts.
  timer = setTimeout(() => {
    clearTimeout(timer);
    write();
  }, day);
}

export async function init(): Promise<void> {
  await write();
}

export function clear(): void {
  if (timer) clearTimeout(timer);
}

export async function getArchiveTypes(): Promise<ArchiveType[]> {
  try {
    const data = await fs.readFile(fileName, { encoding: 'utf-8' });
    return JSON.parse(data);
  } catch (e) {
    console.error(`Could not read cached archive types from ${fileName}`, e);
    return [];
  }
}
