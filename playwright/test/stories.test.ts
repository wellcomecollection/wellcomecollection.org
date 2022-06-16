import { test as base } from '@playwright/test';
import { gotoWithoutCache } from './contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleCookies } from './helpers/utils';

const domain = new URL(baseUrl).host;

const test = base.extend({
  context: async ({ context }, use) => {
    const defaultToggleCookies = await makeDefaultToggleCookies(domain);
    await context.addCookies([
      { name: 'WC_cookiesAccepted', value: 'true', domain: domain, path: '/' },
      ...defaultToggleCookies,
    ]);
    await use(context);
  },
});

test.describe('stories', () => {
  test('cards for the featured series are shown on /stories', async ({
    page,
  }) => {
    await gotoWithoutCache(`${baseUrl}/stories`, page);

    const heading = await page.waitForSelector(`a[href ^= "/series"]`);
    const featuredSeriesTitle = await heading.textContent();

    await page.waitForSelector(`p >> text=Part of ${featuredSeriesTitle}`);
  });
});
