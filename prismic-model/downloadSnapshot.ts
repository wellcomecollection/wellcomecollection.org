/** This script downloads all the Prismic content to a local snapshot.
 *
 * This is useful for doing bulk analysis of the Prismic data, or looking for
 * specific examples of a particular slice of feature in use.
 */

import fs from 'fs';
import fetch from 'node-fetch';
import { error, success } from './console';

async function getMasterRef(): Promise<string> {
  const resp = await fetch('https://wellcomecollection.cdn.prismic.io/api');

  type RootResponse = {
    refs: [{ id: string; ref: string }];
  };

  const json: RootResponse = await resp.json();

  return json.refs.find(r => r.id === 'master').ref;
}

type ApiResponse = {
  pageNumber: number;
  json: any;
};

async function* getApiResponses(
  masterRef: string
): AsyncGenerator<ApiResponse> {
  const pageSize = 100;
  let url = `https://wellcomecollection.cdn.prismic.io/api/v2/documents/search?ref=${masterRef}&pageSize=${pageSize}`;

  while (url !== null) {
    const resp = await fetch(url);
    const json = await resp.json();
    const pageNumber: number = json.page;

    yield { pageNumber, json };

    url = json.next_page;
  }
}

export async function downloadPrismicSnapshot(): Promise<string> {
  const masterRef = await getMasterRef();
  const snapshotDir = `snapshot.${masterRef}`;

  if (fs.existsSync(snapshotDir)) {
    return snapshotDir;
  }

  console.log(`Prismic master ref is ${masterRef}`);

  const tmpDir = `${snapshotDir}.tmp`;
  fs.mkdir(tmpDir, err => {
    if (err && err.code !== 'EEXIST') {
      throw err;
    }
  });

  for await (const { pageNumber, json } of getApiResponses(masterRef)) {
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
