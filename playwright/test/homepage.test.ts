import { expect, test } from '@playwright/test';
import { Page } from 'playwright';

import {
  gotoWithoutCache,
  mediaOffice,
  requiredCookies,
} from './helpers/contexts';
import { baseUrl } from './helpers/utils';

// See the comment in content/webapp/pages/index.tsx about why this is important
test('(1) Website includes the Meta domain verification tag', async ({
  page,
}) => {
  await gotoWithoutCache(baseUrl, page);
  const verificationTag = await page.locator(
    'meta[name="facebook-domain-verification"]'
  );
  await expect(verificationTag).toHaveAttribute(
    'content',
    'gl52uu0zshpy3yqv1ohxo3zq39mb0w'
  );
});

test('(2) | Cookie banner displays on first visit from anywhere.', async ({
  page,
}) => {
  await gotoWithoutCache(baseUrl, page);
  const cookieBanner = await page.getByLabel('Our website uses cookies');
  await expect(cookieBanner).toBeAttached();

  await gotoWithoutCache(`${baseUrl}/visit-us`, page);
  await expect(cookieBanner).toBeAttached();
});

test('(3) | Cookie banner only displays if CookieControl cookie has not already been set', async ({
  context,
  page,
}) => {
  await gotoWithoutCache(`${baseUrl}/about-us/press`, page);
  const cookieBanner = await page.getByLabel('Our website uses cookies');
  await expect(cookieBanner).toBeAttached();

  await mediaOffice(context, page);
  await expect(cookieBanner).not.toBeAttached();
});

const civicConfigScriptIsModule = (page: Page) =>
  page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type]'));
    return scripts.some(
      s =>
        s.getAttribute('type') === 'module' &&
        s.textContent?.includes('CookieControl.load')
    );
  });

test('(4) | CivicUK config script is not a module on first visit', async ({
  page,
}) => {
  await gotoWithoutCache(baseUrl, page);
  expect(await civicConfigScriptIsModule(page)).toBe(false);
});

test('(5) | CivicUK config script is a module when CookieControl cookie is present', async ({
  context,
  page,
}) => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(baseUrl, page);
  expect(await civicConfigScriptIsModule(page)).toBe(true);
});
