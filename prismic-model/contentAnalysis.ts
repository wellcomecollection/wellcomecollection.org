import yargs from 'yargs';
import {
  downloadPrismicSnapshot,
  getPrismicDocuments,
} from './downloadSnapshot';
import fs from 'fs';
import { success } from './console';

const { type, report, printUrl } = yargs(process.argv.slice(2))
  .usage('Usage: $0 --type [string] --report [boolean] --printUrl [boolean]')
  .options({
    type: { type: 'string' },
    report: { type: 'boolean' },
    printUrl: { type: 'boolean' },
  })
  .parseSync();

async function main() {
  const snapshotDir = await downloadPrismicSnapshot();
  const matches = [];
  const contentTypeNamesOnPlatform = [];

  for (const result of getPrismicDocuments(snapshotDir)) {
    if (result.type) {
      if (!contentTypeNamesOnPlatform.includes(result.type))
        contentTypeNamesOnPlatform.push(result.type);
    }
  }

  const contentTypeCounter = new Map(
    contentTypeNamesOnPlatform.map(contentTypeName => [contentTypeName, 0])
  );

  for (const result of getPrismicDocuments(snapshotDir)) {
    if (result.type) {
      contentTypeCounter.set(
        result.type,
        contentTypeCounter.get(result.type) + 1
      );

      const isWithType: boolean = type ? result.type === type : true;

      if (isWithType) {
        matches.push({
          id: result.id,
          type: result.type,
          title: result.data.title?.[0]?.text || result.data.name, // The People type doesn't have a title
          ...(printUrl && {
            url: `http://wellcomecollection.org/${result.type}/${result.id}`,
          }),
        });
      }
    }
  }

  const contentTypesArray = Array.from(contentTypeCounter.entries());

  if (report) {
    await fs.writeFile('./contentReport.json', JSON.stringify(matches), err => {
      if (err) console.log(err);
      else {
        success('File written successfully');
      }
    });
    success('Reporting done!');
  }

  console.info(`=== Content Type count (${contentTypesArray.length}) ==`);
  contentTypesArray
    .sort((a, b) => a[1] - b[1])
    .forEach(entry =>
      console.info(`${String(entry[1]).padStart(6, ' ')}\t${entry[0]}`)
    );
  console.info('');

  if (type) {
    console.info(matches);
    console.info(`found ${matches.length}`);
  }
}

main();
