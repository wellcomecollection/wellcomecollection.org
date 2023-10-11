import { test as base, expect } from '@playwright/test';
import { gotoWithoutCache } from './contexts';
import { baseUrl } from './helpers/urls';

const domain = new URL(baseUrl).host;

const test = base.extend({
  context: async ({ context }, use) => {
    await context.addCookies([
      { name: 'toggle_apiToolbar', value: 'true', domain, path: '/' },
    ]);

    await use(context);
  },
});

test.describe('tzitzit links', () => {
  test('does not create a tzitzit link for images in copyright', async ({
    page,
  }) => {
    await gotoWithoutCache(`${baseUrl}/works/fedcvz22/items`, page);

    await page.waitForSelector(
      'li >> text="This image is labelled as in copyright. Check before using."'
    );
  });

  test('creates a tzitzit link for item pages', async ({ page }) => {
    await gotoWithoutCache(`${baseUrl}/works/ccg335hm/items`, page);

    const anchor = await page.waitForSelector('a >> text="tzitzit"');
    const url = await anchor.getAttribute('href');

    expect(url).toBe(
      'https://s3-eu-west-1.amazonaws.com/tzitzit.wellcomecollection.org/index.html?title=Fish+schizophrene.&sourceName=Wellcome+Collection&sourceLink=https%3A%2F%2Fwellcomecollection.org%2Fworks%2Fccg335hm%2Fitems&author=Charnley%2C+Bryan%2C+1949-1991'
    );
  });

  test('creates a tzitzit link for image pages', async ({ page }) => {
    await gotoWithoutCache(
      `${baseUrl}/works/ccg335hm/images?id=srfsqn7t`,
      page
    );

    const anchor = await page.waitForSelector('a >> text="tzitzit"');
    const url = await anchor.getAttribute('href');

    expect(url).toBe(
      'https://s3-eu-west-1.amazonaws.com/tzitzit.wellcomecollection.org/index.html?title=Fish+schizophrene.&sourceName=Wellcome+Collection&sourceLink=https%3A%2F%2Fwellcomecollection.org%2Fworks%2Fccg335hm%2Fimages%3Fid%3Dsrfsqn7t&licence=CC-BY-NC&author=Charnley%2C+Bryan%2C+1949-1991'
    );
  });
});
