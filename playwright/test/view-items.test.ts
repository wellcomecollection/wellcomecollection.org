import { multiVolumeItem } from './contexts';
import { isMobile } from './actions/common';
import { volumesNavigationLabel } from './text/aria-labels';
import { zoomInButton, openseadragonCanvas } from './selectors/item';
// let page: import('playwright').Page;

jest.setTimeout(30000);
describe('Scenario 1: A user wants a large-scale view of an item', () => {
  test('the images are scalable', async () => {
    console.log('here');
    await multiVolumeItem();
    console.log('oo');
    await page.waitForSelector(zoomInButton);
    console.log(zoomInButton);
    await page.click(zoomInButton);
    console.log('clicked');
    await page.waitForSelector(openseadragonCanvas);
    // expect(openseadragonCanvas).toBeTruthy();

    // presence of fullscreen
    // click fullscreen opens fullscreen
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
