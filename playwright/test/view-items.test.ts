import { test as base, expect } from '@playwright/test';
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
} from './contexts';
import { volumesNavigationLabel, searchWithinLabel } from './text/aria-labels';
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
  searchWithinResultsHeader,
  mainViewer,
  viewerSidebar,
  mobilePageGridButtons,
  toggleInfoDesktop,
  toggleInfoMobile,
  referenceNumber,
} from './selectors/item';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleCookies } from './helpers/utils';
import { Page } from 'playwright';
import safeWaitForNavigation from './helpers/safeWaitForNavigation';

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

test.describe('Scenario 1: A user wants a large-scale view of an item', () => {
  test('the images are scalable', async ({ page, context }) => {
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

  test('the info panel visibility can be toggled', async ({
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
});

test.describe('Scenario 2: A user wants to use the content offline', () => {
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
    'downloading an image of the current canvas',
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

  multiVolumeTest('downloading the entire item', async ({ page }) => {
    const fullItemDownloadElement = await page.waitForSelector(
      fullItemDownload
    );
    const fullDownloadUrl = await fullItemDownloadElement.getAttribute('href');

    expect(fullDownloadUrl).toBe(fullItemDownloadUrl);
  });
});

test.describe('Scenario 3: A user wants information about the item they are viewing', () => {
  test('the item has a title', async ({ page, context }) => {
    await multiVolumeItem(context, page);
    const title = await page.textContent('h1');
    expect(title).toBe('Practica seu Lilium medicinae / [Bernard de Gordon].');
  });

  test('the item has contributor information', async ({ page, context }) => {
    await multiVolumeItem(context, page);
    const contributors = await page.textContent(workContributors);
    expect(contributors).toBe(
      'Bernard, de Gordon, approximately 1260-approximately 1318'
    );
  });

  test('the item has date information', async ({ page, context }) => {
    await multiVolumeItem(context, page);
    const dates = await page.textContent(workDates);
    // TODO: this text isn't very explanitory and should probably be updated in the DOM
    expect(dates).toBe('Date:1496[7]');
  });

  test('the item has reference number information', async ({
    page,
    context,
  }) => {
    await itemWithReferenceNumber(context, page);
    const dates = await page.textContent(referenceNumber);
    expect(dates).toBe('Reference:WA/HMM/BU/1');
  });
});

test.describe('Scenario 4: A user wants to know how they can make use of an item', () => {
  test('licence information should be available', async ({ page, context }) => {
    await itemWithSearchAndStructures(context, page);
    if (isMobile(page)) {
      await page.click('text="Show info"');
    }
    await page.click('text="Licence and credit"');
    await page.waitForSelector(`css=body >> text="Licence:"`);
    await page.waitForSelector(`css=body >> text="Credit:"`);
  });
});

test.describe('Scenario 5: A user wants to view an item in a different orientation', () => {
  test('the image should rotate', async ({ page, context }) => {
    await itemWithSearchAndStructures(context, page);
    await page.waitForSelector(rotateButton);
    await page.click(rotateButton);
    if (!isMobile(page)) {
      const currentIndex = await page.textContent(
        '[data-test-id=active-index]'
      );
      const currentImageSrc = await page.getAttribute(
        `[data-test-id=canvas-${Number(currentIndex) - 1}] img`,
        'src'
      );
      expect(currentImageSrc).toContain('/90/default.jpg');
    }
  });
});

test.describe('Scenario 6: Item has multiple volumes', () => {
  test('the volumes should be browsable', async ({ page, context }) => {
    if (!isMobile(page)) {
      await multiVolumeItem(context, page);
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
  });

  test('the multi-volume label should be appropriate', async ({
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

test.describe('Scenario 7: A user wants to navigate an item by its parts', () => {
  test('the structured parts should be browseable', async ({
    page,
    context,
  }) => {
    await itemWithSearchAndStructures(context, page);
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
});

const scrollToBottom = async (selector: string, page: Page) => {
  await page.$eval(selector, (element: HTMLElement) => {
    element.scrollTo(0, element.scrollHeight);
  });
};

test.describe('Scenario 8: A user wants to be able to see all the images for an item', () => {
  test('the main viewer can be scrolled', async ({ page, context }) => {
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
});

test.describe("Scenario 9: A user wants to be able to search inside an item's text", () => {
  test('the item should be searchable', async ({ page, context }) => {
    await itemWithSearchAndStructures(context, page);
    if (isMobile(page)) {
      await page.click('text="Show info"');
    }
    await searchWithin('darwin', page);
    await page.waitForSelector(searchWithinResultsHeader);
    await page.click(
      `${searchWithinResultsHeader} + ul li:first-of-type button`
    );
    if (!isMobile(page)) {
      await page.waitForSelector(`css=[data-test-id=active-index] >> text="5"`);
    }
  });
});

test.describe('Scenario 10: A user wants to be able to access alt text for the images', () => {
  test('images should have alt text', async ({ page, context }) => {
    await itemWithAltText({ canvasNumber: 2 }, context, page);
    await page.waitForSelector(`img[alt='22102033982']`);
  });

  test('image alt text should be unique', async ({ page, context }) => {
    await itemWithAltText({ canvasNumber: 2 }, context, page);
    await page.waitForSelector(`img[alt='22102033982']`);
    const imagesWithSameText = await page.$$(`img[alt='22102033982']`);
    expect(imagesWithSameText.length).toBe(1);
  });
});

test.describe('Scenario 11: A user wants to view an item with access restrictions', () => {
  test('an item with only open access items will not display a modal', async ({
    page,
    context,
  }) => {
    await itemWithOnlyOpenAccess(context, page);
    await page.waitForSelector(`css=[data-test-id="canvas-0"] img`);
    expect(
      await page.isVisible(`button:has-text('Show the content')`)
    ).toBeFalsy();
  });

  test('an item with a mix of restricted and open access items will not display a modal', async ({
    page,
    context,
  }) => {
    await itemWithRestrictedAndOpenAccess(context, page);
    await page.waitForSelector(`css=[data-test-id="canvas-0"] img`);
    expect(
      await page.isVisible(`button:has-text('Show the content')`)
    ).toBeFalsy();
  });

  test('an item with only restricted access items will display a modal with no option to view the content', async ({
    page,
    context,
  }) => {
    await itemWithOnlyRestrictedAccess(context, page);
    await page.waitForSelector(`h2:has-text('Restricted material')`);
    expect(
      await page.isVisible(`button:has-text('Show the content')`)
    ).toBeFalsy();
    expect(
      await page.isVisible(`css=[data-test-id="canvas-0"] img`)
    ).toBeFalsy();
  });

  test('an item with a mix of restricted and non-restricted access items will display a modal', async ({
    page,
    context,
  }) => {
    await itemWithRestrictedAndNonRestrictedAccess(context, page);
    await page.waitForSelector(`button:has-text('Show the content')`);
    expect(
      await page.isVisible(`css=[data-test-id="canvas-0"] img`)
    ).toBeFalsy();
  });

  test('an item with a mix of non-restricted and open access items will display a modal', async ({
    page,
    context,
  }) => {
    await itemWithNonRestrictedAndOpenAccess(context, page);
    await page.waitForSelector(`button:has-text('Show the content')`);
    expect(
      await page.isVisible(`css=[data-test-id="canvas-0"] img`)
    ).toBeFalsy();
  });
});
