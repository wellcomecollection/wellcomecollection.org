import { Page, test } from '@playwright/test';
import { gotoWithoutCache, isMobile } from './contexts';
import { clickActionClickSearchResultItem } from './actions/search';

import { clickActionClickViewExpandedImage } from './actions/images';

import { elementIsVisible, fillInputAction } from './actions/common';
import {
  expectItemsIsVisible,
  expectItemIsVisible,
  expectUrlToMatch,
} from './asserts/common';
import { modalexpandedImageViewMoreButton } from './selectors/images';

import { regexImageGalleryUrl } from './helpers/regex';
import safeWaitForNavigation from './helpers/safeWaitForNavigation';
import { baseUrl } from './helpers/urls';
import {
  formatFilterMobileButton,
  mobileModal,
  mobileModalCloseButton,
} from './selectors/search';

const imagesUrl = `${baseUrl}/search/images`;
const searchBarInput = `#search-searchbar`;
const colourSelectorFilterDropDown = `button[aria-controls="images.color"]`;
const colourSelector = `button[data-test-id="swatch-green"]`;
const imageSearchResultsContainer =
  'ul[data-test-id="image-search-results-container"]';
const imagesResultsListItem = `${imageSearchResultsContainer} li[data-test-id="image-search-result"]`;
const mobileModalImageSearch = `${mobileModal}`;

const fillActionSearchInput = async (
  value: string,
  page: Page
): Promise<void> => {
  const selector = `${searchBarInput}`;
  await fillInputAction(selector, value, page);
};
const pressActionEnterSearchInput = async (page: Page): Promise<void> => {
  const selector = `${searchBarInput}`;
  await page.press(selector, 'Enter');
};
const clickActionColourDropDown = async (page: Page): Promise<void> => {
  await page.click(colourSelectorFilterDropDown);
};

const selectColourInPicker = async (page: Page): Promise<void> => {
  await Promise.all([safeWaitForNavigation(page), page.click(colourSelector)]);
};

const clickActionModalFilterButton = async (page: Page): Promise<void> => {
  const selector = `${formatFilterMobileButton}`;
  await page.click(selector);
};
export const clickActionCloseModalFilterButton = async (
  page: Page
): Promise<void> => {
  const selector = `${mobileModalCloseButton}`;
  await page.click(selector);
};

async function gotoSearchResultPage(
  { url, query }: { url: string; query: string },
  page: Page
): Promise<void> {
  await gotoWithoutCache(url, page);
  await fillActionSearchInput(query, page);
  await Promise.all([
    safeWaitForNavigation(page),
    pressActionEnterSearchInput(page),
  ]);
}

test.describe('Image search', () => {
  test('Search by term, filter by colour, check results, view image details, view expanded image', async ({
    page,
  }) => {
    const query = 'art of science';
    await gotoSearchResultPage({ url: imagesUrl, query }, page);

    if (isMobile(page)) {
      await clickActionModalFilterButton(page);
      await elementIsVisible(mobileModalImageSearch, page);
      await selectColourInPicker(page);
      await clickActionCloseModalFilterButton(page);
    } else {
      await clickActionColourDropDown(page);
      await selectColourInPicker(page);
      await clickActionColourDropDown(page);
    }
    await expectItemIsVisible(imageSearchResultsContainer, page);
    await expectItemsIsVisible(imagesResultsListItem, 1, page);
    await clickActionClickSearchResultItem(1, page);
    await expectItemIsVisible(modalexpandedImageViewMoreButton, page);

    // Check we show visually similar images.  This could theoretically fail
    // if the first result doesn't have any similar images, but if it fails
    // it's much more likely we've broken something on the page.
    await expectItemIsVisible('h3 >> text="Visually similar images"', page);

    await Promise.all([
      safeWaitForNavigation(page),
      clickActionClickViewExpandedImage(page),
    ]);
    expectUrlToMatch(regexImageGalleryUrl, page);
  });

  test.describe('the expanded image modal', () => {
    test('images without contributors still show a title', async ({ page }) => {
      await gotoSearchResultPage({ url: imagesUrl, query: 'm2u74c63' }, page);

      await clickActionClickSearchResultItem(1, page);
      await expectItemIsVisible(
        'h2 >> text="Fish. Watercolour drawing."',
        page
      );
    });

    test('images with contributors show both title and contributor', async ({
      page,
    }) => {
      await gotoSearchResultPage({ url: imagesUrl, query: 'fcmwqd5u' }, page);

      await clickActionClickSearchResultItem(1, page);
      await expectItemIsVisible('h2 >> text="Dr. Darwin."', page);

      await expectItemIsVisible(
        'span >> text="Fortey, W. S. (William Samuel)"',
        page
      );
    });
  });
});
