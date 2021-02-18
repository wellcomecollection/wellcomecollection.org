import { multiVolumeItem } from '../contexts';
import { volumesNavigationLabel } from './text/aria-labels';

describe('Scenario 1: Item has multiple volumes', () => {
  test('the volumes should be browsable', async () => {
    await multiVolumeItem();

    const navigationSelector = `[role="navigation"][aria-label="${volumesNavigationLabel}"]`;
    const navigationVisible = await page.isVisible(navigationSelector);

    expect(navigationVisible).toBeTruthy();

    const currentManifestLinkLabel = await page.textContent(
      `${navigationSelector} a[aria-current="page"]`
    );

    const currentManifestLabel = await page.textContent(
      '[data-testid=current-manifest]'
    );

    expect(currentManifestLinkLabel).toEqual(currentManifestLabel);

    await page.click('[aria-controls=MultipleManifestListHiddenContent]');

    const nextManifestLinkSelector = `${navigationSelector} a:not([aria-current="page"])`;
    const nextManifestLinkLabel = await page.textContent(
      nextManifestLinkSelector
    );

    await page.click(nextManifestLinkSelector);

    await page.waitForSelector(
      `css=[data-testid=current-manifest] >> text="${nextManifestLinkLabel}"`
    );
  });
});
