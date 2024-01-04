import { Page, test, expect } from '@playwright/test';
import { isMobile, newSearch } from './helpers/contexts';
import { expectItemIsVisible } from './asserts/common';
import safeWaitForNavigation from './helpers/safeWaitForNavigation';
import { searchQuerySubmitAndWait } from './helpers/search';

const regexImageGalleryUrl = /\/works\/[a-zA-Z0-9]+\/images[?]id=/;

const expectUrlToMatch = (regex: RegExp | string, page: Page): void => {
  const condition = RegExp(regex);
  expect(condition.test(page.url())).toBeTruthy();
};

const clickActionClickSearchResultItem = async (
  nthChild: number,
  page: Page
): Promise<void> => {
  await page
    .getByTestId('image-search-results-container')
    .locator(`ul:first-child > li:nth-child(${nthChild}) a`)
    .click();
};

test('(1) | Search by term, filter by colour, check results, view image details, view expanded image', async ({
  page,
  context,
}) => {
  await newSearch(context, page, 'images');
  await searchQuerySubmitAndWait('art of science', page);

  if (isMobile(page)) {
    await page.locator('button[aria-controls="mobile-filters-modal"]').click();
    await expect(await page.locator('#mobile-filters-modal')).toBeVisible();
    await page.getByTestId('swatch-red').click();
    await page.getByRole('button', { name: 'Close modal window' }).click();
  } else {
    await page.locator('button[aria-controls="images.color"]').click();
    await page.getByRole('button', { name: 'Red', exact: true }).click();
    await page.locator('button[aria-controls="images.color"]').click();
  }
  await expect(
    await page.getByTestId('image-search-results-container')
  ).toBeVisible();
  await expect(
    await page
      .locator('[data-testid="image-search-results-container"] li')
      .first()
  ).toBeVisible();
  await clickActionClickSearchResultItem(1, page);
  await expect(
    await page.locator('a[aria-label="View expanded image"]')
  ).toBeVisible();

  // Check we show visually similar images.  This could theoretically fail
  // if the first result doesn't have any similar images, but if it fails
  // it's much more likely we've broken something on the page.
  await expectItemIsVisible('h3 >> text="Visually similar images"', page);

  await Promise.all([
    safeWaitForNavigation(page),
    page.click(
      `div[id="expanded-image-dialog"] a[aria-label="View expanded image"]`
    ),
  ]);
  expectUrlToMatch(regexImageGalleryUrl, page);
});

test('(2) | Image Modal | images without contributors still show a title', async ({
  page,
  context,
}) => {
  await newSearch(context, page, 'images');
  await searchQuerySubmitAndWait('kd9h6gr3', page);

  await clickActionClickSearchResultItem(1, page);
  await expect(page.getByText('Fish. Watercolour drawing.')).toBeVisible();
});

test('(3) | Image Modal | images with contributors show both title and contributor', async ({
  page,
  context,
}) => {
  await newSearch(context, page, 'images');
  await searchQuerySubmitAndWait('fcmwqd5u', page);
  await clickActionClickSearchResultItem(1, page);
  await expect(
    page.getByRole('heading', { name: 'Dr. Darwin.' })
  ).toBeVisible();
  await expect(page.getByText('Fortey, W. S. (William Samuel)')).toBeVisible();
});
