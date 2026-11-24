const events = require('events');
const pa11y = require('pa11y');
const puppeteer = require('puppeteer');
const { setTimeout } = require('timers');
const { styleText } = require('util');

events.EventEmitter.defaultMaxListeners = 25;

const BATCH_SIZE = 3;
const DELAY_BETWEEN_BATCHES_MS = 1000;

// Helper to add a delay between batches of requests; requests within a batch
// still run concurrently.
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * How long to let a page settle before pa11y runs axe on it.
 *
 * The item viewer starts at opacity 0 and fades in after a 1.5s delay, over
 * 200ms, so the no-JS markup is never seen swapping to the enhanced one (the
 * DelayVisibility component in the IIIF viewer). pa11y measures as soon as the
 * network goes quiet, which can land inside that fade: axe then sees every
 * label part-way between the background and its real colour and reports
 * contrast failures that are gone a fraction of a second later.
 *
 * Waiting costs time, so only the page that needs it gets it. If
 * DelayVisibility goes, this can go with it.
 */
const settleTime = url => (url.includes('/items') ? 2000 : 0);

const GRADIENT_SWEEP_INTERVAL_MS = 300;

/**
 * Drops gradients that are sized to paint nothing, so axe can measure the
 * text in front of them.
 *
 * axe refuses to judge text with a gradient behind it: it comes back
 * incomplete, with no colours and a ratio of 0, rather than passing or
 * failing. AnimatedUnderline draws its hover underline as a background
 * gradient sized to zero width until hover, which is enough to trigger that
 * on every tag and link using it.
 *
 * A gradient sized to zero width paints nothing, so removing it can't change
 * what's on screen. Matching on that rather than listing the components that
 * use AnimatedUnderline means there is nothing to keep in step when a new one
 * does, and real gradients, like FullWidthBanner's two-tone background, are
 * left alone to be reported as usual.
 *
 * It sweeps repeatedly because elements arrive after hydration and pa11y
 * gives no hook between the page settling and axe running. A sweep costs a
 * few milliseconds on a page of around a thousand elements.
 */
const dropInvisibleGradients = page =>
  page.evaluateOnNewDocument(intervalMs => {
    const sweep = () => {
      document.querySelectorAll('*').forEach(element => {
        const { backgroundImage, backgroundSize } =
          window.getComputedStyle(element);

        // parseFloat takes the width of the first background, and gives NaN
        // for keywords like `auto` and `cover`
        if (
          backgroundImage.includes('gradient') &&
          parseFloat(backgroundSize) === 0
        ) {
          element.style.backgroundImage = 'none';
        }
      });
    };

    document.addEventListener('DOMContentLoaded', sweep);
    window.setInterval(sweep, intervalMs);
  }, GRADIENT_SWEEP_INTERVAL_MS);

/**
 * Looks up the component each issue is in, while the page is still open.
 *
 * pa11y doesn't say which component an issue is in, and the result is used to
 * group warnings in the summary. Returns one entry per issue, in order.
 */
const componentsForIssues = (page, issues) =>
  page
    .evaluate(
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
      issues.map(issue => issue.selector)
    )
    // Only a label, so if the page has navigated or closed, go without
    // rather than failing the page
    .catch(() => []);

const runPa11y = async (browser, url) => {
  const page = await browser.newPage();

  try {
    // Consenting up front means the cookie banner isn't rendered. axe measures
    // contrast from what's painted, so the banner's backdrop would otherwise
    // count as the background of all the text behind it.
    await page.setCookie({ name: 'CookieControl', value: '{}', url });

    await dropInvisibleGradients(page);

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
      wait: settleTime(url),
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

    const components = await componentsForIssues(page, result.issues);

    return {
      ...result,
      issues: result.issues.map((issue, i) => {
        const component = components[i] ?? null;
        return {
          ...issue,
          component,
          // Written once here so the PR log and the dashboard group alike
          groupLabel: `${issue.code} in ${component ?? '(unknown)'}`,
        };
      }),
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
const runBatches = async (browser, urls) => {
  const results = [];

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    if (i > 0) {
      await delay(DELAY_BETWEEN_BATCHES_MS);
    }

    const batch = urls.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(url => runPa11yWithRetry(browser, url))
    );

    // Keep a placeholder for URLs that errored, so results stay aligned with
    // urls. The missing documentTitle makes them fail pagesThatFailedToLoad.
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
};

/**
 * Audits every URL, and returns one result per URL, in the order given.
 */
const auditPages = async urls => {
  // One browser for every URL, so each page can have the consent cookie set
  // before it loads
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  try {
    return await runBatches(browser, urls);
  } finally {
    await browser.close();
  }
};

module.exports = { auditPages };
