import { multiVolumeItem } from './contexts';
import { isMobile } from './actions/common';
import { volumesNavigationLabel } from './text/aria-labels';
import {
  zoomInButton,
  openseadragonCanvas,
  fullscreenButton,
  licenseAndCreditAccordionItem,
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

describe('Scenario 3: A user wants information about the item they are viewing', () => {
  beforeAll(async () => {
    await multiVolumeItem();
  });

  test('the item has a title', async () => {
    const title = await page.waitForSelector('h1');
    expect(title).toBeTruthy();
  });

  test.only('the item has license and credit information', async () => {
    await page.waitForSelector(licenseAndCreditAccordionItem);
    await page.click(licenseAndCreditAccordionItem);
    await page.waitForSelector(`strong:has-text('License:')`);
    await page.waitForSelector(`strong:has-text('Credit:')`);
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
