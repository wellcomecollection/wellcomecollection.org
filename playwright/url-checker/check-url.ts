import { Browser } from 'playwright';

type FailureType =
  | 'could-not-load-url'
  | 'unexpected-status'
  | 'mime-type-mismatch'
  | 'uncaught-error'
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

export const urlChecker =
  (browser: Browser) =>
  async (url: string, expectedStatus: number): Promise<Result> => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const failures: Failure[] = [];

    page.on('pageerror', error =>
      failures.push({
        failureType: 'uncaught-error',
        description: `Uncaught error on page: ${error}`,
      })
    );
    page.on('requestfailed', request =>
      failures.push({
        failureType: 'page-request-failure',
        description: `Request made by page failed: ${request.method()} ${request.url()}`,
      })
    );
    page.on('requestfinished', async request => {
      const response = await request.response();
      if (response === null) {
        // This will be handled by the requestfailed listener
        return;
      }
      const responseStatus = response.status();

      if (responseStatus < 200 || responseStatus >= 400) {
        failures.push({
          failureType: 'page-request-error',
          description: `Request made by page returned an error: ${request.method()} ${request.url()} -> ${responseStatus}`,
        });
      }

      // https://playwright.dev/docs/api/class-request#request-resource-type
      const resourceType = request.resourceType();
      if (resourceType === 'image') {
        const responseMimeType = await response.headerValue('Content-Type');
        if (!responseMimeType?.startsWith('image')) {
          failures.push({
            failureType: 'mime-type-mismatch',
            description: `Request for an image resource at ${request.url()} returned an unexpected mime type ${responseMimeType}`,
          });
        }
      }
    });

    try {
      const response = await page.goto(url);
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

    await page.waitForLoadState('networkidle');
    // Wait 500ms for any errors to occur
    await new Promise(resolve => setTimeout(resolve, 500));

    if (failures.length !== 0) {
      return { success: false, failures };
    } else {
      return { success: true };
    }
  };
