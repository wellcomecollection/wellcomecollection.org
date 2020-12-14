import { imagesUrl } from './urls';
import { fillSearchInput, pressEnterSearchInput } from './selectors/search';
import { isMobile } from './selectors/common';
import { toggleFeature } from './utils';

describe('images', () => {
  describe('New search', () => {
    beforeEach(async () => {
      await toggleFeature('searchPrototype', 'true');
      await page.goto(imagesUrl);
    });
    test('Search by term, filter by colour, ', async () => {
      const expectedValue = 'art of science';
      await fillSearchInput(expectedValue, 'images');
      await pressEnterSearchInput();
      await page.waitForNavigation();
      await page.waitForTimeout(5000);
      if (isMobile()) {
        // todo select colour filter in modal
      } else {
        // todo select colour filter on desktop
      }
    });
  });
});
