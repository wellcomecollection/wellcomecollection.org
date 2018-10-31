const fs = require('fs');
const mkdirp = require('mkdirp-promise');
const pa11y = require('pa11y');
const {promisify} = require('util');
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
  'https://wellcomecollection.org/what-we-do'
];

const promises = urls.map(url => pa11y(url));
Promise.all(promises).then(async (results) => {
  await mkdirp('./static/.dist');
  await writeFile('./static/.dist/report.json', JSON.stringify({results}));
});
