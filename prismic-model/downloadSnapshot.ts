/** This script downloads all the Prismic content to a local snapshot.
 *
 * This is useful for doing bulk analysis of the Prismic data, or looking for
 * specific examples of a particular slice of feature in use.
 */

import fs from 'fs';
import fetch from 'node-fetch';
import { error, success } from './console';

/** Gets the Prismic API ref for a given id (e.g. 'master')
 *
 * See https://prismic.io/docs/technologies/introduction-to-the-content-query-api#prismic-api-ref
 */
async function getPrismicApiRefById(id: string): Promise<string> {
  const resp = await fetch('https://wellcomecollection.cdn.prismic.io/api');

  type RootResponse = {
    refs: [{ id: string; ref: string }];
  };

  const json: RootResponse = await resp.json();

  return json.refs.find(r => r.id === id).ref;
}

type ApiResponse = {
  pageNumber: number;
  json: any;
};

/** Generates the paginated API responses for a given reference. */
async function* getApiResponses(ref: string): AsyncGenerator<ApiResponse> {
  // Get as many results as we can per page, to reduce the number of requests.
  // pageSize = 100 is the max allowed at time of writing.
  //
  // See https://prismic.io/docs/technologies/pagination-for-results-rest-api#the-pagesize-parameter
  const pageSize = 100;

  let url = `https://wellcomecollection.cdn.prismic.io/api/v2/documents/search?ref=${ref}&pageSize=${pageSize}`;

  while (url !== null) {
    const resp = await fetch(url);
    const json = await resp.json();
    const pageNumber: number = json.page;

    yield { pageNumber, json };

    url = json.next_page;
  }
}

/** Downloads the snapshots for a given ref to a local directory.
 *
 * Returns the path to the snapshot directory.
 */
export async function downloadPrismicSnapshot(
  refId = 'master'
): Promise<string> {
  const ref = await getPrismicApiRefById(refId);
  const snapshotDir = `snapshot.${refId}.${ref}`;

  if (fs.existsSync(snapshotDir)) {
    return snapshotDir;
  }

  console.log(`Prismic master ref is ${ref}`);

  const tmpDir = `${snapshotDir}.tmp`;
  fs.mkdir(tmpDir, err => {
    if (err && err.code !== 'EEXIST') {
      throw err;
    }
  });

  for await (const { pageNumber, json } of getApiResponses(ref)) {
    console.log(`Downloading page ${pageNumber}...`);
    fs.writeFileSync(
      `${tmpDir}/page${pageNumber}.json`,
      JSON.stringify(json, null, 2)
    );
  }

  fs.renameSync(tmpDir, snapshotDir);

  success(`Downloaded Prismic snapshot to ${snapshotDir}`);
  return snapshotDir;
}

if (require.main === module) {
  downloadPrismicSnapshot().catch(err => {
    error(err);
    process.exit(1);
  });
}
