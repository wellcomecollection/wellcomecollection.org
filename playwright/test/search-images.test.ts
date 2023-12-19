import { Page, test } from '@playwright/test';
import { isMobile, newSearch } from './helpers/contexts';

import { elementIsVisible } from './actions/common';
import {
  expectItemsIsVisible,
  expectItemIsVisible,
  expectUrlToMatch,
} from './asserts/common';

import { regexImageGalleryUrl } from './helpers/regex';
import safeWaitForNavigation from './helpers/safeWaitForNavigation';
import {
  formatFilterMobileButton,
  mobileModal,
  mobileModalCloseButton,
} from './selectors/search';
import { searchQuerySubmitAndWait } from './helpers/search';

const colourSelectorFilterDropDown = `button[aria-controls="images.color"]`;
const imageSearchResultsContainer =
  '[data-test-id="image-search-results-container"]';
const imagesResultsListItem = `[data-test-id="image-search-results-container"] li`;
const modalexpandedImaged = 'div[id="expanded-image-dialog"]';
const modalexpandedImageViewMoreButton = 'a[aria-label="View expanded image"]';

const clickActionClickSearchResultItem = async (
  nthChild: number,
  page: Page
): Promise<void> => {
  const selector = `[data-test-id="image-search-results-container"] li:nth-child(${nthChild}) a`;

  await page.locator(selector).click();
};

test.describe('Image search', () => {
  test('Search by term, filter by colour, check results, view image details, view expanded image', async ({
    page,
    context,
  }) => {
    const query = 'art of science';
    await newSearch(context, page, 'images');
    await searchQuerySubmitAndWait(query, page);

    if (isMobile(page)) {
      await page.click(formatFilterMobileButton);
      await elementIsVisible(mobileModal, page);
      await page.getByTestId('swatch-red').click();
      await page.click(mobileModalCloseButton);
    } else {
      await page.click(colourSelectorFilterDropDown);
      await page.getByTestId('swatch-red').click();
      await page.click(colourSelectorFilterDropDown);
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
      page.click(`${modalexpandedImaged} ${modalexpandedImageViewMoreButton}`),
    ]);
    expectUrlToMatch(regexImageGalleryUrl, page);
  });

  test.describe('the expanded image modal', () => {
    test('images without contributors still show a title', async ({
      page,
      context,
    }) => {
      await newSearch(context, page, 'images');
      await searchQuerySubmitAndWait('kd9h6gr3', page);

      await clickActionClickSearchResultItem(1, page);
      await expectItemIsVisible(
        'h2 >> text="Fish. Watercolour drawing."',
        page
      );
    });

    test('images with contributors show both title and contributor', async ({
      page,
      context,
    }) => {
      await newSearch(context, page, 'images');
      await searchQuerySubmitAndWait('fcmwqd5u', page);
      await clickActionClickSearchResultItem(1, page);
      await expectItemIsVisible('h2 >> text="Dr. Darwin."', page);

      await expectItemIsVisible(
        'span >> text="Fortey, W. S. (William Samuel)"',
        page
      );
    });
  });
});
