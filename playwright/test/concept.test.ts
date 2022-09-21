import { test as base } from '@playwright/test';
import { concept } from './contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleCookies } from './helpers/utils';

const domain = new URL(baseUrl).host;

const test = base.extend({
  context: async ({ context }, use) => {
    const defaultToggleCookies = await makeDefaultToggleCookies(domain);

    // This adds the conceptsPages toggle so the e2e tests can see the concept pages,
    // but once they're out from behind a toggle we can remove this.
    await context.addCookies([
      {
        name: 'toggle_conceptsPages',
        value: 'true',
        domain,
        path: '/',
      },
      ...defaultToggleCookies.filter(c => c.name !== 'toggle_conceptsPages'),
    ]);

    await use(context);
  },
});

const conceptIds = {
  'Thackrah, Charles Turner, 1795-1833': 'd46ea7yk',
  'John, the Baptist, Saint': 'qd86ycny',
};

test.describe('concepts', () => {
  test('concepts get a list of associated works', async ({ page, context }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the query we send to the works API.
    await concept(
      conceptIds['Thackrah, Charles Turner, 1795-1833'],
      context,
      page
    );
    await page.waitForSelector('h2 >> text="Works"');
  });

  test('concepts get a list of related images', async ({ page, context }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the query we send to the images API.
    await concept(conceptIds['John, the Baptist, Saint'], context, page);
    await page.waitForSelector('h2 >> text="Images"');
  });
});
