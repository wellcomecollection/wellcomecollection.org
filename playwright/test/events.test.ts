import { test as base } from '@playwright/test';
import { event } from './contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleCookies } from './helpers/utils';

const domain = new URL(baseUrl).host;

const test = base.extend({
  context: async ({ context }, use) => {
    const defaultToggleCookies = await makeDefaultToggleCookies(domain);
    await context.addCookies([
      { name: 'WC_cookiesAccepted', value: 'true', domain, path: '/' },
      ...defaultToggleCookies,
    ]);
    await use(context);
  },
});

test.describe('events', () => {
  test('single event pages include the scheduled events', async ({
    page,
    context,
  }) => {
    await event('XagmOxAAACIAo0v8', context, page);
    await page.waitForSelector('h2 >> text="Events"');
    await page.waitForSelector('h3 >> text="Saturday 30 November 2019"');
    await page.waitForSelector('h5 >> text="Heart n Soul Radio"');
  });
});
