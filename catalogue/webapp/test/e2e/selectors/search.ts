import { fillInput, pressEnter } from './common';

export const worksSearchInputId = 'input[aria-label="search input field"]';
export const workSearchResultsContainer = 'div[role="search results list"]';

export async function fillSearchInput(value: string): Promise<void> {
  await fillInput(worksSearchInputId, value);
}

export async function pressEnterSearchInput(): Promise<void> {
  await pressEnter(worksSearchInputId);
}
