import { fillInput, pressEnter, isMobile } from './common';

export const worksSearchInputId = 'input[aria-label="search input field"]';
export const workSearchResultsContainer = 'div[role="search results list"]';
export const formatFilterDropDown = 'div[role="format filter drop down"]';
export const formatFilterDropDownContainer = 'div[id="format"]';
export const formatFilterMobileButton = 'button[aria-label="open filters"]';
export const mobileModal = 'div[aria-modal="true"]';
export const mobileModalCloseButton = `${mobileModal} button[aria-label="close filter button"]`;

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
  const selector = `${
    isMobile ? mobileModal : formatFilterDropDown
  } label[aria-label="Radio checkbox ${filterName}"]`;
  await page.click(selector);
}

export async function clickModalFormatButton(): Promise<void> {
  await page.click(formatFilterMobileButton);
}

export async function closeModalFormat(): Promise<void> {
  await page.click(mobileModalCloseButton);
}
