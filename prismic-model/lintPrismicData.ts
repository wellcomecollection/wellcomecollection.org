/** This script runs some linting rules against a snapshot of Prismic.
 *
 * It's meant to help us find issues in the data that need to be fixed in
 * Prismic.  Unfortunately Prismic itself doesn't allow us to configure
 * this linting directly in the CMS, so we have to run it against a snapshot.
 *
 * See https://prismic.io/blog/required-fields
 */

import fs from 'fs';
import chalk from 'chalk';
import { error } from './console';
import { downloadPrismicSnapshot } from './downloadSnapshot';

/** Returns a list of all the Prismic documents in a given snapshot directory. */
function getPrismicDocuments(snapshotDir: string): any[] {
  const documents: any[] = [];

  fs.readdirSync(snapshotDir).forEach(file => {
    const data = fs.readFileSync(`${snapshotDir}/${file}`);
    const json: { results: any[] } = JSON.parse(data.toString());

    documents.push(...json.results);
  });

  return documents;
}

// Look for eur01 safelinks.  These occur when somebody has copied
// a URL directly from Outlook and isn't using the original URL.
//
// This is a very crude check; we could recurse further down into
// the object to get more debugging information, but I hope this
// is good enough for now.
function detectEur01Safelinks(doc: any): string[] {
  if (
    JSON.stringify(doc).indexOf(
      'https://eur01.safelinks.protection.outlook.com'
    ) !== -1
  ) {
    return ['- eur01 safelinks URL detected!'];
  }

  return [];
}

async function run() {
  const snapshotDir = await downloadPrismicSnapshot();

  for (const doc of getPrismicDocuments(snapshotDir)) {
    const errors = detectEur01Safelinks(doc);

    // If there are any errors, report them to the console.
    if (errors.length > 0) {
      console.log(
        chalk.blue(
          `https://wellcomecollection.prismic.io/documents~b=working&c=published&l=en-gb/${doc.id}/`
        )
      );
      for (const msg of errors) {
        console.log(msg);
      }
      console.log('');
    }
  }
}

run().catch(err => {
  error(err);
  process.exit(1);
});
