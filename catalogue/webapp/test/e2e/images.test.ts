import { imagesUrl } from './helpers/urls';
import {
  fillActionSearchInput,
  pressActionEnterSearchInput,
  clickActionModalFilterButton,
  clickActionCloseModalFilterButton,
  clickActionColourPicker,
  clickActionColourDropDown,
} from './actions/search';

import {
  imagesResultsContainer,
  imagesResultsLisItem,
  mobileModal,
} from './selectors/search';

import { isMobile, elementIsVisible } from './actions/common';
import { expectItemsIsVisible, expectItemIsVisible } from './asserts/common';

describe('images', () => {
  beforeEach(async () => {
    await page.goto(imagesUrl);
  });
  test('Search by term, filter by colour, check results', async () => {
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
    await expectItemsIsVisible(imagesResultsLisItem, 1);
  });
});
