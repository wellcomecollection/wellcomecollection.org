const fs = require('fs');
const mkdirp = require('mkdirp-promise');
const pa11y = require('pa11y');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

console.info('Pa11y: Starting report');
const urls = [
  'https://wellcomecollection.org',
  'https://wellcomecollection.org/visit-us',
  'https://wellcomecollection.org/whats-on',
  'https://wellcomecollection.org/stories',
  'https://wellcomecollection.org/articles/WyjHUicAACvGnmJI',
  'https://wellcomecollection.org/articles/W8ivQRAAAJFijw1h',
  'https://wellcomecollection.org/works',
  'https://wellcomecollection.org/works?query=health',
  'https://wellcomecollection.org/works/cjwep3ze?query=health&page=1',
  'https://wellcomecollection.org/works/e7vav3ss/items?page=1&canvas=1&sierraId=b28136615&langCode=eng',
  'https://wellcomecollection.org/what-we-do',
  'https://wellcomecollection.org/series/WsSUrR8AAL3KGFPF',
  'https://wellcomecollection.org/exhibitions/XOVfTREAAOJmx-Uw',
  'https://wellcomecollection.org/events/Wqkd1yUAAB8sW4By',
  'https://wellcomecollection.org/event-series/WlYT_SQAACcAWccj',
  'https://wellcomecollection.org/concepts/n4fvtc49',
  'https://wellcomecollection.org/works/a2239muq/items',
];

const promises = urls.map(url =>
  pa11y(url, {
    chromeLaunchConfig: {
      args: ['--no-sandbox'],
    },
  })
);

Promise.all(promises).then(async results => {
  await mkdirp('./.dist');
  await writeFile('./.dist/report.json', JSON.stringify({ results }));
  console.info('Reporting done!');
});
