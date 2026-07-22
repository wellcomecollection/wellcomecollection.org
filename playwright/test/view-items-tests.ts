// Shared test definitions for the item viewer.
// Both view-items.test.ts (legacy) and view-items-refactored.test.ts
// (refactored) call defineViewItemTests with their own `test` and `expect`.

import type { BrowserContext, Expect, Page, TestType } from '@playwright/test';

import {
  isMobile,
  itemWithAltText,
  itemWithAudio,
  itemWithMixedBornDigital,
  itemWithNonRestrictedAndOpenAccess,
  itemWithOnlyOpenAccess,
  itemWithOnlyRestrictedAccessImages,
  itemWithOnlyRestrictedAccessNonImages,
  itemWithPdf,
  itemWithReferenceNumber,
  itemWithRestrictedAndNonRestrictedAccess,
  itemWithRestrictedAndOpenAccess,
  itemWithSearchAndStructures,
  itemWithSearchAndStructuresAndQuery,
  itemWithVideo,
  multiVolumeItem,
} from './helpers/contexts';
import { apiResponse } from './mocks/search-within';

const accessSidebarOnMobile = async (page: Page) => {
  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Show info' }).click();
  }
};

const checkDownloadsAvailable = async (page: Page, expect: Expect) => {
  await expect(page.locator('#itemDownloads')).toHaveAttribute('inert');
  await page.locator('[aria-controls="itemDownloads"]').click();
  await expect(page.locator('#itemDownloads')).not.toHaveAttribute('inert');
  await expect(page.locator('#itemDownloads a')).not.toHaveCount(0);
};

const checkInfoPanelHasHeading = async (page: Page, expect: Expect) => {
  await accessSidebarOnMobile(page);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
};

const checkPageIndicator = async (
  page: Page,
  expect: Expect,
  expectedText: string,
  location: 'topbar' | 'bottombar'
) => {
  const bar = page.locator(`[data-testid="${location}"]`);
  await expect(bar.getByText(expectedText)).toBeVisible();
};

const checkAriaSelected = async (
  page: Page,
  expect: Expect,
  expectedText: string,
  shouldBeVisible: boolean
) => {
  const listItem = page.locator('[aria-selected="true"]');
  if (shouldBeVisible) {
    await expect(listItem).toBeVisible();
  } else {
    await expect(listItem).toBeHidden();
  }
  await expect(listItem).toContainText(expectedText);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineViewItemTests(test: TestType<any, any>, expect: Expect) {
  test.describe.configure({ mode: 'parallel' });

  test('(1) | The images can be zoomed', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);
    await page.getByRole('button', { name: 'Zoom in' }).click();
    await expect(page.locator('.openseadragon-canvas')).toBeVisible();
  });

  test('(2) | The info panel visibility can be toggled', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);
    const heading = page.getByRole('heading').filter({
      hasText: 'Practica seu Lilium medicinae / [Bernard de Gordon].',
    });
    if (!isMobile(page)) {
      await expect(heading).toBeVisible();
      await page.getByRole('button', { name: 'Hide info' }).click();
      await expect(heading).toBeHidden();
    }
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
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);
    await checkDownloadsAvailable(page, expect);

    const smallImageLink = page
      .getByRole('link')
      .filter({ hasText: 'This image (760x960 pixels)' });
    expect(await smallImageLink.getAttribute('href')).toEqual(
      'https://iiif.wellcomecollection.org/image/b10326947_hin-wel-all-00012266_0001.jp2/full/760%2C/0/default.jpg'
    );
  });

  test('(4) | The entire item can be downloaded', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);
    await checkDownloadsAvailable(page, expect);

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
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);
    await accessSidebarOnMobile(page);
    await expect(
      page.getByText('Bernard de Gordon', { exact: true })
    ).toBeVisible();
  });

  test('(6) | The item has date information', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);
    await accessSidebarOnMobile(page);
    await expect(page.getByText('Date:1496[7]')).toBeVisible();
  });

  test('(7) | The item has reference number information', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithReferenceNumber(context, page);
    await accessSidebarOnMobile(page);
    await expect(page.getByText('Reference:WA/HMM/BU/1')).toBeVisible();
  });

  test('(8) | Licence information should be available', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithSearchAndStructures(context, page);
    await accessSidebarOnMobile(page);
    await page.getByRole('button', { name: 'Licence and re-use' }).click();
    await expect(page.getByText('Licence:')).toBeVisible();
    await expect(page.getByText('Credit:')).toBeVisible();
  });

  test('(9) | The image should rotate', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithSearchAndStructures(context, page);
    await page.getByRole('button', { name: 'Rotate' }).click();
    const currentIndex = await page.getByTestId('active-index').textContent();

    await expect(
      page.getByTestId(`image-${Number(currentIndex) - 1}`)
    ).toHaveAttribute('src', /\/90\/default\.jpg/);
  });

  test('(10) | The volumes should be browsable', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);
    await accessSidebarOnMobile(page);
    await page.getByRole('button', { name: 'Volumes' }).click();
    await expect(page.getByRole('link', { name: 'Copy 3' })).toBeVisible();
  });

  test('(11) | The multi-volume label should be appropriate', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
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
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);
    await accessSidebarOnMobile(page);
    expect(await page.getByTestId('active-index').textContent()).toEqual('1');
    await page.getByRole('button', { name: 'Contents' }).click();
    await page.getByRole('link', { name: 'Title Page' }).click();
    if (!isMobile(page)) {
      await expect(page.getByText('9/559')).toBeVisible();
    }
  });

  test('(13) | The main viewer can be scrolled all the way to the last slide', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
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

  test('(14) | The item should be searchable', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithSearchAndStructures(context, page);

    await accessSidebarOnMobile(page);

    await page.getByLabel('Search within this item').fill('darwin');
    await page.getByRole('button', { name: 'search within' }).click();
  });

  test('(15) | The location of the search results should be displayed', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
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

  test('(16) | Images should have unique alt text', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithAltText({ canvasNumber: 2 }, context, page);
    await expect(page.getByAltText('digitised image 2')).toBeVisible();
    expect(await page.getByAltText('digitised image 2').count()).toEqual(1);
  });

  test('(17) | An item with only open access items will not display a modal and display the content', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithOnlyOpenAccess(context, page);
    await expect(page.getByText('Show the content')).toBeHidden();
    await expect(page.getByTestId('image-0')).toBeInViewport();
  });

  test('(18) | An item with a mix of restricted and open access items will not display a modal and display the content', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithRestrictedAndOpenAccess(context, page);
    await expect(page.getByText('Show the content')).toBeHidden();
    await expect(page.getByTestId('image-0')).toBeInViewport();
  });

  test('(19) | An item with only restricted access images will display a modal with no option to view the content', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithOnlyRestrictedAccessImages(context, page);
    await expect(
      page.getByRole('heading', { name: 'Restricted material' })
    ).toBeVisible();
    await expect(page.getByText('Show the content')).toBeHidden();
    await expect(page.getByTestId('image-0')).toBeHidden();
  });

  test('(20) | An item with only restricted access non image items will display a modal with no option to view the content', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithOnlyRestrictedAccessNonImages(context, page);
    await expect(
      page.getByRole('heading', { name: 'Restricted material' })
    ).toBeVisible();
    await expect(page.getByText('Show the content')).toBeHidden();
    await expect(page.getByTestId('image-0')).toBeHidden();
  });

  test('(21) | An item with a mix of restricted and non-restricted access items will display a modal that offers access to the content', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithRestrictedAndNonRestrictedAccess(context, page);

    await expect(
      page.getByRole('heading', { name: 'Content advisory' })
    ).toBeVisible();
    await expect(page.getByText('Show the content')).toBeVisible();
    await expect(page.getByTestId('image-0')).toBeHidden();
  });

  test('(22) | An item with a mix of non-restricted and open access items will display a modal that offers access to the content', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithNonRestrictedAndOpenAccess(context, page);

    await expect(
      page.getByRole('heading', { name: 'Content advisory' })
    ).toBeVisible();
    await expect(page.getByText('Show the content')).toBeVisible();
    await expect(page.getByTestId('image-0')).toBeHidden();
  });

  test('(23) | Clicking thumbnail grid items updates the main viewer', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);

    const initialUrl = page.url();
    expect(initialUrl).toContain('/works/mg56yqa4/items');

    const gridButton = page.getByRole('button', { name: 'Grid' });
    await expect(gridButton).toBeVisible();
    await gridButton.click();

    await page.waitForTimeout(1000);

    const allCanvasLinks = page.locator('a[href*="canvas="]');

    const visibleCanvasLinks = allCanvasLinks.filter({
      has: page.locator('img'),
    });

    await expect(visibleCanvasLinks.first()).toBeVisible();

    const thumbnailCount = await visibleCanvasLinks.count();

    expect(thumbnailCount).toBeGreaterThanOrEqual(2);

    await visibleCanvasLinks.nth(1).click();

    await page.waitForURL(/.*canvas=3.*/);

    const updatedUrl = page.url();
    expect(updatedUrl).toContain('canvas=3');

    if (!isMobile(page)) {
      await expect(page.getByTestId('active-index')).toHaveText('3');
    }

    await expect(page.getByTestId('image-2')).toBeInViewport();
  });

  test('(24) | Video player is visible and renders', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithVideo(context, page);
    await expect(page.locator('video')).toBeVisible();
  });

  test('(25) | Video playback controls are present', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithVideo(context, page);
    const video = page.locator('video');
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute('controls');
  });

  test('(26) | Video download options are available', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithVideo(context, page);
    await checkDownloadsAvailable(page, expect);
  });

  test('(27) | Video info panel displays heading', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithVideo(context, page);
    await checkInfoPanelHasHeading(page, expect);
  });

  test('(28) | Audio player is visible and renders', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithAudio(context, page);
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  });

  test('(29) | Audio playback controls are functional', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithAudio(context, page);
    const playButton = page.getByRole('button', { name: 'Play' });
    await expect(playButton).toBeVisible();

    await playButton.click();

    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

    await expect(page.locator('button[aria-pressed="true"]')).toBeVisible();
  });

  test('(30) | Audio download options are available', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithAudio(context, page);
    await checkDownloadsAvailable(page, expect);
  });

  test('(31) | Audio info panel displays heading', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithAudio(context, page);
    await checkInfoPanelHasHeading(page, expect);
  });

  test('(32) | Renders the PDF document on Desktop or an "Open" link on Mobile', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithPdf(context, page);
    const pdfIframe = page.locator('iframe[title]');

    if (!isMobile(page)) {
      await expect(pdfIframe).toBeVisible();
    }

    if (isMobile(page)) {
      await expect(pdfIframe).not.toBeAttached();
      const openLink = page.getByRole('link', { name: /open/i });
      await expect(openLink).toBeVisible({ timeout: 10000 });
    }
  });

  test('(33) | PDF download options are available', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithPdf(context, page);
    await checkDownloadsAvailable(page, expect);
  });

  test('(34) | PDF info panel displays heading', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithPdf(context, page);
    await checkInfoPanelHasHeading(page, expect);
  });

  test('(35) | PDF file links update selected item, page indicator and pdf', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithPdf(context, page);

    if (!isMobile(page)) {
      const pdfLink = page.getByRole('link', { name: 'Sally-Anne_Hulton.pdf' });
      await pdfLink.click();

      await checkAriaSelected(page, expect, 'Sally-Anne_Hulton.pdf', true);
      await checkPageIndicator(page, expect, '5/27', 'topbar');

      const pdfIframe = page.locator('iframe[title]');
      await expect(pdfIframe).toHaveAttribute(
        'src',
        'https://iiif.wellcomecollection.org/file/SAREN_N_3_5---Advanced_Nephrology_Course_Part_1_-_28_September-1_October_2009---Monday---Sally-Anne_Hulton.pdf'
      );
    }
    if (isMobile(page)) {
      await accessSidebarOnMobile(page);

      const pdfLink = page.getByRole('link', { name: 'Sally-Anne_Hulton.pdf' });
      await pdfLink.click();

      await checkAriaSelected(page, expect, 'Sally-Anne_Hulton.pdf', false);
      await checkPageIndicator(page, expect, '5/27', 'bottombar');

      const openLink = page.getByRole('link', { name: /open/i });
      await expect(openLink).toBeVisible({ timeout: 10000 });
      expect(await openLink.getAttribute('href')).toEqual(
        'https://iiif.wellcomecollection.org/file/SAREN_N_3_5---Advanced_Nephrology_Course_Part_1_-_28_September-1_October_2009---Monday---Sally-Anne_Hulton.pdf'
      );
    }
  });

  test('(36) | Born digital files display and links update selected item and display media', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithMixedBornDigital(context, page);

    if (!isMobile(page)) {
      const mainViewer = page.getByTestId('main-viewer');
      const downloadLink = mainViewer.getByRole('link', { name: /download/i });
      await expect(downloadLink.first()).toBeVisible();

      const audioLink = page.getByRole('link', { name: 'slide1.wav' });
      await audioLink.click();

      await checkAriaSelected(page, expect, 'slide1.wav', true);

      await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
    }

    if (isMobile(page)) {
      const mainViewer = page.getByTestId('main-viewer');
      const downloadLink = mainViewer.getByRole('link', { name: /download/i });
      await expect(downloadLink.first()).toBeVisible();

      await accessSidebarOnMobile(page);
      const audioLink = page.getByRole('link', { name: 'slide1.wav' });
      await audioLink.click();

      await checkAriaSelected(page, expect, 'slide1.wav', false);

      await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
    }
  });

  test('(37) | Born digital have downloads', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithMixedBornDigital(context, page);
    const downloadLink = page.getByRole('link', { name: /download/i });
    await expect(downloadLink.first()).toBeVisible();
  });

  test('(38) | Born digital info panel displays heading', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithMixedBornDigital(context, page);
    await checkInfoPanelHasHeading(page, expect);
  });

  test('(39) | Mobile pagination updates content in main viewer', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithPdf(context, page);

    if (isMobile(page)) {
      await checkPageIndicator(page, expect, '1/27', 'bottombar');
      const bottombar = page.locator('[data-testid="bottombar"]');
      const nextLink = bottombar.getByRole('link', { name: /next/i });
      await nextLink.click();
      await checkPageIndicator(page, expect, '2/27', 'bottombar');
      const previousLink = bottombar.getByRole('link', { name: /previous/i });
      await previousLink.click();
      await checkPageIndicator(page, expect, '1/27', 'bottombar');
    }
  });

  test('(40) | OCR text should be accessible to screenreaders', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await itemWithAltText({ canvasNumber: 2 }, context, page);
    const img = page.getByAltText('digitised image 2');
    await expect(img).toBeVisible();

    const describedById = await img.getAttribute('aria-describedby');
    expect(describedById).toBeTruthy();
    await expect(page.locator(`#${describedById}`)).toContainText(
      '22102033982'
    );
  });

  test('(41) | Mobile sidebar toggle button text changes between Show and Hide info', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);

    if (isMobile(page)) {
      const showInfoButton = page.getByRole('button', { name: 'Show info' });
      await expect(showInfoButton).toBeVisible();

      await showInfoButton.click();

      const hideInfoButton = page.getByRole('button', { name: 'Hide info' });
      await expect(hideInfoButton).toBeVisible();

      await hideInfoButton.click();

      await expect(showInfoButton).toBeVisible();
    }
  });

  test('(42) | Mobile sidebar closes automatically when navigating between canvases', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);

    if (isMobile(page)) {
      await page.getByRole('button', { name: 'Show info' }).click();

      const heading = page.getByRole('heading').filter({
        hasText: 'Practica seu Lilium medicinae / [Bernard de Gordon].',
      });
      await expect(heading).toBeVisible();

      await page.getByRole('button', { name: 'Contents' }).click();
      await page.getByRole('link', { name: 'Title Page' }).click();

      await expect(heading).toBeHidden();

      await expect(
        page.getByRole('button', { name: 'Show info' })
      ).toBeVisible();
    }
  });

  test('(43) | Page and Grid view controls hide when mobile sidebar is open', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page);

    if (isMobile(page)) {
      const pageButton = page.getByRole('button', { name: 'Page' });
      await expect(pageButton).toBeVisible();

      await page.getByRole('button', { name: 'Show info' }).click();

      await expect(pageButton).toBeHidden();

      const gridButton = page.getByRole('button', { name: 'Grid' });
      await expect(gridButton).toBeHidden();

      await page.getByRole('button', { name: 'Hide info' }).click();

      await expect(pageButton).toBeVisible();
      await expect(gridButton).toBeVisible();
    }
  });

  test('(44) | Rapid canvas navigation does not cause state corruption', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    const canvasNumbers = [1, 5, 3, 7, 2, 6, 4];

    for (let i = 0; i < canvasNumbers.length - 1; i++) {
      multiVolumeItem(context, page, { canvasNumber: canvasNumbers[i] }).catch(
        () => {
          // Expected - rapid navigation aborts previous navigations
        }
      );
    }

    await multiVolumeItem(context, page, {
      canvasNumber: canvasNumbers[canvasNumbers.length - 1],
    });

    await expect(page).toHaveURL(/canvas=4/);
    await expect(page.getByTestId('main-viewer')).toBeVisible();
  });

  test('(45) | Direct URL to specific canvas loads correctly', async ({
    page,
    context,
  }: {
    page: Page;
    context: BrowserContext;
  }) => {
    await multiVolumeItem(context, page, { canvasNumber: 5 });

    await expect(page).toHaveURL(/canvas=5/);
    await expect(page.getByTestId('main-viewer')).toBeVisible();

    if (!isMobile(page)) {
      await expect(page.getByTestId('active-index')).toHaveText('5');
    }
  });
}
