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
