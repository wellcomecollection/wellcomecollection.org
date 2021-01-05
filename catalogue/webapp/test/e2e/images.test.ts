import { imagesUrl } from './helpers/urls';
import {
  fillActionSearchInput,
  pressActionEnterSearchInput,
  clickActionModalFilterButton,
  clickActionCloseModalFilterButton,
  clickActionClickSearchResultItem,
} from './actions/search';

import {
  clickActionColourPicker,
  clickActionColourDropDown,
  clickActionClickViewExpandedImage,
} from './actions/images';

import { isMobile, elementIsVisible } from './actions/common';
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
import { searchResultsContainer } from './selectors/search';

describe('images', () => {
  beforeEach(async () => {
    await page.goto(imagesUrl);
  });
  test('Search by term, filter by colour, check results, view image details, view expanded image', async () => {
    const expectedValue = 'art of science';
    await fillActionSearchInput(expectedValue, 'images');
    await pressActionEnterSearchInput('images');
    await page.waitForNavigation();

    if (isMobile()) {
      await clickActionModalFilterButton('images');
      await elementIsVisible(mobileModalImageSearch);
      await clickActionColourPicker();
      await clickActionCloseModalFilterButton('images');
    } else {
      await clickActionColourDropDown();
      await clickActionColourPicker();
    }
    await page.waitForNavigation();
    await expectItemIsVisible(searchResultsContainer);
    await expectItemsIsVisible(imagesResultsListItem, 1);

    await clickActionClickSearchResultItem(1, 'images');
    await expectItemIsVisible(modalexpandedImageViewMoreButton);

    await clickActionClickViewExpandedImage();
    await page.waitForNavigation();
    expectUrlToMatch(regexImageGalleryUrl);
  });
});
