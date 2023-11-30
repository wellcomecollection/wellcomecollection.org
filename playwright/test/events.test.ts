import { expect, test as base } from '@playwright/test';
import { event } from './helpers/contexts';
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
    const pastEventsLocator = page.locator('h2 >> text="Past events"');
    const dateLocator = page.locator('h3 >> text="Saturday 30 November 2019"');
    // Heart n Soul Radio occured twice, once in November, once in December
    const eventNameLocator = page
      .locator('h5 >> text="Heart n Soul Radio"')
      .first();
    await expect(pastEventsLocator).toBeVisible();
    await expect(dateLocator).toBeVisible();
    await expect(eventNameLocator).toBeVisible();
  });
});
