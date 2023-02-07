import { Page, test, expect } from '@playwright/test';
import { gotoWithoutCache, isMobile } from './contexts';
import {
  clickActionCloseModalFilterButton,
  clickActionModalFilterButton,
} from './actions/search';

import { elementIsVisible, fillInputAction } from './actions/common';
import { expectItemsIsVisible, expectItemIsVisible } from './asserts/common';
import { mobileModalImageSearch } from './selectors/images';
import safeWaitForNavigation from './helpers/safeWaitForNavigation';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL
  ? process.env.PLAYWRIGHT_BASE_URL
  : 'http://localhost:3000';

const overviewUrl = `${baseUrl}/search`;
const imagesUrl = `${baseUrl}/search/images`;

const searchBarInput = `#search-searchbar`;
const colourSelectorFilterDropDown = `button[aria-controls="images.color"]`;
const colourSelector = `button[data-test-id="swatch-green"]`;

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

const searchResultsContainer = 'ul[data-test-id="search-results-container"]';
const imagesResultsListItem = `${searchResultsContainer} li[data-test-id="image-search-result"]`;

const subNavigationContainer = 'div[data-test-id="sub-nav-tab-container"]';
const catalogueSectionSelector = `${subNavigationContainer} div[data-test-id="works"]`;
const searchNoResults = 'p[data-test-id="search-no-results"]';

test.describe('New Search Page interactions', () => {
  test('the query (but not the filters) are maintained when switching through tabs', async ({
    page,
  }) => {
    const query = 'art of science';
    await gotoSearchResultPage({ url: imagesUrl, query }, page);
    await expectItemIsVisible(searchResultsContainer, page);
    await expectItemsIsVisible(imagesResultsListItem, 1, page);

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

    await page.click(catalogueSectionSelector);
    await safeWaitForNavigation(page);

    // check the url to ensure that no weird filters are added
    expect(page.url()).toBe(`${baseUrl}/search/works?query=art%20of%20science`);
  });
  test('clicking on "All Stories" on the Overview page takes us to the correct page on click', async ({
    page,
  }) => {
    const query = 'art of science';
    await gotoSearchResultPage({ url: overviewUrl, query }, page);
    await page.click('"All stories"');
    await safeWaitForNavigation(page);
    expect(page.url()).toBe(`${baseUrl}/search/stories?query=art+of+science`);
  });
  test('clicking on "All Images" on the Overview page takes us to the correct page on click', async ({
    page,
  }) => {
    const query = 'art of science';
    await gotoSearchResultPage({ url: overviewUrl, query }, page);
    await page.click('"All images"');
    await safeWaitForNavigation(page);
    expect(page.url()).toBe(`${baseUrl}/search/images?query=art+of+science`);
  });
  test('the no results message shows if needed', async ({ page }) => {
    const query = 'gisjdabasdf;o';
    await gotoSearchResultPage({ url: imagesUrl, query }, page);
    await safeWaitForNavigation(page);

    expect(await page.innerText(searchNoResults)).toBe(
      `We couldn’t find anything that matched ${query}. Please try again.`
    );
  });
});
