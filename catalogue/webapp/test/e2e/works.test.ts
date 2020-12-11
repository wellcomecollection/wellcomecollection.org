import {
  fillSearchInput,
  pressEnterSearchInput,
  worksSearchInputId,
  workSearchResultsContainer,
  clickFormatDropDown,
  clickFormatRadioCheckbox,
  closeModalFormat,
  mobileModal,
  clickModalFormatButton,
} from './selectors/search';
import {
  expectUrlIsOnWorkPage,
  expectWorkDetailsIsVisible,
} from './asserts/work';
import { elementIsVisible, getInputValue, isMobile } from './selectors/common';
import { expectSearchResultsIsVisible } from '../e2e/asserts/search';
import { worksUrl } from './urls';

describe('works', () => {
  beforeEach(async () => {
    await page.goto(worksUrl);
  });

  test('Submits the form correctly', async () => {
    const expectedValue = 'heArTs';
    await fillSearchInput(expectedValue);
    await pressEnterSearchInput();

    const value = await getInputValue(worksSearchInputId);
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
    await fillSearchInput(expectedValue);
    await pressEnterSearchInput();

    if (isMobile()) {
      await clickModalFormatButton();
      await elementIsVisible(mobileModal);
      await clickFormatRadioCheckbox('Pictures');
      await closeModalFormat();
    } else {
      await clickFormatDropDown();
      await clickFormatRadioCheckbox('Pictures');
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
