const {
  CloudFrontClient,
  CreateInvalidationCommand,
} = require('@aws-sdk/client-cloudfront');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const events = require('events');
const pa11y = require('pa11y');
const puppeteer = require('puppeteer');
const { setTimeout } = require('timers');
const { styleText } = require('util');
const yargs = require('yargs');

const s3Client = new S3Client({ region: 'eu-west-1' });
const cloudFrontClient = new CloudFrontClient({ region: 'eu-west-1' });

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

// Note: if you add a URL to this list, consider whether it would be valuable
// to add it to the list of URLs checked by the URL checker.
//
// See .buildkite/urls/expected_200_urls.txt
//
const urls = [
  '/',
  '/visit-us',
  '/whats-on',
  '/collections',
  '/stories',
  '/stories/the-birth-of-britain-s-national-health-service',
  '/stories/art',
  '/works/cjwep3ze?query=health&page=1',
  '/works/e7vav3ss/items?page=1&canvas=1',
  '/works/d2mach47',
  '/works/aegabdcp?toggleOverride=archiveCollectionPhases:mvp',
  '/collections/people-and-organisations?toggleOverride=thematicBrowsingPhases:categoryPages',
  '/series/inside-our-collections',
  '/exhibitions/heart-n-soul-s-wall-of-change',
  '/events/embracing-the-goddess',
  '/event-series/saturday-studio',
  '/concepts/patspgf3',
  '/guides/archives-at-wellcome-collection',
  '/visual-stories/genetic-automata-visual-story',

  // This is a comic using the new (as of November 2022) approach to
  // comic frames and navigation between issues.
  '/stories/clinical-detachment',

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

// Helper to add a delay between batches of requests; requests within a batch
// still run concurrently.
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const runPa11y = async (browser, url) => {
  const page = await browser.newPage();

  try {
    // Consenting up front means the cookie banner isn't rendered. axe measures
    // contrast from what's painted, so the banner's backdrop would otherwise
    // count as the background of all the text behind it.
    await page.setCookie({ name: 'CookieControl', value: '{}', url });

    return await pa11y(url, {
      browser,
      page,
      // axe rather than the default HTML_CodeSniffer, which only looks at a
      // text's ancestors for its background, so it misses absolutely
      // positioned backgrounds (e.g. HeaderBackground)
      runners: ['axe'],
      // Report what axe can't decide (e.g. text on a background image) as
      // warnings rather than errors, and keep warnings in the results (pa11y
      // drops them by default) so they can be checked by hand
      levelCapWhenNeedsReview: 'warning',
      includeWarnings: true,
      timeout: 120000,
      ignore: [
        // Iframe element requires a non-empty title attribute that identifies the frame.
        // https://github.com/wellcomecollection/wellcomecollection.org/issues/11269
        'frame-title',
        // axe best-practice rules (not WCAG) that pa11y runs by default. They
        // only ever give warnings, and would bury the contrast ones we want
        'region',
        'heading-order',
        'landmark-unique',
      ],
      // Hide InPageNavigation components from accessibility testing
      // The component uses mix-blend-mode: difference which causes false positive
      // contrast errors (1:1 ratio) that PA11y cannot properly evaluate
      hideElements: '[data-component="in-page-navigation"]',
      log: {
        debug: console.log,
        error: console.error,
        info: console.info,
      },
    });
  } finally {
    await page.close();
  }
};

/**
 * Runs pa11y against a URL, retrying once on error.
 *
 * Pa11y injects its test runners immediately after the page loads. If the page
 * navigates while that injection is in flight the execution context is
 * destroyed and pa11y throws, so a single attempt is not reliable.
 */
const runPa11yWithRetry = async (browser, url) => {
  try {
    return await runPa11y(browser, url);
  } catch (error) {
    console.info(`Retrying ${url} after error: ${error.message}`);
    return runPa11y(browser, url);
  }
};

// Run pa11y in batches to avoid rate limiting while keeping reasonable speed
async function runAllTests() {
  // One browser for every URL, so each page can have the consent cookie set
  // before it loads
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  try {
    return await runBatches(browser);
  } finally {
    await browser.close();
  }
}

async function runBatches(browser) {
  const results = [];
  const batchSize = 3;
  const delayBetweenBatches = 1000; // 1 second between batches

  for (let i = 0; i < urls.length; i += batchSize) {
    if (i > 0) {
      await delay(delayBetweenBatches);
    }

    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(url => runPa11yWithRetry(browser, url))
    );

    // Keep a placeholder for URLs that errored, so results stay aligned with
    // urls. The missing documentTitle makes them fail the check below.
    batchResults.forEach((outcome, j) => {
      if (outcome.status === 'fulfilled') {
        results.push(outcome.value);
      } else {
        console.error(
          styleText(
            'redBright',
            `${batch[j]} errored: ${outcome.reason.message}`
          )
        );
        results.push({ issues: [] });
      }
    });
  }

  return results;
}

try {
  console.info('Pa11y: Starting report');

  runAllTests()
    .then(async results => {
      // Check for pages that failed to load properly
      // Valid Wellcome Collection pages contain "Wellcome Collection"
      // Error pages (429, 403, 503, etc.) from CloudFront return "wellcomecollection.org" (lowercase)
      const failedPages = results
        .map((result, i) => ({ result, url: urls[i] }))
        .filter(({ result }) => {
          // Page completely failed to load
          if (!result.documentTitle || !result.pageUrl) {
            return true;
          }

          // Check if title contains "Wellcome Collection" (case-sensitive)
          // Valid pages: "Wellcome Collection | ..." or "... | Wellcome Collection"
          // Error pages: "wellcomecollection.org" (no match)
          const hasValidTitle = result.documentTitle.includes(
            'Wellcome Collection'
          );

          return !hasValidTitle;
        });

      if (failedPages.length > 0) {
        console.error(
          styleText(
            'redBright',
            `${failedPages.length} page(s) failed to load properly`
          )
        );
        failedPages.forEach(({ url, result }) => {
          console.error(
            `  - ${url} (title: "${result.documentTitle || 'missing'}")`
          );
        });
        process.exit(1);
      }

      if (isPullRequestRun) {
        const resultsLog = results
          .map(result => {
            return result.issues.length > 0
              ? {
                  title: result.documentTitle,
                  url: result.pageUrl,
                  errors: result.issues.map(issue => ({
                    type: issue.type,
                    code: issue.code,
                    message: issue.message,
                    selector: issue.selector,
                    context: issue.context,
                  })),
                }
              : undefined;
          })
          .filter(f => f)
          .flat();

        if (resultsLog.length > 0) {
          const hasErrors = results.find(result =>
            result.issues.find(issue => issue.type === 'error')
          );

          // Warnings alone don't fail the run, so only call for fixes on errors
          console.error(
            hasErrors
              ? `!!! ${styleText('redBright', 'Fix these before merging')}`
              : styleText(
                  'yellowBright',
                  'No errors, but these warnings need checking by hand'
                )
          );
          console.log(...resultsLog);

          process.exit(hasErrors ? 1 : 0);
        } else {
          console.log(styleText('greenBright', 'Report done, no errors found'));
          process.exit(0);
        }
      } else {
        console.info(styleText('greenBright', 'Reporting done!'));

        try {
          await s3Client.send(
            new PutObjectCommand({
              Body: JSON.stringify({
                results,
                timestamp: new Date().toISOString(),
              }),
              Bucket: 'dash.wellcomecollection.org',
              Key: 'pa11y/report.json',
              ACL: 'public-read',
              ContentType: 'application/json',
            })
          );
          console.log(
            styleText('greenBright', 'Finished uploading report.json')
          );

          await cloudFrontClient.send(
            new CreateInvalidationCommand({
              DistributionId: 'EIOS79GG23UUY',
              InvalidationBatch: {
                Paths: { Items: ['/pa11y/report.json'], Quantity: 1 },
                CallerReference: `Pa11yDeployInvalidationCallerReference${Date.now()}`,
              },
            })
          );
          console.log(
            styleText('greenBright', 'Flushed CloudFront cache for report.json')
          );
        } catch (err) {
          console.error(styleText('redBright', 'Error uploading report.json'));
          console.log(err);
          process.exit(1);
        }
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
