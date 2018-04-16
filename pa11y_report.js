const fs = require('fs');
const html = require('pa11y-reporter-html');
const pa11y = require('pa11y');

pa11y('https://wellcomecollection.org/info/opening-hours').then(results => {
  html.results(results).then(html => {
    fs.writeFile('./pa11y_report.html', html, (err, data) => {
      if (err) throw err;
      else console.info('pa11y report created');
    });
  });
});
