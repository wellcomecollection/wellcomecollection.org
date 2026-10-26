const {
  CloudFrontClient,
  CreateInvalidationCommand,
} = require('@aws-sdk/client-cloudfront');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const events = require('events');
const pa11y = require('pa11y');
const puppeteer = require('puppeteer');
const { setTimeout } = require('timers');
const { URL } = require('url');
const { styleText } = require('util');
const yargs = require('yargs');

const s3Client = new S3Client({ region: 'eu-west-1' });
const cloudFrontClient = new CloudFrontClient({ region: 'eu-west-1' });

events.EventEmitter.defaultMaxListeners = 25;

const { isPullRequestRun, allWarnings } = yargs(process.argv.slice(2))
  .usage('Usage: $0 --isPullRequestRun [boolean] --allWarnings [boolean]')
  .options({
    isPullRequestRun: { type: 'boolean' },
    allWarnings: {
      type: 'boolean',
      description: 'List every warning, not just the summary',
    },
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

    const result = await pa11y(url, {
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

    // pa11y doesn't say which component an issue is in, so look it up while
    // the page is still open. Used to group warnings in the summary.
    const components = await page.evaluate(
      selectors =>
        selectors.map(selector => {
          try {
            const element = document.querySelector(selector);
            const component = element
              ?.closest('[data-component]')
              ?.getAttribute('data-component');
            // Fall back to the element itself, so unrelated issues outside
            // any component don't all land in one group
            return (
              component ??
              (element ? `<${element.tagName.toLowerCase()}>` : null)
            );
          } catch {
            return null;
          }
        }),
      result.issues.map(issue => issue.selector)
    );

    return {
      ...result,
      issues: result.issues.map((issue, i) => ({
        ...issue,
        component: components[i],
      })),
    };
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

// The pages with issues of the given type, listing each issue
const issuesLog = (results, type) =>
  results
    .map(result => ({
      title: result.documentTitle,
      url: result.pageUrl,
      issues: result.issues
        .filter(issue => issue.type === type)
        .map(issue => ({
          type: issue.type,
          code: issue.code,
          message: issue.message,
          selector: issue.selector,
          context: issue.context,
        })),
    }))
    .filter(page => page.issues.length > 0);

// One line per rule and component, with a count and the pages it's on
const warningsSummary = results => {
  const groups = new Map();

  results.forEach(result => {
    const path = result.pageUrl ? new URL(result.pageUrl).pathname : '?';

    result.issues
      .filter(issue => issue.type === 'warning')
      .forEach(issue => {
        const key = `${issue.code} in ${issue.component ?? '(unknown)'}`;
        const group = groups.get(key) ?? { count: 0, pages: new Set() };
        group.count += 1;
        group.pages.add(path);
        groups.set(key, group);
      });
  });

  return [...groups]
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([key, { count, pages }]) => {
      const pageList = [...pages];
      const shown = pageList.slice(0, 3).join(', ');
      const more = pageList.length > 3 ? `, +${pageList.length - 3} more` : '';
      return `  ${count} x ${key} (${shown}${more})`;
    })
    .join('\n');
};

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
        const errorsLog = issuesLog(results, 'error');
        const warningsCount = results.reduce(
          (count, result) =>
            count +
            result.issues.filter(issue => issue.type === 'warning').length,
          0
        );

        if (errorsLog.length > 0) {
          console.error(
            `!!! ${styleText('redBright', 'Fix these before merging')}`
          );
          console.log(...errorsLog);
        }

        // Warnings don't fail the run, and mostly repeat the same few
        // patterns, so summarise them unless asked for the full list
        if (warningsCount > 0) {
          console.log(
            styleText(
              'yellowBright',
              `${warningsCount} warning(s) for checking by hand:`
            )
          );
          console.log(warningsSummary(results));

          if (allWarnings) {
            console.log(...issuesLog(results, 'warning'));
          } else {
            console.log('Run with --allWarnings to list each one');
          }
        }

        if (errorsLog.length === 0) {
          console.log(styleText('greenBright', 'Report done, no errors found'));
        }

        process.exit(errorsLog.length > 0 ? 1 : 0);
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
