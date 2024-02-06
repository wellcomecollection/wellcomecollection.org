const fs = require('fs');
const mkdirp = require('mkdirp-promise');
const pa11y = require('pa11y');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const events = require('events');

events.EventEmitter.defaultMaxListeners = 25;

console.info('Pa11y: Starting report');

const baseUrl = 'https://wellcomecollection.org';

// Note: if you add a URL to this list, make sure to also add it to the list
// of URLs checked by the URL checker.
//
// See .buildkite/urls/expected_200_urls.txt
//
const urls = [
  '/',
  '/visit-us',
  '/whats-on',
  '/collections',
  '/stories',
  '/articles/WyjHUicAACvGnmJI',
  '/articles/W8ivQRAAAJFijw1h',
  '/works/cjwep3ze?query=health&page=1',
  '/works/e7vav3ss/items?page=1&canvas=1',
  '/works/d2mach47',
  '/what-we-do',
  '/series/WsSUrR8AAL3KGFPF',
  '/exhibitions/XOVfTREAAOJmx-Uw',
  '/events/Wqkd1yUAAB8sW4By',
  '/event-series/WlYT_SQAACcAWccj',
  '/concepts/n4fvtc49',
  '/guides/YL9OAxIAAB8AHsyv',
  '/visual-stories/ZU4FRhIAACYAUvi8',

  // This is a comic using the new (as of November 2022) approach to
  // comic frames and navigation between issues.
  '/articles/YzQT_BEAANURiuK9',

  // Exhibition guides.  We should test one example of each guide format.
  '/guides/exhibitions/YzwsAREAAHylrxau/audio-without-descriptions',
  '/guides/exhibitions/YzwsAREAAHylrxau/captions-and-transcripts',
  '/guides/exhibitions/YzwsAREAAHylrxau/bsl',

  // Search pages, overview + with one of each
  '/search?query=human',
  '/search/stories?query=human',
  '/search/images?query=human',
  '/search/works?query=human',
].map(u => `${baseUrl}${u}`);

const promises = urls.map(url =>
  pa11y(url, {
    timeout: 120000,
    chromeLaunchConfig: {
      args: ['--no-sandbox'],
    },
  })
);

Promise.all(promises)
  .then(async results => {
    await mkdirp('./.dist');
    await writeFile('./.dist/report.json', JSON.stringify({ results }));
    console.info('Reporting done!');
  })
  .catch(e => console.info(e));
