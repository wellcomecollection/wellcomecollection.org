import { multiVolumeItem, itemWithSearchAndStructures } from './contexts';
import { isMobile } from './actions/common';
import { volumesNavigationLabel } from './text/aria-labels';
import {
  zoomInButton,
  openseadragonCanvas,
  fullscreenButton,
  searchWithinResultsHeader,
  mainViewer,
  accordionItemVolumes,
  accordionItemContents,
} from './selectors/item';
import { baseUrl } from './helpers/urls';

const domain = new URL(baseUrl).host;

const searchWithinForm = '#searchWithin';
async function searchWithin(query: string) {
  await page.fill(searchWithinForm, query);
  await page.press(searchWithinForm, 'Enter');
}

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
    // check full screen
    await page.waitForSelector(zoomInButton);
    await page.click(zoomInButton);
    await page.waitForSelector(openseadragonCanvas);
    // expect(openseadragonCanvas).toBeTruthy();
  });
});

describe.only('Scenario 6: Item has multiple volumes', () => {
  test('the volumes should be browsable', async () => {
    if (!isMobile()) {
      await multiVolumeItem();
      await page.click(`${accordionItemVolumes} button`);
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

describe('Scenario 7: Item has structured parts', () => {
  test('the main viewer can be scrolled', async () => {
    await itemWithSearchAndStructures();
    await page.click(`${accordionItemContents} button`);
    await page.click(`${accordionItemContents} li:nth-of-type(2) a`);
    await page.waitForSelector(`css=[data-test-id=active-index] >> text="5"`); // TODO get 5 from somewhere?
  });
});

async function scrollToBottom(page, selector) {
  await page.$eval(selector, element => {
    element.scrollTo(0, element.scrollHeight);
  });
}

describe('Scenario 8: Viewing all the images', () => {
  test('the main viewer can be scrolled', async () => {
    await itemWithSearchAndStructures();
    await scrollToBottom(page, mainViewer);
    await page.waitForSelector(`css=[data-test-id=active-index] >> text="68"`); // TODO get 68 from somewhere?
  });
});

describe('Scenario 9: Item has a search service', () => {
  test('the item should be searchable', async () => {
    await itemWithSearchAndStructures();
    await searchWithin('darwin');
    await page.waitForSelector(searchWithinResultsHeader);
    await page.click(`${searchWithinResultsHeader} + ul li:first-of-type a`);
    await page.waitForSelector(`css=[data-test-id=active-index] >> text="5"`); // TODO get 68 from somewhere?
  });
});
