import { Browser, BrowserContext, Page, Response } from 'playwright';

import {
  ignoreErrorLog,
  ignoreMimeTypeMismatch,
  ignoreRequestError,
} from './ignore';

type FailureType =
  | 'could-not-load-url'
  | 'unexpected-status'
  | 'mime-type-mismatch'
  | 'uncaught-js-error'
  | 'other-js-error'
  | 'page-request-failure'
  | 'page-request-error'
  | 'unknown';

export type Success = {
  success: true;
};

type Failure = {
  failureType: FailureType;
  description?: string;
};

export type Failures = {
  success: false;
  failures: Failure[];
};

export type Result = Success | Failures;

const waitUntilEmpty = <T>(set: Set<T>, timeout = 5000): Promise<void> =>
  new Promise((resolve, reject) => {
    let cancelled = false;
    const rejectionTimer = setTimeout(() => {
      cancelled = true;
      reject(new Error(`Did not empty in ${timeout}ms`));
    }, timeout);
    const checkIfEmpty = () => {
      if (set.size === 0) {
        clearTimeout(rejectionTimer);
        resolve();
      } else if (!cancelled) {
        setImmediate(checkIfEmpty);
      }
    };
    checkIfEmpty();
  });

const cachebustUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.set('cachebust', Date.now().toString());
  return parsedUrl.toString();
};

const safePageCloser =
  <T>(inFlight: Set<T>, page: Page, context: BrowserContext) =>
  async (result: Result): Promise<Result> => {
    // Wait for the number of in-flight checks (see above) to drop to zero before
    // closing the page. If there are any, check again in the next iteration of the
    // event loop.
    await waitUntilEmpty(inFlight);
    await page.close({ runBeforeUnload: true });
    await context.close();

    return result;
  };

export const urlChecker =
  (browser: Browser) =>
  async (url: string, expectedStatus: number): Promise<Result> => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const failures: Failure[] = [];

    // Keep track of requests that are being processed in order to prevent the page being closed prematurely
    const inFlight = new Set<Response>();
    const safeClose = safePageCloser(inFlight, page, context);

    page.on('console', message => {
      if (message.type() === 'error' && !ignoreErrorLog(message.text())) {
        failures.push({
          failureType: 'other-js-error',
          description: `Error on page: ${message.text()}`,
        });
      }
    });
    page.on('pageerror', error =>
      failures.push({
        failureType: 'uncaught-js-error',
        description: `Uncaught error on page: ${error}`,
      })
    );
    page.on('requestfailed', request => {
      const failure = request.failure();
      const errorText = failure?.errorText ?? 'unknown cause';

      // Servers (particularly analytics servers) can abort requests, which
      // we needn't regard as an issue
      if (errorText.includes('net::ERR_ABORTED')) {
        return;
      }
      // Ignore 404s on this specific page as very recently digitised items could still be rendering their thumbnails
      // https://wellcome.slack.com/archives/CQ720BG02/p1767966580147499
      if (!url.includes('/collections/new-online')) {
        failures.push({
          failureType: 'page-request-failure',
          description: `Request made by page failed with ${errorText}: ${request.method()} ${request.url()}`,
        });
      }
    });

    page.on('response', response => {
      const checkResponse = async () => {
        const request = response.request();
        // https://playwright.dev/docs/api/class-request#request-resource-type
        const resourceType = request.resourceType();
        if (resourceType === 'document') {
          // This is the page itself, and is handled separately outside the event listener
          return;
        }

        const responseStatus = response.status();
        if (
          (responseStatus < 200 || responseStatus >= 400) &&
          !ignoreRequestError(request)
        ) {
          failures.push({
            failureType: 'page-request-error',
            description: `Request made by page returned an error: ${request.method()} ${request.url()} -> ${responseStatus}`,
          });
        }

        // Some google resources make requests to URLs that return 204s (I believe for cookieless tracking)
        // filter them out here as we're looking for images with src URLs that have content which isn't an image
        if (resourceType === 'image' && responseStatus !== 204) {
          const responseMimeType = await response.headerValue('Content-Type');
          if (
            responseMimeType !== null &&
            !responseMimeType?.startsWith('image') &&
            !ignoreMimeTypeMismatch(request)
          ) {
            failures.push({
              failureType: 'mime-type-mismatch',
              description: `Request for an image resource at ${request.url()} returned an unexpected mime type ${responseMimeType}`,
            });
          }
        }
      };

      inFlight.add(response);
      checkResponse()
        .then(() => {
          inFlight.delete(response);
        })
        .catch(e => {
          console.error(`Something went wrong checking ${url}`);
          console.error(
            `Request was ${response.request().method()} ${response.url()}`
          );
          throw e;
        });
    });

    try {
      const response = await page.goto(cachebustUrl(url));
      const status = response?.status();
      if (status !== expectedStatus) {
        return safeClose({
          success: false,
          failures: [
            {
              failureType: 'unexpected-status',
              description: `Page returned unexpected status: expected ${expectedStatus}, got ${status}`,
            },
          ],
        });
      }
    } catch (pageGotoError) {
      /*
       * The method will throw an error if:
       *
       * - there's an SSL error (e.g. in case of self-signed certificates).
       * - target URL is invalid.
       * - the timeout is exceeded during navigation.
       * - the remote server does not respond or is unreachable.
       * - the main resource failed to load.
       */
      return safeClose({
        success: false,
        failures: [
          {
            failureType: 'could-not-load-url',
            description: `Could not load URL: failed with error ${pageGotoError}`,
          },
        ],
      });
    }

    try {
      await page.waitForLoadState('load');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch {
      return safeClose({
        success: false,
        failures: [
          {
            failureType: 'could-not-load-url',
            description: 'Timeout while waiting for page load',
          },
        ],
      });
    }

    if (failures.length !== 0) {
      return safeClose({ success: false, failures });
    } else {
      return safeClose({ success: true });
    }
  };
