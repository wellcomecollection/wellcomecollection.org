/**
 * The Prismic API allows you to query your custom types in multiple ways†.
 * There is a limitation that you cannot query what content has what slices.
 * This is useful for finding where we have used slices, generally with the
 * aim to deprecate them.
 *
 * We use slices exclusively on the `body` property of our custom types,
 * so this script queries that.
 *
 * e.g. we notice we have a "Text" slice, but need to know if it's used.
 *
 * yarn sliceAnalysis --type text.
 *
 * Another aspect to slices is that you can label them. For instance we label images
 * in order to give them different weighting on the page. For this we run:
 *
 * yarn sliceAnalysis --label standalone
 *
 * This will return the IDs and titles of the content that use these slices, as well as the
 * number of matching pieces of content.
 *
 * This script will also give you a map of slice types => slice usage count
 *
 * †: https://prismic.io/docs/technologies/query-predicates-reference-rest-api
 * see: https://prismic.io/docs/core-concepts/slices
 */
import fs from 'fs';
import yargs from 'yargs';

import { components } from '@weco/common/views/slices';

import { success } from './console';
import {
  downloadPrismicSnapshot,
  getPrismicDocuments,
} from './downloadSnapshot';

const { type, report } = yargs(process.argv.slice(2))
  .usage('Usage: $0  --type [string] --report [boolean]')
  .options({
    type: { type: 'string' },
    report: { type: 'boolean' },
  })
  .parseSync();

type MatchesProps = {
  id: string;
  type: string;
  title: string;
  url: string;
  sliceCount?: number;
}[];

async function main() {
  const sliceNames = Object.keys(components);

  const sliceCounter = new Map(sliceNames.map(sliceName => [sliceName, 0]));
  // Create list made of the content type where the slice is used
  const contentTypeMatches: MatchesProps = [];
  // How often is the slice used in total on the website
  let slicesMatches = 0;
  // Get all the types where the slice is used
  const contentTypes: string[] = [];

  const snapshotDir = await downloadPrismicSnapshot();

  for (const result of getPrismicDocuments(snapshotDir)) {
    const hasSlices = !!result.data.body || !!result.data.slices;

    if (hasSlices) {
      // Not all slices are within the body (Exhibition guides' were built straight in)
      const slices = result.data.body || result.data.slices;

      for (const slice of slices) {
        const currentValue = sliceCounter.get(slice.slice_type) || 0;
        sliceCounter.set(slice.slice_type, currentValue + 1);
      }

      const isWithType: boolean = type
        ? slices.some(slice => slice.slice_type === type)
        : true;

      if (isWithType) {
        // Find how often the slice is used within the content type
        let nodeSliceCount = 0;
        slices
          .map(slice => {
            if (slice.slice_type === type) {
              slicesMatches++;
              nodeSliceCount++;
              return slice.slice_label;
            }
            return undefined;
          })
          .filter(f => f);

        contentTypes.push(result.type);

        contentTypeMatches.push({
          id: result.id,
          type: result.type,
          title: result.data.title[0].text,
          ...(type && {
            sliceCount: nodeSliceCount,
          }),
          url: `http://wellcomecollection.org/${result.type}/${result.id}`,
        });
      }
    }
  }

  // Filter which content types the slices are used in to remove duplicates
  const contentTFinal = contentTypes.filter(
    (c, i) => contentTypes.indexOf(c) === i
  );

  // Array listing all the slices we have and their count
  const slicesArray = Array.from(sliceCounter.entries());

  // Total count of all slices
  let totalSlices = 0;
  slicesArray.forEach(entry => {
    totalSlices = totalSlices + entry[1];
  });

  if (report) {
    await fs.writeFile(
      './sliceReport.json',
      JSON.stringify(contentTypeMatches),
      err => {
        if (err) console.log(err);
        else {
          success('File written successfully');
        }
      }
    );
    success('Reporting done!');
  }
  console.info(`=== Slice count (${slicesArray.length}) ==`);
  slicesArray
    .sort((a, b) => a[1] - b[1])
    .forEach(entry =>
      console.info(`${String(entry[1]).padStart(6, ' ')}\t${entry[0]}`)
    );
  console.info('');

  console.info(contentTypeMatches);
  console.info(
    `found ${
      slicesMatches ? slicesMatches + ' ' + type : totalSlices + ' slices'
    } in ${contentTypeMatches.length} ${contentTFinal.join(', ')}`
  );
}

main();
