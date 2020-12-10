import {
  fillSearchInput,
  pressEnterSearchInput,
  worksSearchInputId,
  workSearchResultsContainer,
} from './selectors/search';
import { getInputValue, elementIsVisible } from './selectors/common';
import { worksUrl } from './urls';

describe('works', () => {
  beforeAll(async () => {
    await page.goto(worksUrl);
  });

  test('Submits the form correctly', async () => {
    const expectedValue = 'heArTs';
    await fillSearchInput(expectedValue);
    await pressEnterSearchInput();

    const value = await getInputValue(worksSearchInputId);
    await page.waitForSelector(workSearchResultsContainer);
    const searchResultsVisible = await elementIsVisible(
      workSearchResultsContainer
    );

    expect(searchResultsVisible).toBeTruthy();
    expect(value).toBe(expectedValue);
  });
});
