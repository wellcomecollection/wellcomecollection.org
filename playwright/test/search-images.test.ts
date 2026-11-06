import { Page } from '@playwright/test';

import { expect, test } from './helpers/analytics-blocking';
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

// The image details open in a modal, or in a sidebar once the imageSidebarPhases
// toggle is public. This finds whichever is showing, so these tests pass either
// way. Once the toggle is removed, the sidebar tests in image-sidebar.test.ts
// cover the same things, so tests (2) and (3) can go.
const imageDetails = (page: Page) =>
  page.getByTestId('image-modal').or(
    page.getByRole('region').filter({
      has: page.getByRole('button', { name: 'Close image details' }),
    })
  );

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

test('(2) | Image details | images without contributors still show a title', async ({
  page,
  context,
}) => {
  await search(context, page, 'images');
  await searchQuerySubmitAndWait('kd9h6gr3', page);
  await clickImageSearchResultItem(1, page);

  await expect(
    imageDetails(page).getByText('Fish. Watercolour drawing.')
  ).toBeVisible();
});

test('(3) | Image details | images with contributors show both title and contributor', async ({
  page,
  context,
}) => {
  await search(context, page, 'images');
  await searchQuerySubmitAndWait('fcmwqd5u', page);
  await clickImageSearchResultItem(1, page);

  const details = imageDetails(page);
  await expect(
    details.getByRole('heading', { name: 'Dr. Darwin.' })
  ).toBeVisible();
  await expect(details).toContainText('Fortey, W. S. (William Samuel)');
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
