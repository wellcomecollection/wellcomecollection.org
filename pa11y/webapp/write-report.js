const fs = require('fs');
const mkdirp = require('mkdirp-promise');
const pa11y = require('pa11y');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

const baseUrl = 'https://wellcomecollection.org';

function runPa11yForUrls(urls) {
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
}

console.info('Pa11y: Starting report');

fs.readFile('../../.buildkite/urls/expected_200_urls.txt', (err, fileData) => {
  if (err) {
    console.error('Cannot read list of expected URLs');
    process.exit(1);
  } else {
    const urls = fileData
      .toString('utf8')
      .split('\n')
      .filter(line => line.trim() !== '' && !line.startsWith('# '))
      .map(u => `${baseUrl}${u}`);

    console.log(`Running pa11y for URLs: ${urls.join('\n')}`);

    runPa11yForUrls(urls);
  }
});

// console.log(urls);

// const urls = [
//   'https://wellcomecollection.org',
//   'https://wellcomecollection.org/visit-us',
//   'https://wellcomecollection.org/whats-on',
//   'https://wellcomecollection.org/stories',
//   'https://wellcomecollection.org/articles/WyjHUicAACvGnmJI',
//   'https://wellcomecollection.org/articles/W8ivQRAAAJFijw1h',
//   'https://wellcomecollection.org/works',
//   'https://wellcomecollection.org/works?query=health',
//   'https://wellcomecollection.org/works/cjwep3ze?query=health&page=1',
//   'https://wellcomecollection.org/works/e7vav3ss/items?page=1&canvas=1&sierraId=b28136615&langCode=eng',
//   'https://wellcomecollection.org/what-we-do',
//   'https://wellcomecollection.org/series/WsSUrR8AAL3KGFPF',
//   'https://wellcomecollection.org/exhibitions/XOVfTREAAOJmx-Uw',
//   'https://wellcomecollection.org/events/Wqkd1yUAAB8sW4By',
//   'https://wellcomecollection.org/event-series/WlYT_SQAACcAWccj',
//   'https://wellcomecollection.org/concepts/n4fvtc49',
//
//   // Exhibition guides.  We should test one example of each guide format.
//   'https://wellcomecollection.org/guides/exhibitions/YzwsAREAAHylrxau/audio-without-descriptions',
//   'https://wellcomecollection.org/guides/exhibitions/YzwsAREAAHylrxau/captions-and-transcripts',
//   'https://wellcomecollection.org/guides/exhibitions/YzwsAREAAHylrxau/bsl',
// ];

// =======
// const urls = [
//   'https://wellcomecollection.org',
//   'https://wellcomecollection.org/visit-us',
//   'https://wellcomecollection.org/whats-on',
//   'https://wellcomecollection.org/stories',
//   'https://wellcomecollection.org/articles/WyjHUicAACvGnmJI',
//   'https://wellcomecollection.org/articles/W8ivQRAAAJFijw1h',
//   'https://wellcomecollection.org/works',
//   'https://wellcomecollection.org/works?query=health',
//   'https://wellcomecollection.org/works/cjwep3ze?query=health&page=1',
//   'https://wellcomecollection.org/works/e7vav3ss/items?page=1&canvas=1&sierraId=b28136615&langCode=eng',
//   'https://wellcomecollection.org/what-we-do',
//   'https://wellcomecollection.org/series/WsSUrR8AAL3KGFPF',
//   'https://wellcomecollection.org/exhibitions/XOVfTREAAOJmx-Uw',
//   'https://wellcomecollection.org/events/Wqkd1yUAAB8sW4By',
//   'https://wellcomecollection.org/event-series/WlYT_SQAACcAWccj',
//   'https://wellcomecollection.org/concepts/n4fvtc49',

//   // Exhibition guides.  We should test one example of each guide format.
//   'https://wellcomecollection.org/guides/exhibitions/YzwsAREAAHylrxau/audio-without-descriptions',
//   'https://wellcomecollection.org/guides/exhibitions/YzwsAREAAHylrxau/captions-and-transcripts',
//   'https://wellcomecollection.org/guides/exhibitions/YzwsAREAAHylrxau/bsl',
// ];

// const promises = urls.map(url =>
//   pa11y(url, {
//     chromeLaunchConfig: {
//       args: ['--no-sandbox'],
//     },
//   })
// );

// Promise.all(promises).then(async results => {
//   await mkdirp('./.dist');
//   await writeFile('./.dist/report.json', JSON.stringify({ results }));
//   console.info('Reporting done!');
// });
// >>>>>>> External Changes
