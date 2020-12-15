import { workSearchResultsContainer } from '../selectors/search';
import { elementIsVisible } from '../actions/common';

export async function expectSearchResultsIsVisible(): Promise<void> {
  expect(await elementIsVisible(workSearchResultsContainer)).toBeTruthy();
}
