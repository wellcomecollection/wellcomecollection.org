import { imagesUrl } from './urls';
import {
  fillSearchInput,
  pressEnterSearchInput,
  clickModalFilterButton,
  closeModalFilterButton,
  clickColourPicker,
  mobileModal,
  clickColourDropDown,
  imagesResultsContainer,
  imagesResultsLisItem,
} from './selectors/search';
import { isMobile, elementIsVisible, itemsIsVisible } from './selectors/common';

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
    } else {
      await clickColourDropDown();
      await clickColourPicker();
    }

    expect(await elementIsVisible(imagesResultsContainer)).toBeTruthy();
    expect(await itemsIsVisible(imagesResultsLisItem, 1)).toBeTruthy();
  });
});
