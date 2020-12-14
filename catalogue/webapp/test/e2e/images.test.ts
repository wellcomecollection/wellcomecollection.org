import { imagesUrl } from './urls';
import {
  fillSearchInput,
  pressEnterSearchInput,
  clickModalFilterButton,
  closeModalFilterButton,
  clickColourPicker,
  mobileModal,
  clickColourDropDown,
} from './selectors/search';
import { isMobile, elementIsVisible } from './selectors/common';

describe('images', () => {
  beforeEach(async () => {
    await page.goto(imagesUrl);
  });
  test('Search by term, filter by colour, check results, view result', async () => {
    const expectedValue = 'art of science';
    await fillSearchInput(expectedValue, 'images');
    await pressEnterSearchInput();
    await page.waitForNavigation();

    if (isMobile()) {
      await clickModalFilterButton('images');
      await elementIsVisible(mobileModal);
      await clickColourPicker();
      await closeModalFilterButton('images');
      // todo select colour filter in modal
    } else {
      await clickColourDropDown();
      await clickColourPicker();

      // todo select colour filter on desktop
    }
  });
});
