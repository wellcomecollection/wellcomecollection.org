const chalk = require('chalk');
const events = require('events');
const fs = require('fs');
const pa11y = require('pa11y');
const { promisify } = require('util');
const yargs = require('yargs');

const writeFile = promisify(fs.writeFile);

events.EventEmitter.defaultMaxListeners = 25;

const { isPullRequestRun } = yargs(process.argv.slice(2))
  .usage('Usage: $0 --isPullRequestRun [boolean]')
  .options({
    isPullRequestRun: { type: 'boolean' },
  })
  .parseSync();

console.info('Pa11y: Starting report');

const baseUrl = isPullRequestRun
  ? 'https://www-e2e.wellcomecollection.org'
  : 'https://wellcomecollection.org';

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
    const fakeResults = [
      {
        documentTitle: 'title',
        pageUrl: '/url/here',
        issues: [
          {
            code: 'string',
            context: 'Context of the error',
            message: 'This is an error',
            selector: '#id-of-the-element',
            type: 'string',
            typeCode: 300,
          },
        ],
      },
    ];
    if (isPullRequestRun && fakeResults.length > 0) {
      console.warn(fakeResults);

      // TODO do we want it to stop people from merging?
      console.error(`!!! ${chalk.redBright('Fix these before merging')}`);
      process.exit(1);
    } else {
      await fs.promises.mkdir('./.dist', { recursive: true });
      await writeFile('./.dist/report.json', JSON.stringify({ results }));
      console.info(chalk.greenBright('Reporting done!'));
    }
  })
  .catch(e => console.info(e));
