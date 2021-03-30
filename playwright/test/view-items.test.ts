import { multiVolumeItem } from './contexts';
import { isMobile } from './actions/common';
import { volumesNavigationLabel } from './text/aria-labels';
import {
  zoomInButton,
  openseadragonCanvas,
  fullscreenButton,
  downloadsButton,
  itemDownloadsModal,
  smallImageDownload,
  fullItemDownload,
  workContributors,
  workDates,
} from './selectors/item';
import { baseUrl } from './helpers/urls';

const domain = new URL(baseUrl).host;

beforeAll(async () => {
  await context.addCookies([
    { name: 'WC_cookiesAccepted', value: 'true', domain: domain, path: '/' },
    {
      name: 'toggle_itemViewerPrototypeWithSearch',
      value: 'true',
      domain: domain,
      path: '/',
    },
  ]);
});

describe('Scenario 1: A user wants a large-scale view of an item', () => {
  test('the images are scalable', async () => {
    await multiVolumeItem();
    await page.waitForSelector(fullscreenButton);
    await page.click(fullscreenButton);
    // TODO: e.g. test for existence of document.fullscreenElement (can't figure out how to do this with Playwright)
    await page.waitForSelector(zoomInButton);
    await page.click(zoomInButton);
    await page.waitForSelector(openseadragonCanvas);
  });
});

describe('Scenario 2: A user wants to use the content offline', () => {
  beforeEach(async () => {
    await multiVolumeItem();
    await page.waitForSelector(downloadsButton);
    await page.click(downloadsButton);
    await page.waitForSelector(itemDownloadsModal);
  });

  test('downloading an image of the current canvas', async () => {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click(smallImageDownload),
    ]);

    await newPage.waitForLoadState();
    const url = newPage.url();
    expect(url).toBe(
      'https://dlcs.io/iiif-img/wellcome/5/b10326947_hin-wel-all-00012266_0001.jp2/full/full/0/default.jpg'
    );
  });

  test('downloading the entire item', async () => {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click(fullItemDownload),
    ]);

    await newPage.waitForLoadState();
    const url = newPage.url();
    expect(url).toBe('https://dlcs.io/pdf/wellcome/pdf-item/b10326947/0');
  });
});

describe('Scenario 3: A user wants information about the item they are viewing', () => {
  beforeAll(async () => {
    await multiVolumeItem();
  });

  test('the item has a title', async () => {
    const title = await page.textContent('h1');
    expect(title).toBe('Practica seu Lilium medicinae / [Bernard de Gordon].');
  });

  test('the item has contributor information', async () => {
    const contributors = await page.textContent(workContributors);
    expect(contributors).toBe(
      'Bernard, de Gordon, approximately 1260-approximately 1318.'
    );
  });

  test('the item has date information', async () => {
    const dates = await page.textContent(workDates);
    expect(dates).toBe('Date 1497');
  });
});

describe('Scenario 6: Item has multiple volumes', () => {
  test('the volumes should be browsable', async () => {
    if (!isMobile()) {
      await multiVolumeItem();

      const navigationSelector = `[role="navigation"][aria-label="${volumesNavigationLabel}"]`;
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

      await page.click('[aria-controls=MultipleManifestListHiddenContent]');

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
});
