import {
  fillActionSearchInput,
  pressActionEnterSearchInput,
  clickActionFormatDropDown,
  clickActionFormatRadioCheckbox,
  clickActionCloseModalFilterButton,
  clickActionModalFilterButton,
  clickActionClickSearchResultItem,
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
} from './asserts/common';
import { worksUrl } from './helpers/urls';
import {
  worksSearchResultsListItem,
  workTitleHeading,
} from './selectors/works';
import { regexImageSearchResultsUrl } from './helpers/regex';
import {
  mobileModal,
  searchResultsContainer,
  worksSearchCatalogueInputField,
} from './selectors/search';

describe('works', () => {
  beforeEach(async () => {
    await page.goto(worksUrl);
  });

  test('Submits the form correctly', async () => {
    const expectedValue = 'heArTs';
    await fillActionSearchInput(expectedValue);
    await pressActionEnterSearchInput();

    const value = await getInputValueAction(worksSearchCatalogueInputField);
    await page.waitForSelector(searchResultsContainer);

    await expectItemIsVisible(searchResultsContainer);
    expect(value).toBe(expectedValue);
  });

  fit('Search by term, filter results, check results, view result', async () => {
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
    await clickActionClickSearchResultItem(1);
    await page.waitForNavigation();

    expectUrlToMatch(regexImageSearchResultsUrl);
    await expectItemIsVisible(workTitleHeading);
  });
});
