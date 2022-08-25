import { Page, errors as playwrightErrors } from 'playwright';

// See comment on `gotoWithoutCache` in `contexts.ts`, it's non-trivial to
// do this in a DRY way so the behaviour is duplicated here
const safeWaitForNavigation = async (page: Page): Promise<void> => {
  try {
    await page.waitForNavigation({
      waitUntil: 'load',
      timeout: 10 * 1000, // 10s
    });
  } catch (e) {
    if (e instanceof playwrightErrors.TimeoutError) {
      await page.waitForNavigation({
        waitUntil: 'domcontentloaded',
      });
    } else {
      throw e;
    }
  }
};

export default safeWaitForNavigation;
