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
  test(`the what's on page displays events by months in switchable tabs, only current/active month being visible`, async ({
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
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'A free museum and library exploring health and human experience'
    );
  });

  test('the visit us page renders with an accessible title', async ({
    page,
  }) => {
    await gotoWithoutCache(visitUsUrl, page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Visit us'
    );
  });

  test(`the what's on page renders with an accessible title`, async ({
    page,
  }) => {
    await gotoWithoutCache(whatsOnUrl, page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'What’s on'
    );
  });

  test('the stories page renders with an accessible title', async ({
    page,
  }) => {
    await gotoWithoutCache(storiesUrl, page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Stories'
    );
  });

  test('the collections page renders with an accessible title', async ({
    page,
  }) => {
    await gotoWithoutCache(collectionsUrl, page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Collections'
    );
  });

  test('the about us page renders with an accessible title', async ({
    page,
  }) => {
    await gotoWithoutCache(aboutUsUrl, page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'About us'
    );
  });

  test('the works page renders with an accessible title', async ({ page }) => {
    await gotoWithoutCache(worksUrl, page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Works search'
    );
  });

  test('the images page renders with an accessible title', async ({ page }) => {
    await gotoWithoutCache(imagesUrl, page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Images search'
    );
  });
});
