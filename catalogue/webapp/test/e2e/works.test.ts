import {
  fillActionSearchInput,
  pressActionEnterSearchInput,
  clickActionFormatDropDown,
  clickActionFormatRadioCheckbox,
  clickActionCloseModalFilterButton,
  clickActionModalFilterButton,
} from './actions/search';
import {
  elementIsVisible,
  getInputValueAction,
  isMobile,
} from './actions/common';
import {
  expectItemIsVisible,
  expectItemsIsVisible,
  expectUrlToMatch,
} from '../e2e/asserts/common';
import { worksUrl } from './helpers/urls';
import {
  worksSearchResultsListItem,
  workTitleHeading,
} from './selectors/works';
import { regexImageSearchResultsUrl } from './helpers/regex';
import {
  mobileModal,
  searchResultsContainer,
  worksSearchInputField,
} from './selectors/search';

describe('works', () => {
  beforeEach(async () => {
    await page.goto(worksUrl);
  });

  test('Submits the form correctly', async () => {
    const expectedValue = 'heArTs';
    await fillActionSearchInput(expectedValue);
    await pressActionEnterSearchInput();

    const value = await getInputValueAction(worksSearchInputField);
    await page.waitForSelector(searchResultsContainer);

    await expectItemIsVisible(searchResultsContainer);
    expect(value).toBe(expectedValue);
  });

  test('Search by term, filter results, check results, view result', async () => {
    const expectedValue = 'art of science';
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
    expectUrlToMatch(/art[+]of[+]science/);

    await expectItemIsVisible(searchResultsContainer);
    await page.waitForNavigation();
    expectUrlToMatch(/workType=k/);

    await expectItemIsVisible(searchResultsContainer);
    await expectItemsIsVisible(worksSearchResultsListItem, 1);

    await expectItemIsVisible(searchResultsContainer);
    await page.click(`${searchResultsContainer} a:first-child`);
    await page.waitForNavigation();

    expectUrlToMatch(regexImageSearchResultsUrl);
    await expectItemIsVisible(workTitleHeading);
  });
});
