import { imagesUrl } from './helpers/urls';
import {
  fillActionSearchInput,
  pressActionEnterSearchInput,
  clickActionModalFilterButton,
  clickActionCloseModalFilterButton,
  clickActionColourPicker,
  clickActionColourDropDown,
  clickActionClickImageResultItem,
  clickActionClickViewExpandedImage,
} from './actions/search';

import {
  imagesResultsContainer,
  imagesResultsListItem,
  mobileModal,
} from './selectors/search';

import { isMobile, elementIsVisible } from './actions/common';
import {
  expectItemsIsVisible,
  expectItemIsVisible,
  expectUrlIsOnPage,
} from './asserts/common';
import { modalexpandedImageViewMoreButton } from './selectors/images';
import { regexImageGalleryUrl } from './helpers/regex';

describe('images', () => {
  beforeEach(async () => {
    await page.goto(imagesUrl);
  });
  test('Search by term, filter by colour, check results, view image details, view expanded image', async () => {
    const expectedValue = 'art of science';
    await fillActionSearchInput(expectedValue, 'images');
    await pressActionEnterSearchInput();
    await page.waitForNavigation();

    if (isMobile()) {
      await clickActionModalFilterButton('images');
      await elementIsVisible(mobileModal);
      await clickActionColourPicker();
      await clickActionCloseModalFilterButton('images');
    } else {
      await clickActionColourDropDown();
      await clickActionColourPicker();
    }

    await expectItemIsVisible(imagesResultsContainer);
    await expectItemsIsVisible(imagesResultsListItem, 1);

    await clickActionClickImageResultItem(1);
    await expectItemIsVisible(modalexpandedImageViewMoreButton);

    await clickActionClickViewExpandedImage();
    await page.waitForNavigation();
    await expectUrlIsOnPage(regexImageGalleryUrl);
  });
});
