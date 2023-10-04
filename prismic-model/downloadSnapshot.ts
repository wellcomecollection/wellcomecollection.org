/** This script downloads all the Prismic content to a local snapshot.
 *
 * This is useful for doing bulk analysis of the Prismic data, or looking for
 * specific examples of a particular slice of feature in use.
 */

import fs from 'fs';
import { error, success } from './console';
import { createClient as createPrismicClient } from '@weco/common/services/prismic/fetch';

/** Returns a list of all the Prismic documents in a given snapshot directory. */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function getPrismicDocuments(snapshotFile: string): any[] {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return JSON.parse(fs.readFileSync(snapshotFile).toString());
}

/** Downloads the snapshots for a given ref to a local directory.
 *
 * Returns the path to the snapshot file.
 */
export async function downloadPrismicSnapshot(): Promise<string> {
  const client = createPrismicClient();

  const refId = (await client.getMasterRef()).ref;

  const snapshotFile = `snapshot.${refId}.json`;

  if (fs.existsSync(snapshotFile)) {
    return snapshotFile;
  }

  console.log(`Prismic master ref is ${refId}`);
  const documents = await client.dangerouslyGetAll();

  fs.writeFileSync(snapshotFile, JSON.stringify(documents, null, 2));

  success(`Downloaded Prismic snapshot to ${snapshotFile}`);
  return snapshotFile;
}

if (require.main === module) {
  downloadPrismicSnapshot().catch(err => {
    error(err);
    process.exit(1);
  });
}
