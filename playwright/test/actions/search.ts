import { imagesResultsListItem, searchImagesForm } from '../selectors/images';
import {
  formatFilterDropDown,
  formatFilterDropDownButton,
  formatFilterMobileButton,
  mobileModal,
  mobileModalCloseButton,
  worksSearchImagesInputField,
} from '../selectors/search';
import { isMobile, fillInputAction } from './common';

// Fill actions
export async function fillActionSearchInput(value: string): Promise<void> {
  const selector = `${searchImagesForm} ${worksSearchImagesInputField}`;
  await fillInputAction(selector, value);
}

// Press actions
export async function pressActionEnterSearchInput(): Promise<void> {
  const selector = `${searchImagesForm} ${worksSearchImagesInputField}`;
  await page.press(selector, 'Enter');
}

// Click actions
export async function clickActionFormatDropDown(): Promise<void> {
  await page.click(formatFilterDropDownButton);
}

export async function clickActionFormatRadioCheckbox(
  filterName: string
): Promise<void> {
  const selector = `${
    isMobile() ? mobileModal : formatFilterDropDown
  } label[aria-label="Radio checkbox ${filterName}"]`;
  await page.click(selector);
}

export async function clickActionModalFilterButton(): Promise<void> {
  const selector = `${searchImagesForm} ${formatFilterMobileButton}`;
  await page.click(selector);
}

export async function clickActionCloseModalFilterButton(): Promise<void> {
  const selector = `${searchImagesForm} ${mobileModalCloseButton}`;
  await page.click(selector);
}

export async function clickActionClickSearchResultItem(
  nthChild: number
): Promise<void> {
  const selector = `${imagesResultsListItem}:nth-child(${nthChild}) a`;

  await page.click(selector);
}
