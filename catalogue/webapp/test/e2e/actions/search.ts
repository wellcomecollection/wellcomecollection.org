import { imagesResultsListItem, searchImagesForm } from '../selectors/images';
import {
  formatFilterDropDown,
  formatFilterDropDownButton,
  formatFilterMobileButton,
  mobileModal,
  mobileModalCloseButton,
  worksSearchInputField,
} from '../selectors/search';
import {
  searchWorksForm,
  worksSearchResultsListItem,
} from '../selectors/works';
import { isMobile, fillInputAction, pressEnterAction } from './common';

type conditionSearchType = 'images' | 'works';

// Fill actions

export async function fillActionSearchInput(
  value: string,
  condition?: conditionSearchType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${worksSearchInputField}`;

  await fillInputAction(selector, value);
}

// Press actions

export async function pressActionEnterSearchInput(
  condition?: conditionSearchType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${worksSearchInputField}`;

  await pressEnterAction(selector);
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

export async function clickActionModalFilterButton(
  condition?: conditionSearchType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${formatFilterMobileButton}`;

  await page.click(selector);
}

export async function clickActionCloseModalFilterButton(
  condition?: conditionSearchType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${mobileModalCloseButton}`;
  await page.click(selector);
}

export async function clickActionClickSearchResultItem(
  nthChild: number,
  condition?: conditionSearchType
): Promise<void> {
  const selector = `${
    condition === 'images' ? worksSearchResultsListItem : imagesResultsListItem
  }:nth-child(${nthChild}) a`;

  await page.click(selector);
}
