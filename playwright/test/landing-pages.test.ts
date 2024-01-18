import { test, expect } from '@playwright/test';
import {
  homepageUrl,
  visitUsUrl,
  whatsOnUrl,
  storiesUrl,
  collectionsUrl,
  aboutUsUrl,
  worksUrl,
  imagesUrl,
} from './helpers/urls';
import { gotoWithoutCache } from './helpers/contexts';

test.describe('With JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false }); // Turn off JS for tests in this block

  test(`the what's on page displays all events`, async ({ page }) => {
    await gotoWithoutCache(whatsOnUrl, page);
    const links = await page
      .getByRole('link', { name: 'View all events' })
      .all();
    const linksCount = links.length;

    for (let linkIndex = 0; linkIndex < linksCount; linkIndex++) {
      const link = links[linkIndex];
      await expect(link).toBeVisible();
    }
  });
});

test.describe('With JavaScript enabled', () => {
  test(`the what's on page displays events by months in tabs`, async ({
    page,
  }) => {
    await gotoWithoutCache(whatsOnUrl, page);
    const links = await page
      .getByRole('link', { name: 'View all events' })
      .all();
    const linksCount = links.length;

    for (let linkIndex = 0; linkIndex < linksCount; linkIndex++) {
      const link = links[linkIndex];
      if (linkIndex === 0) {
        await expect(link).toBeVisible();
      } else {
        await expect(link).toBeHidden();
      }
    }
  });
});

test.describe('Top-level landing pages', () => {
  test('the homepage renders with an accessible title', async ({ page }) => {
    await gotoWithoutCache(homepageUrl, page);
    const content = await page.textContent('h1');

    expect(content).toBe(
      'A free museum and library exploring health and human experience'
    );
  });

  test('the visit us page renders with an accessible title', async ({
    page,
  }) => {
    await gotoWithoutCache(visitUsUrl, page);
    const content = await page.textContent('h1');

    expect(content).toBe('Visit us');
  });

  test(`the what's on page renders with an accessible title`, async ({
    page,
  }) => {
    await gotoWithoutCache(whatsOnUrl, page);
    const content = await page.textContent('h1');

    expect(content).toBe('What’s on');
  });

  test('the stories page renders with an accessible title', async ({
    page,
  }) => {
    await gotoWithoutCache(storiesUrl, page);
    const content = await page.textContent('h1');

    expect(content).toBe('Stories');
  });

  test('the collections page renders with an accessible title', async ({
    page,
  }) => {
    await gotoWithoutCache(collectionsUrl, page);
    const content = await page.textContent('h1');

    expect(content).toBe('Collections');
  });

  test('the about us page renders with an accessible title', async ({
    page,
  }) => {
    await gotoWithoutCache(aboutUsUrl, page);
    const content = await page.textContent('h1');

    expect(content).toBe('About us');
  });

  test('the works page renders with an accessible title', async ({ page }) => {
    await gotoWithoutCache(worksUrl, page);
    const content = await page.textContent('h1');

    expect(content).toBe('Works search');
  });

  test('the images page renders with an accessible title', async ({ page }) => {
    await gotoWithoutCache(imagesUrl, page);
    const content = await page.textContent('h1');

    expect(content).toBe('Images search');
  });
});
