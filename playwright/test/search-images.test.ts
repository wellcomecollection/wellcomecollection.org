import { expect, test } from '@playwright/test';

import { isMobile, search } from './helpers/contexts';
import {
  clickImageSearchResultItem,
  openFilterDropdown,
  searchQuerySubmitAndWait,
  selectAndWaitForColourFilter,
  testIfFilterIsApplied,
} from './helpers/search';
import { ItemViewerURLRegex } from './helpers/utils';

test.describe.configure({ mode: 'parallel' });

test('(1) | Search by term, filter by colour, check results, view image details, view expanded image', async ({
  page,
  context,
}) => {
  await search(context, page, 'images');
  await searchQuerySubmitAndWait('art of science', page);

  await selectAndWaitForColourFilter(page);
  await expect(
    page.getByTestId('image-search-results-container')
  ).toBeVisible();
  await clickImageSearchResultItem(1, page);

  // Check we show visually similar images.  This could theoretically fail
  // if the first result doesn't have any similar images, but if it fails
  // it's much more likely we've broken something on the page.
  await expect(
    page.getByRole('heading', { name: 'Visually similar images' })
  ).toBeVisible();

  await page.getByRole('link', { name: 'View expanded image' }).click();
  await expect(page).toHaveURL(RegExp(ItemViewerURLRegex));
});

test('(2) | Image Modal | images without contributors still show a title', async ({
  page,
  context,
}) => {
  await search(context, page, 'images');
  await searchQuerySubmitAndWait('kd9h6gr3', page);
  await clickImageSearchResultItem(1, page);

  await expect(
    page.getByTestId('image-modal').getByText('Fish. Watercolour drawing.')
  ).toBeVisible();
});

test('(3) | Image Modal | images with contributors show both title and contributor', async ({
  page,
  context,
}) => {
  await search(context, page, 'images');
  await searchQuerySubmitAndWait('fcmwqd5u', page);
  await clickImageSearchResultItem(1, page);

  const imageModal = await page.getByTestId('image-modal');
  await expect(
    imageModal.getByRole('heading', { name: 'Dr. Darwin.' })
  ).toBeVisible();
  await expect(imageModal).toContainText('Fortey, W. S. (William Samuel)');
});

test('(4) | Search for images between dates; there is a list of results', async ({
  page,
  context,
}) => {
  await search(context, page, 'images');
  await searchQuerySubmitAndWait('instruments', page);
  await openFilterDropdown('Dates', page);

  await page
    .getByRole('spinbutton', { name: 'From', exact: true })
    .fill('1812');

  await page.getByRole('spinbutton', { name: 'to', exact: true }).fill('1870');

  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Show results' }).click();
  }

  await testIfFilterIsApplied('From 1812', page);
  await testIfFilterIsApplied('To 1870', page);

  await expect(
    page.locator('[data-testid="image-search-results-container"] li')
  ).toHaveCount(30);
});
