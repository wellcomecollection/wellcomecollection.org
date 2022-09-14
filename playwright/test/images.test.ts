import { test } from '@playwright/test';
import { imagesUrl } from './helpers/urls';
import { gotoWithoutCache, isMobile } from './contexts';
import {
  fillActionSearchInput,
  pressActionEnterSearchInput,
  clickActionModalFilterButton,
  clickActionCloseModalFilterButton,
  clickActionClickSearchResultItem,
} from './actions/search';

import {
  selectColourInPicker,
  clickActionColourDropDown,
  clickActionClickViewExpandedImage,
} from './actions/images';

import { elementIsVisible } from './actions/common';
import {
  expectItemsIsVisible,
  expectItemIsVisible,
  expectUrlToMatch,
} from './asserts/common';
import {
  imagesResultsListItem,
  mobileModalImageSearch,
  modalexpandedImageViewMoreButton,
} from './selectors/images';

import { regexImageGalleryUrl } from './helpers/regex';
import safeWaitForNavigation from './helpers/safeWaitForNavigation';
import { searchResultsContainer } from './selectors/search';

test.describe('Image search', () => {
  test('Search by term, filter by colour, check results, view image details, view expanded image', async ({
    page,
  }) => {
    await gotoWithoutCache(imagesUrl, page);
    const expectedValue = 'art of science';
    await fillActionSearchInput(expectedValue, page);
    await Promise.all([
      safeWaitForNavigation(page),
      pressActionEnterSearchInput(page),
    ]);

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
    await expectItemIsVisible(searchResultsContainer, page);
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
});
