import { Browser, Request } from 'playwright';
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

const cachebustUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.set('cachebust', Date.now().toString());
  return parsedUrl.toString();
};

export const urlChecker =
  (browser: Browser) =>
  async (url: string, expectedStatus: number): Promise<Result> => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const failures: Failure[] = [];

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

      failures.push({
        failureType: 'page-request-failure',
        description: `Request made by page failed with ${errorText}: ${request.method()} ${request.url()}`,
      });
    });

    // Keep track of requests that are being processed in order to prevent the page being closed while this async
    // function is running - don't believe it's needed for the other (sync) event handlers.
    const inFlight = new Set<Request>();
    page.on('requestfinished', async request => {
      inFlight.add(request);
      // https://playwright.dev/docs/api/class-request#request-resource-type
      const resourceType = request.resourceType();
      if (resourceType === 'document') {
        // This is the page itself, and is handled below
        inFlight.delete(request);
        return;
      }

      const response = await request.response();
      if (response === null) {
        // This will be handled by the requestfailed listener
        inFlight.delete(request);
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
      inFlight.delete(request);
    });

    try {
      const response = await page.goto(cachebustUrl(url));
      const status = response?.status();
      if (status !== expectedStatus) {
        return {
          success: false,
          failures: [
            {
              failureType: 'unexpected-status',
              description: `Page returned unexpected status: expected ${expectedStatus}, got ${status}`,
            },
          ],
        };
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
      return {
        success: false,
        failures: [
          {
            failureType: 'could-not-load-url',
            description: `Could not load URL: failed with error ${pageGotoError}`,
          },
        ],
      };
    }

    try {
      // Can't use networkidle here as pages with YouTube embeds keep sending analytics data :(
      await page.waitForLoadState('load');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {
      return {
        success: false,
        failures: [
          {
            failureType: 'could-not-load-url',
            description: 'Timeout while waiting for page load',
          },
        ],
      };
    }

    // Wait for the number of in-flight checks (see above) to drop to zero before
    // closing the page. If there are any, check again in the next iteration of the
    // event loop.
    await new Promise<void>(resolve => {
      const checkInFlight = () => {
        if (inFlight.size === 0) {
          resolve();
        } else {
          setImmediate(checkInFlight);
        }
      };
      checkInFlight();
    });
    await page.close({ runBeforeUnload: true });

    if (failures.length !== 0) {
      return { success: false, failures };
    } else {
      return { success: true };
    }
  };
