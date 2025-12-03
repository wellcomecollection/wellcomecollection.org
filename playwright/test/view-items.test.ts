import { expect, Page, test } from '@playwright/test';

import {
  isMobile,
  itemWithAltText,
  itemWithNonRestrictedAndOpenAccess,
  itemWithOnlyOpenAccess,
  itemWithOnlyRestrictedAccess,
  itemWithReferenceNumber,
  itemWithRestrictedAndNonRestrictedAccess,
  itemWithRestrictedAndOpenAccess,
  itemWithSearchAndStructures,
  itemWithSearchAndStructuresAndQuery,
  multiVolumeItem,
} from './helpers/contexts';
import { apiResponse } from './mocks/search-within';

const accessSidebarOnMobile = async (page: Page) => {
  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Show info' }).click();
  }
};

test.describe.configure({ mode: 'parallel' });

test('(1) | The images can be zoomed', async ({ page, context }) => {
  await multiVolumeItem(context, page);
  await page.getByRole('button', { name: 'Zoom in' }).click();
  await expect(page.locator('.openseadragon-canvas')).toBeVisible();
});

test('(2) | The info panel visibility can be toggled', async ({
  page,
  context,
}) => {
  await multiVolumeItem(context, page);
  // The heading is found in the info panel, so is a proxy for whether it is hidden or not
  const heading = page.getByRole('heading').filter({
    hasText: 'Practica seu Lilium medicinae / [Bernard de Gordon].',
  });
  if (!isMobile(page)) {
    await expect(heading).toBeVisible();
    await page.getByRole('button', { name: 'Hide info' }).click();
    await expect(heading).toBeHidden();
  }
  // Info is hidden by default on mobile. It should cover the viewing
  // area on mobile, so we also want to ensure things that control
  // the viewing area are hidden when it is visible
  if (isMobile(page)) {
    await expect(heading).toBeHidden();
    await expect(page.getByRole('button', { name: 'Page' })).toBeVisible();
    await page.getByRole('button', { name: 'Show info' }).click();
    await expect(heading).toBeVisible();
    await expect(page.getByRole('button', { name: 'Page' })).toBeHidden();
  }
});

test('(3) | An image of the current canvas can be downloaded', async ({
  page,
  context,
}) => {
  await multiVolumeItem(context, page);
  await page.getByRole('button', { name: 'Downloads' }).click();

  const smallImageLink = page
    .getByRole('link')
    .filter({ hasText: 'This image (760x960 pixels)' });
  expect(await smallImageLink.getAttribute('href')).toEqual(
    'https://iiif.wellcomecollection.org/image/b10326947_hin-wel-all-00012266_0001.jp2/full/760%2C/0/default.jpg'
  );
});

test('(4) | The entire item can be downloaded', async ({ page, context }) => {
  await multiVolumeItem(context, page);
  await page.getByRole('button', { name: 'Downloads' }).click();

  const smallImageLink = page
    .getByRole('link')
    .filter({ hasText: 'Whole item' });
  expect(await smallImageLink.getAttribute('href')).toEqual(
    'https://iiif.wellcomecollection.org/pdf/b10326947_0001'
  );
});

test('(5) | The item has contributor information', async ({
  page,
  context,
}) => {
  await multiVolumeItem(context, page);
  await accessSidebarOnMobile(page);
  await expect(page.getByText('Bernard de Gordon')).toBeVisible();
});

test('(6) | The item has date information', async ({ page, context }) => {
  await multiVolumeItem(context, page);
  await accessSidebarOnMobile(page);
  await expect(page.getByText('Date:1496[7]')).toBeVisible();
});

test('(7) | The item has reference number information', async ({
  page,
  context,
}) => {
  await itemWithReferenceNumber(context, page);
  await accessSidebarOnMobile(page);
  await expect(page.getByText('Reference:WA/HMM/BU/1')).toBeVisible();
});

test('(8) | Licence information should be available', async ({
  page,
  context,
}) => {
  await itemWithSearchAndStructures(context, page);
  await accessSidebarOnMobile(page);
  await page.getByRole('button', { name: 'Licence and re-use' }).click();
  await expect(page.getByText('Licence:')).toBeVisible();
  await expect(page.getByText('Credit:')).toBeVisible();
});

test('(9) | The image should rotate', async ({ page, context }) => {
  await itemWithSearchAndStructures(context, page);
  await page.getByRole('button', { name: 'Rotate' }).click();
  const currentIndex = await page.getByTestId('active-index').textContent();
  const currentImageSrc = await page
    .getByTestId(`image-${Number(currentIndex) - 1}`)
    .getAttribute('src');
  // If the image url contains /90/default.jpg then the image is rotated 90 degrees
  expect(currentImageSrc).toContain('/90/default.jpg');
});

test('(10) | The volumes should be browsable', async ({ page, context }) => {
  await multiVolumeItem(context, page);
  await accessSidebarOnMobile(page);
  await page.getByRole('button', { name: 'Volumes' }).click();
  await expect(page.getByRole('link', { name: 'Copy 3' })).toBeVisible();
});

test('(11) | The multi-volume label should be appropriate', async ({
  page,
  context,
}) => {
  await multiVolumeItem(context, page);
  await accessSidebarOnMobile(page);
  expect(page.getByText('Copy 1'));
  await page.getByRole('button', { name: 'Volumes' }).click();
  await page.getByRole('link', { name: 'Copy 3' }).click();
  expect(await page.getByText('Copy 3').count());
});

test('(12) | The structured parts should be browseable', async ({
  page,
  context,
}) => {
  await multiVolumeItem(context, page);
  await accessSidebarOnMobile(page);
  expect(await page.getByTestId('active-index').textContent()).toEqual('1');
  await page.getByRole('button', { name: 'Contents' }).click();
  await page.getByRole('link', { name: 'Title Page' }).click();
  if (!isMobile(page)) {
    // we don't display this info on mobile as there is not enough room
    await expect(page.getByText('9/559')).toBeVisible();
  }
});

test('(13) | The main viewer can be scrolled all the way to the last slide', async ({
  page,
  context,
}) => {
  await itemWithSearchAndStructures(context, page);
  const mainScrollArea = page.getByTestId('main-viewer').locator('> div');
  await expect(mainScrollArea).toBeVisible();

  expect(
    await mainScrollArea.evaluate((element: HTMLElement) => {
      element.scrollTo(0, element.scrollHeight);
    })
  );

  await expect(page.getByTestId('image-67')).toBeInViewport();
});

test('(14) | The item should be searchable', async ({ page, context }) => {
  await itemWithSearchAndStructures(context, page);

  await accessSidebarOnMobile(page);

  await page.getByLabel('Search within this item').fill('darwin');
  await page.getByRole('button', { name: 'search within' }).click();
});

test('(15) | The location of the search results should be displayed', async ({
  page,
  context,
}) => {
  await page.route(
    'https://iiif.wellcomecollection.org/search/v1/b29338062?q=darwin',
    async route => {
      const json = apiResponse;
      await route.fulfill({ json });
    }
  );
  await itemWithSearchAndStructuresAndQuery(context, page);

  await accessSidebarOnMobile(page);

  await expect(
    page.getByRole('link').filter({ hasText: 'Found on image 5 / 68' })
  ).toBeVisible();
});

test('(16) | Images should have unique alt text', async ({ page, context }) => {
  await itemWithAltText({ canvasNumber: 2 }, context, page);
  await expect(page.getByAltText('22102033982')).toBeVisible();
  expect(await page.getByAltText('22102033982').count()).toEqual(1);
});

test('(17) | An item with only open access items will not display a modal and display the content', async ({
  page,
  context,
}) => {
  await itemWithOnlyOpenAccess(context, page);
  await expect(page.getByText('Show the content')).toBeHidden();
  await expect(page.getByTestId('image-0')).toBeInViewport();
});

test('(18) | An item with a mix of restricted and open access items will not display a modal and display the content', async ({
  page,
  context,
}) => {
  await itemWithRestrictedAndOpenAccess(context, page);
  await expect(page.getByText('Show the content')).toBeHidden();
  await expect(page.getByTestId('image-0')).toBeInViewport();
});

test('(19) | An item with only restricted access items will display a modal with no option to view the content', async ({
  page,
  context,
}) => {
  await itemWithOnlyRestrictedAccess(context, page);
  await expect(
    page.getByRole('heading', { name: 'Restricted material' })
  ).toBeVisible();
  await expect(page.getByText('Show the content')).toBeHidden();
  await expect(page.getByTestId('image-0')).toBeHidden();
});

test('(20) | An item with a mix of restricted and non-restricted access items will display a modal that offers access to the content', async ({
  page,
  context,
}) => {
  await itemWithRestrictedAndNonRestrictedAccess(context, page);

  await expect(
    page.getByRole('heading', { name: 'Content advisory' })
  ).toBeVisible();
  await expect(page.getByText('Show the content')).toBeVisible();
  await expect(page.getByTestId('image-0')).toBeHidden();
});

test('(21) | An item with a mix of non-restricted and open access items will display a modal that offers access to the content', async ({
  page,
  context,
}) => {
  await itemWithNonRestrictedAndOpenAccess(context, page);

  await expect(
    page.getByRole('heading', { name: 'Content advisory' })
  ).toBeVisible();
  await expect(page.getByText('Show the content')).toBeVisible();
  await expect(page.getByTestId('image-0')).toBeHidden();
});

test('(22) | Clicking thumbnail grid items updates the main viewer', async ({
  page,
  context,
}) => {
  await multiVolumeItem(context, page);

  // Get the initial canvas number from the URL
  const initialUrl = page.url();
  expect(initialUrl).toContain('/works/mg56yqa4/items');

  // Open the thumbnail grid by clicking the Grid button
  const gridButton = page.getByRole('button', { name: 'Grid' });
  await expect(gridButton).toBeVisible();
  await gridButton.click();

  // Wait for thumbnail grid to appear - it slides up with CSS animation
  await page.waitForTimeout(1000);

  // Look for NextLink elements that are actually in the grid overlay
  // These will be link elements that contain canvas parameters and are currently visible
  const allCanvasLinks = page.locator('a[href*="canvas="]');

  // Filter to only visible links (grid links become visible after animation)
  const visibleCanvasLinks = allCanvasLinks.filter({
    has: page.locator('img'),
  });

  await expect(visibleCanvasLinks.first()).toBeVisible();

  // Get count of available thumbnails
  const thumbnailCount = await visibleCanvasLinks.count();

  // Ensure we have at least 2 thumbnails
  expect(thumbnailCount).toBeGreaterThanOrEqual(2);

  // Click the 2nd thumbnail (index 1) to navigate to canvas=3
  await visibleCanvasLinks.nth(1).click();

  // Wait for URL to update with canvas parameter (should be canvas=3)
  await page.waitForURL(/.*canvas=3.*/);

  // Verify the URL has been updated with the correct canvas parameter
  const updatedUrl = page.url();
  expect(updatedUrl).toContain('canvas=3');

  // Verify the active canvas indicator shows the correct number
  if (!isMobile(page)) {
    await expect(page.getByTestId('active-index')).toHaveText('3');
  }

  // Verify the correct image is now in the viewport (canvas 3 = image index 2)
  await expect(page.getByTestId('image-2')).toBeInViewport();
});
