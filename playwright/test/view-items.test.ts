import { Page, test as base, expect } from '@playwright/test';
import {
  multiVolumeItem,
  multiVolumeItem2,
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
import {
  zoomInButton,
  rotateButton,
  openseadragonCanvas,
  fullscreenButton,
  downloadsButton,
  itemDownloadsModal,
  smallImageDownload,
  fullItemDownload,
  workContributors,
  workDates,
  viewerSidebar,
  mobilePageGridButtons,
  toggleInfoDesktop,
  toggleInfoMobile,
  referenceNumber,
  mainViewer,
  searchWithinResultsHeader,
} from './selectors/item';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleCookies } from './helpers/utils';
import safeWaitForNavigation from './helpers/safeWaitForNavigation';

const domain = new URL(baseUrl).host;

const volumesNavigationLabel = 'Volumes navigation';
const searchWithinLabel = 'Search within this item';

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

// We've repeatedly had tests in this test file (not always the same one) fail once on a timeout, only to always pass on a retry.
// I'll allow this file to retry once, see if it helps and makes our alerts more relevant.
// I'm also allowing them to run in parallel, hoping it'll help with timeouts as its considered a slow test file.
test.describe.configure({ mode: 'parallel', retries: 1 });

test('(1) | The images are scalable', async ({ page, context }) => {
  await multiVolumeItem(context, page);

  if (!isMobile(page)) {
    // TODO work out why this is causing issues on mobile
    await page.click(fullscreenButton);
  }
  // check full screen
  await page.click(zoomInButton);
  await page.waitForSelector(openseadragonCanvas);
  // make sure we can actually see deep zoom
  const isVisible = await page.isVisible(openseadragonCanvas);
  expect(isVisible).toBeTruthy();
});

test('(2) | The info panel visibility can be toggled', async ({
  page,
  context,
}) => {
  await multiVolumeItem(context, page);
  if (!isMobile(page)) {
    const isVisibleBefore = await page.isVisible(viewerSidebar);
    expect(isVisibleBefore).toBeTruthy();
    await page.click(toggleInfoDesktop);
    const isVisibleAfter = await page.isVisible(viewerSidebar);
    expect(isVisibleAfter).toBeFalsy();
  }

  // Info is hidden by default on mobile. It covers the viewing
  // area on mobile, so we want to ensure things that control
  // the viewing area are also hidden when it is visible
  if (isMobile(page)) {
    const isSidebarVisibleBefore = await page.isVisible(viewerSidebar);
    const isMobilePageGridButtonVisibleBefore = await page.isVisible(
      mobilePageGridButtons
    );

    expect(isSidebarVisibleBefore).toBeFalsy();
    expect(isMobilePageGridButtonVisibleBefore).toBeTruthy();

    await page.click(toggleInfoMobile);
    const isSidebarVisibleAfter = await page.isVisible(viewerSidebar);
    const isMobilePageGridButtonVisibleAfter = await page.isVisible(
      mobilePageGridButtons
    );

    expect(isSidebarVisibleAfter).toBeTruthy();
    expect(isMobilePageGridButtonVisibleAfter).toBeFalsy();
  }
});

const smallImageDownloadUrl =
  'https://iiif.wellcomecollection.org/image/b10326947_hin-wel-all-00012266_0001.jp2/full/full/0/default.jpg';
const fullItemDownloadUrl =
  'https://iiif.wellcomecollection.org/pdf/b10326947_0001';

const multiVolumeTest = test.extend({
  page: async ({ page, context }, use) => {
    await multiVolumeItem(context, page);
    await page.click(downloadsButton);
    await page.waitForSelector(itemDownloadsModal);
    await use(page);
  },
});

multiVolumeTest(
  '(3) | Downloading an image of the current canvas',
  async ({ page }) => {
    const smallImageDownloadElement = await page.waitForSelector(
      smallImageDownload
    );
    const imageDownloadUrl = await smallImageDownloadElement.getAttribute(
      'href'
    );

    expect(imageDownloadUrl).toBe(smallImageDownloadUrl);
  }
);

multiVolumeTest('(4) | Downloading the entire item', async ({ page }) => {
  const fullItemDownloadElement = await page.waitForSelector(fullItemDownload);
  const fullDownloadUrl = await fullItemDownloadElement.getAttribute('href');

  expect(fullDownloadUrl).toBe(fullItemDownloadUrl);
});

test('(5) | The item has a title', async ({ page, context }) => {
  await multiVolumeItem(context, page);
  const title = await page.textContent('h1');
  expect(title).toBe('Practica seu Lilium medicinae / [Bernard de Gordon].');
});

test('(6) | The item has contributor information', async ({
  page,
  context,
}) => {
  await multiVolumeItem(context, page);
  const contributors = await page.textContent(workContributors);
  expect(contributors).toBe(
    'Bernard, de Gordon, approximately 1260-approximately 1318.'
  );
});

test('(7) | The item has date information', async ({ page, context }) => {
  await multiVolumeItem(context, page);
  const dates = await page.textContent(workDates);
  // TODO: this text isn't very explanitory and should probably be updated in the DOM
  expect(dates).toBe('Date:1496[7]');
});

test('(8) | The item has reference number information', async ({
  page,
  context,
}) => {
  await itemWithReferenceNumber(context, page);
  const dates = await page.textContent(referenceNumber);
  expect(dates).toBe('Reference:WA/HMM/BU/1');
});

test('(9) | Licence information should be available', async ({
  page,
  context,
}) => {
  await itemWithSearchAndStructures(context, page);
  if (isMobile(page)) {
    await page.click('text="Show info"');
  }
  await page.getByTestId('licence-and-reuse').click();
  await page.waitForSelector(`css=body >> text="Licence:"`);
  await page.waitForSelector(`css=body >> text="Credit:"`);
});

test('(10) | The image should rotate', async ({ page, context }) => {
  await itemWithSearchAndStructures(context, page);
  await page.waitForSelector(rotateButton);
  await page.click(rotateButton);
  if (!isMobile(page)) {
    const currentIndex = await page.textContent('[data-test-id=active-index]');
    const currentImageSrc = await page.getAttribute(
      `[data-test-id=canvas-${Number(currentIndex) - 1}] img`,
      'src'
    );
    expect(currentImageSrc).toContain('/90/default.jpg');
  }
});

test('(11) | The volumes should be browsable', async ({ page, context }) => {
  if (!isMobile(page)) {
    await multiVolumeItem(context, page);
    await safeWaitForNavigation(page);
    await page.waitForSelector(`css=body >> text="Volumes"`);
    await page.click('text="Volumes"');
    const navigationSelector = `nav [aria-label="${volumesNavigationLabel}"]`;
    await page.waitForSelector(navigationSelector);

    const navigationVisible = await page.isVisible(navigationSelector);
    expect(navigationVisible).toBeTruthy();

    const currentManifestLinkLabel = await page.textContent(
      `${navigationSelector} a[aria-current="page"]`
    );

    const currentManifestLabel = await page.textContent(
      '[data-test-id=current-manifest]'
    );

    expect(currentManifestLinkLabel).toEqual(currentManifestLabel);

    const nextManifestLinkSelector = `${navigationSelector} a:not([aria-current="page"])`;
    const nextManifestLinkLabel = await page.textContent(
      nextManifestLinkSelector
    );

    await page.click(nextManifestLinkSelector);

    await page.waitForSelector(
      `css=[data-test-id=current-manifest] >> text="${nextManifestLinkLabel}"`
    );
  }

  test('(12) | The multi-volume label should be appropriate', async ({
    page,
    context,
  }) => {
    if (!isMobile(page)) {
      await multiVolumeItem(context, page);
      await page.waitForSelector(
        `css=[data-test-id=current-manifest] >> text="Copy 1"`
      );

      await multiVolumeItem2(context, page);
      await page.waitForSelector(
        `css=[data-test-id=current-manifest] >> text="Volume 1"`
      );
    }
  });
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

const scrollToBottom = async (selector: string, page: Page) => {
  // TODO move all these to the top
  await page.$eval(selector, (element: HTMLElement) => {
    element.scrollTo(0, element.scrollHeight);
  });
};

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
