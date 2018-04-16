const fs = require('fs');
const html = require('pa11y-reporter-html');
const pa11y = require('pa11y');

console.info('Pa11y: Starting report');
pa11y('https://wellcomecollection.org/info/opening-hours').then(results => {
  console.info('Pa11y: Fetched report');
  html.results(results).then(html => {
    fs.writeFile('./pa11y_report.html', html, (err, data) => {
      if (err) throw err;
      else console.info('Pa11y: Report written');
    });
  });
});
