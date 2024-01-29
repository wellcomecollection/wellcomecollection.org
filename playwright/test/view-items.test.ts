import { Page, test as base, expect } from '@playwright/test';
import {
  multiVolumeItem,
  itemWithSearchAndStructures,
  itemWithReferenceNumber,
  itemWithAltText,
  itemWithOnlyOpenAccess,
  itemWithOnlyRestrictedAccess,
  itemWithRestrictedAndOpenAccess,
  itemWithRestrictedAndNonRestrictedAccess,
  itemWithNonRestrictedAndOpenAccess,
  isMobile,
} from './helpers/contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleCookies, scrollToBottom } from './helpers/utils';
import safeWaitForNavigation from './helpers/safeWaitForNavigation';

const searchWithinResultsHeader = `[data-test-id="results-header"]`;
const mainViewer = `[data-test-id=main-viewer] > div`;
const searchWithinLabel = 'Search within this item';

const domain = new URL(baseUrl).host;

const searchWithin = async (query: string, page: Page) => {
  await page.fill(`text=${searchWithinLabel}`, query);
  await page.press(`text=${searchWithinLabel}`, 'Enter');
};

const test = base.extend({
  context: async ({ context }, use) => {
    const defaultToggleAndTestCookies = await makeDefaultToggleCookies(domain);
    await context.addCookies([
      { name: 'WC_cookiesAccepted', value: 'true', domain, path: '/' },
      ...defaultToggleAndTestCookies,
    ]);
    await use(context);
  },
});

const multiVolumeTest = test.extend({
  page: async ({ page, context }, use) => {
    await multiVolumeItem(context, page);
    await page.getByRole('button', { name: 'Downloads' }).click();
    await use(page);
  },
});

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

multiVolumeTest(
  '(3) | An image of the current canvas can be downloaded',
  async ({ page }) => {
    const smallImageLink = page
      .getByRole('link')
      .filter({ hasText: 'This image (760x960 pixels)' });
    expect(await smallImageLink.getAttribute('href')).toEqual(
      'https://iiif.wellcomecollection.org/image/b10326947_hin-wel-all-00012266_0001.jp2/full/760%2C/0/default.jpg'
    );
  }
);

multiVolumeTest('(4) | The entire item can be downloaded', async ({ page }) => {
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
  await expect(
    page.getByText('Bernard, de Gordon, approximately 1260-approximately 1318.')
  ).toBeVisible();
});

test('(6) | The item has date information', async ({ page, context }) => {
  await multiVolumeItem(context, page);
  await expect(page.getByText('Date:1496[7]')).toBeVisible();
});

test('(7) | The item has reference number information', async ({
  page,
  context,
}) => {
  await itemWithReferenceNumber(context, page);
  await expect(page.getByText('Reference:WA/HMM/BU/1')).toBeVisible();
});

test('(8) | Licence information should be available', async ({
  page,
  context,
}) => {
  await itemWithSearchAndStructures(context, page);
  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Show info' }).click();
  }
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
  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Show info' }).click();
  }
  await page.getByRole('button', { name: 'Volumes' }).click();
  await expect(page.getByRole('link', { name: 'Copy 3' })).toBeVisible();
});

test.only('(11) | The multi-volume label should be appropriate', async ({
  page,
  context,
}) => {
  await multiVolumeItem(context, page);
  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Show info' }).click();
  }
  expect(await page.getByTestId('manifest-label').textContent()).toEqual(
    'Copy 1'
  );
  await page.getByRole('button', { name: 'Volumes' }).click();
  await page.getByRole('link', { name: 'Copy 3' }).click();
  expect(await page.getByTestId('manifest-label').textContent()).toEqual(
    'Copy 3'
  );
});

test('(13) | The structured parts should be browseable', async ({
  page,
  context,
}) => {
  await itemWithSearchAndStructures(context, page);
  await safeWaitForNavigation(page);
  if (isMobile(page)) {
    await page.click('text="Show info"');
  }
  await page.click('css=body >> text="Contents"');
  await page.waitForSelector('css=body >> text="Title Page"');
  await page.click('text="Title Page"');
  if (!isMobile(page)) {
    await page.waitForSelector(`css=[data-test-id=active-index] >> text="5"`);
  }
});

test('(14) | The main viewer can be scrolled', async ({ page, context }) => {
  await itemWithSearchAndStructures(context, page);
  await page.waitForSelector(mainViewer);
  await scrollToBottom(mainViewer, page);

  // In this test, we're loading an item with 68 pages, scrolling to the
  // bottom, then looking for the "68/68" text on the page.
  //
  // This text is hidden whenever the window is being scrolled, zoomed,
  // or resized, because that might affect what the "current" page is.
  //
  // We've had issues with this test being flaky, because we don't wait
  // long enough after we finish scrolling to look for this "68/68" --
  // tossing in this wait seems to fix that.
  await safeWaitForNavigation(page);

  await page.waitForSelector(
    `css=[data-test-id=active-index] >> text="68"`,

    // The "68/68" label isn't visible on small screens, but the element
    // will still be on the page.
    { state: isMobile(page) ? 'attached' : 'visible' }
  );
});

test('(15) | The item should be searchable', async ({ page, context }) => {
  await itemWithSearchAndStructures(context, page);
  await safeWaitForNavigation(page);
  if (isMobile(page)) {
    await page.click('text="Show info"');
  }
  await searchWithin('darwin', page);
  await page.waitForSelector(searchWithinResultsHeader);
  await page.click(`${searchWithinResultsHeader} + ul li:first-of-type a`);
  if (!isMobile(page)) {
    await page.waitForSelector(`css=[data-test-id=active-index] >> text="5"`);
  }
});

test('(16) | Images should have alt text', async ({ page, context }) => {
  await itemWithAltText({ canvasNumber: 2 }, context, page);
  await page.waitForSelector(`img[alt='22102033982']`);
});

test('(17) | Image alt text should be unique', async ({ page, context }) => {
  await itemWithAltText({ canvasNumber: 2 }, context, page);
  await page.waitForSelector(`img[alt='22102033982']`);
  const imagesWithSameText = await page.$$(`img[alt='22102033982']`);
  expect(imagesWithSameText.length).toBe(1);
});

test('(18) | An item with only open access items will not display a modal', async ({
  page,
  context,
}) => {
  await itemWithOnlyOpenAccess(context, page);
  await page.waitForSelector(`css=[data-test-id="canvas-0"] img`);
  expect(
    await page.isVisible(`button:has-text('Show the content')`)
  ).toBeFalsy();
});

test('(19) | An item with a mix of restricted and open access items will not display a modal', async ({
  page,
  context,
}) => {
  await itemWithRestrictedAndOpenAccess(context, page);
  await page.waitForSelector(`css=[data-test-id="canvas-0"] img`);
  expect(
    await page.isVisible(`button:has-text('Show the content')`)
  ).toBeFalsy();
});

test('(20) | An item with only restricted access items will display a modal with no option to view the content', async ({
  page,
  context,
}) => {
  await itemWithOnlyRestrictedAccess(context, page);
  await page.waitForSelector(`h2:has-text('Restricted material')`);
  expect(
    await page.isVisible(`button:has-text('Show the content')`)
  ).toBeFalsy();
  expect(await page.isVisible(`css=[data-test-id="canvas-0"] img`)).toBeFalsy();
});

test('(21) | An item with a mix of restricted and non-restricted access items will display a modal', async ({
  page,
  context,
}) => {
  await itemWithRestrictedAndNonRestrictedAccess(context, page);
  await page.waitForSelector(`button:has-text('Show the content')`);
  expect(await page.isVisible(`css=[data-test-id="canvas-0"] img`)).toBeFalsy();
});

test('(22) | An item with a mix of non-restricted and open access items will display a modal', async ({
  page,
  context,
}) => {
  await itemWithNonRestrictedAndOpenAccess(context, page);
  await page.waitForSelector(`button:has-text('Show the content')`);
  expect(await page.isVisible(`css=[data-test-id="canvas-0"] img`)).toBeFalsy();
});
