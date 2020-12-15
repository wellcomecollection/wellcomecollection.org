import {
  worksSearchInputField,
  workSearchResultsContainer,
  mobileModal,
} from './selectors/search';

import {
  fillActionSearchInput,
  pressActionEnterSearchInput,
  clickActionFormatDropDown,
  clickActionFormatRadioCheckbox,
  clickActionCloseModalFilterButton,
  clickActionModalFilterButton,
} from './actions/search';

import {
  expectUrlIsOnWorkPage,
  expectWorkDetailsIsVisible,
} from './asserts/work';
import {
  elementIsVisible,
  getInputValueAction,
  isMobile,
} from './actions/common';
import { expectSearchResultsIsVisible } from '../e2e/asserts/search';
import { worksUrl } from './helpers/urls';

describe('works', () => {
  beforeEach(async () => {
    await page.goto(worksUrl);
  });

  test('Submits the form correctly', async () => {
    const expectedValue = 'heArTs';
    await fillActionSearchInput(expectedValue);
    await pressActionEnterSearchInput();

    const value = await getInputValueAction(worksSearchInputField);
    await page.waitForSelector(workSearchResultsContainer);

    await expectSearchResultsIsVisible();
    expect(value).toBe(expectedValue);
  });

  test('Search by term, filter results, check results, view result', async () => {
    const expectedValue = 'art of science';
    const encodeExpectedValue = encodeURIComponent(expectedValue).replace(
      /%20/g,
      '+'
    );
    await fillActionSearchInput(expectedValue);
    await pressActionEnterSearchInput();

    if (isMobile()) {
      await clickActionModalFilterButton();
      await elementIsVisible(mobileModal);
      await clickActionFormatRadioCheckbox('Pictures');
      await clickActionCloseModalFilterButton();
    } else {
      await clickActionFormatDropDown();
      await clickActionFormatRadioCheckbox('Pictures');
    }

    expect(page.url()).toContain(encodeExpectedValue);
    await expectSearchResultsIsVisible();
    await page.waitForNavigation();
    expect(page.url()).toContain('workType=k');

    await expectSearchResultsIsVisible();
    await page.click(`${workSearchResultsContainer} a:first-child`);
    await page.waitForNavigation();

    await expectUrlIsOnWorkPage();
    await expectWorkDetailsIsVisible();
  });
});
