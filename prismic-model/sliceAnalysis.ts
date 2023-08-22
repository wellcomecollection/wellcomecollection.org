/**
 * The Prismic API allows you to query your custom types in multiple ways†.
 * There is a limitation that you cannot query what content has what slices.
 * This is useful for finding where we have used slices, generally with the
 * aim to deprecate them.
 *
 * We use slices exclusively on the `body` property of our custom types,
 * so this script queries that.
 *
 * e.g. we notice we have a "Discussion" slice, but need to know if it's used.
 *
 * yarn sliceAnalysis --type discussion.
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
import yargs from 'yargs';
import { body, articleBody, visualStoryBody } from './src/parts/bodies';
import {
  downloadPrismicSnapshot,
  getPrismicDocuments,
} from './downloadSnapshot';

const { label, type } = yargs(process.argv.slice(2))
  .usage('Usage: $0 --label [string] --type [string]')
  .options({
    label: { type: 'string' },
    type: { type: 'string' },
  })
  .parseSync();

async function main() {
  const sliceNames = Object.keys(articleBody.config.choices).concat(
    Object.keys(body.config.choices),
    Object.keys(visualStoryBody.config.choices)
  );

  const sliceCounter = new Map(sliceNames.map(sliceName => [sliceName, 0]));
  const matches = [];

  const snapshotDir = await downloadPrismicSnapshot();

  for (const result of getPrismicDocuments(snapshotDir)) {
    if (result.data.body) {
      for (const slice of result.data.body) {
        sliceCounter.set(
          slice.slice_type,
          sliceCounter.get(slice.slice_type) + 1
        );
      }

      const isWithType: boolean = type
        ? result.data.body.some(slice => slice.slice_type === type)
        : true;

      const isWithLabel: boolean = label
        ? result.data.body.some(slice => slice.slice_label === label)
        : true;

      if (isWithType && isWithLabel) {
        matches.push({
          id: result.id,
          type: result.type,
          format: result.data.format?.slug,
          title: result.data.title[0].text,
        });
      }
    }
  }

  const slicesArray = Array.from(sliceCounter.entries());

  console.info(`=== Slice count (${slicesArray.length}) ==`);
  slicesArray
    .sort((a, b) => a[1] - b[1])
    .forEach(entry =>
      console.info(`${String(entry[1]).padStart(6, ' ')}\t${entry[0]}`)
    );
  console.info('');

  console.info(matches);
  console.info(`found ${matches.length}`);
}

main();
