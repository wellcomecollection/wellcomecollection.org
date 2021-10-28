/**
 * The Prismic API allows you to query your custom types in multiple ways†.
 * There is a limitation that you cannot query what content has what slices.
 * This is useful for finding where we have used slices, generally with the
 * aim to deprecate them.
 *
 * Where use slices exclusively on the `body` property of our custom types,
 * so this script queries that.
 *
 * e.g. we notice we have a "Discussion" slice, but need to know if it's used.
 *
 * yarn contentHasSlice --type discussion.
 *
 * Another aspect to slices is that you can label them. For instance we label images
 * in order to give them different weighting on the page. For this we run:
 *
 * yarn contentHasSlice --label standalone
 *
 * This will return the IDs and titles of the content, as well as the size of the content list.
 *
 * †: https://prismic.io/docs/technologies/query-predicates-reference-rest-api
 * see: https://prismic.io/docs/core-concepts/slices
 */
import Prismic from '@prismicio/client';
import yargs from 'yargs';

const { label, type } = yargs(process.argv.slice(2)).usage(
  'Usage: $0 --label [string] --type [string]'
).argv;

let a;
async function api() {
  if (!a) {
    a = await Prismic.getApi(
      'https://wellcomecollection.cdn.prismic.io/api/v2'
    );
  }

  return a;
}

async function* getAllResults() {
  let response = await (await api()).query('', { pageSize: 100 });

  while (true) {
    const results = response.results;

    if (results.length === 0) {
      break;
    }

    for (const result of results) {
      yield result;
    }

    if (!response.next_page) {
      break;
    }

    response = await (
      await api()
    ).query('', { pageSize: 100, page: response.page + 1 });
  }
}

async function main() {
  const matches = [];

  for await (const result of getAllResults()) {
    if (result.data.body) {
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
          title: result.data.title[0].text,
        });
      }
    }
  }
  console.info(matches);
  console.info(`found ${matches.length}`);
}

main();
