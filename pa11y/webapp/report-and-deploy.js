const AWS = require('aws-sdk');
const chalk = require('chalk');
const events = require('events');
const pa11y = require('pa11y');
const yargs = require('yargs');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const cloudfront = new AWS.CloudFront();

events.EventEmitter.defaultMaxListeners = 25;

const { isPullRequestRun } = yargs(process.argv.slice(2))
  .usage('Usage: $0 --isPullRequestRun [boolean]')
  .options({
    isPullRequestRun: { type: 'boolean' },
  })
  .parseSync();

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
  '/articles/the-birth-of-britain-s-national-health-service',
  '/articles/art',
  '/works/cjwep3ze?query=health&page=1',
  '/works/e7vav3ss/items?page=1&canvas=1',
  '/works/d2mach47',
  '/series/inside-our-collections',
  '/exhibitions/heart-n-soul-s-wall-of-change',
  '/events/embracing-the-goddess',
  '/event-series/saturday-studio',
  '/concepts/n4fvtc49',
  '/guides/archives-at-wellcome-collection',
  '/visual-stories/genetic-automata-visual-story',

  // This is a comic using the new (as of November 2022) approach to
  // comic frames and navigation between issues.
  '/articles/clinical-detachment',

  // Exhibition guides.  We should test one example of each guide format.
  '/guides/exhibitions/in-plain-sight/audio-without-descriptions',
  '/guides/exhibitions/in-plain-sight/captions-and-transcripts',
  '/guides/exhibitions/in-plain-sight/bsl',

  // Search pages, overview + with one of each
  '/search?query=human',
  '/search/stories?query=human',
  '/search/images?query=human',
  '/search/works?query=human',
  '/search/events?query=human',
].map(u => `${baseUrl}${u}`);

const promises = urls.map(url =>
  pa11y(url, {
    timeout: 120000,
    chromeLaunchConfig: {
      args: ['--no-sandbox'],
    },
    ignore: [
      // Iframe element requires a non-empty title attribute that identifies the frame.
      // https://github.com/wellcomecollection/wellcomecollection.org/issues/11269
      'WCAG2AA.Principle2.Guideline2_4.2_4_1.H64.1',
    ],
    log: {
      debug: console.log,
      error: console.error,
      info: console.info,
    },
  })
);

try {
  console.info('Pa11y: Starting report');

  Promise.all(promises)
    .then(async results => {
      if (isPullRequestRun) {
        const resultsLog = results
          .map(result => {
            return result.issues.length > 0
              ? {
                  title: result.documentTitle,
                  url: result.pageUrl,
                  errors: result.issues.map(issue => ({
                    type: issue.type,
                    message: issue.message,
                  })),
                }
              : undefined;
          })
          .filter(f => f)
          .flat();

        if (resultsLog.length > 0) {
          console.error(`!!! ${chalk.redBright('Fix these before merging')}`);
          console.log(...resultsLog);

          const hasErrors = results.find(result =>
            result.issues.find(issue => issue.type === 'error')
          );

          process.exit(hasErrors ? 1 : 0);
        } else {
          console.log(chalk.greenBright('Report done, no errors found'));
          process.exit(0);
        }
      } else {
        console.info(chalk.greenBright('Reporting done!'));

        const params = {
          Body: results,
          Bucket: 'dash.wellcomecollection.org',
          Key: 'pa11y/report.json',
          ACL: 'public-read',
          ContentType: 'application/json',
        };

        s3.putObject(params, function (err, data) {
          if (err) {
            console.error(chalk.redBright('Error uploading report.json'));
            console.log(err, err.stack);
            process.exit(1);
          } else {
            console.log('Finished uploading report.json');

            cloudfront.createInvalidation(
              {
                DistributionId: 'EIOS79GG23UUY',
                InvalidationBatch: {
                  Paths: { Items: ['/pa11y/report.json'], Quantity: 1 },
                  CallerReference: `Pa11yDeployInvalidationCallerReference${Date.now()}`,
                },
              },
              function (err, data) {
                if (err) console.log(err, err.stack);
                else console.log('Flushed CloudFront cache for report.json');
              }
            );
          }
        });
      }
    })
    .catch(error => {
      console.log({ error });
      process.exit(1);
    });
} catch (e) {
  console.log('Error:', e.stack);
  process.exit(1);
}
