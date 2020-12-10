import { fillInput, pressEnter } from './common';

export const worksSearchInputId = 'input[aria-label="search input field"]';
export const workSearchResultsContainer = 'div[role="search results list"]';
export const formatFilterDropDown = 'div[role="format filter drop down"]';
export const formatFilterDropDownContainer = 'div[id="format"]';

export async function fillSearchInput(value: string): Promise<void> {
  await fillInput(worksSearchInputId, value);
}

export async function pressEnterSearchInput(): Promise<void> {
  await pressEnter(worksSearchInputId);
}

export async function clickFormatDropDown(): Promise<void> {
  await page.click(formatFilterDropDown);
}

export async function clickFormatRadioCheckbox(
  filterName: string
): Promise<void> {
  const selector = `${formatFilterDropDown} label[aria-label="Radio checkbox ${filterName}"]`;
  await page.click(selector);
}
