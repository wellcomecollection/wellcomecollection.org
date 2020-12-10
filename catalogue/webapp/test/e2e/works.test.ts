import {
  fillSearchInput,
  pressEnterSearchInput,
  worksSearchInputId,
  workSearchResultsContainer,
  clickFormatDropDown,
  clickFormatRadioCheckbox,
} from './selectors/search';
import {
  expectUrlIsOnWorkPage,
  expectWorkDetailsIsVisible,
} from './asserts/work';
import { getInputValue, isMobile } from './selectors/common';
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
    await fillSearchInput(expectedValue);
    await pressEnterSearchInput();
    if (!isMobile()) {
      await clickFormatDropDown();
      await clickFormatRadioCheckbox('Pictures');
    } else {
      // todo: write specific selectors for mobile for filter drop down
    }
    const encodeExpectedValue = encodeURIComponent(expectedValue).replace(
      /%20/g,
      '+'
    );
    expect(page.url()).toContain(encodeExpectedValue);
    await expectSearchResultsIsVisible();

    await page.waitForTimeout(1000);
    expect(page.url()).toContain('workType=k');
    await expectSearchResultsIsVisible();
    await page.click(`${workSearchResultsContainer} a:first-child`);
    await page.waitForTimeout(1000);

    await expectUrlIsOnWorkPage();
    await expectWorkDetailsIsVisible();
  });
});
