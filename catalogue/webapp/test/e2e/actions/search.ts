import {
  searchImagesForm,
  searchWorksForm,
  worksSearchInputField,
  formatFilterDropDown,
  colourSelectorFilterDropDown,
  mobileModal,
  formatFilterMobileButton,
  colourSelector,
  mobileModalCloseButton,
} from '../selectors/search';

import { isMobile, fillInput, pressEnter } from './common';

type formType = 'images' | 'works';

// Fill actions

export async function fillActionSearchInput(
  value: string,
  condition?: formType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${worksSearchInputField}`;

  await fillInput(selector, value);
}

// Press actions

export async function pressActionEnterSearchInput(): Promise<void> {
  await pressEnter(worksSearchInputField);
}

// Click actions

export async function clickActionFormatDropDown(): Promise<void> {
  await page.click(formatFilterDropDown);
}

export async function clickActionColourDropDown(): Promise<void> {
  await page.click(colourSelectorFilterDropDown);
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
  condition?: formType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${formatFilterMobileButton}`;

  await page.click(selector);
}

export async function clickActionColourPicker(): Promise<void> {
  await page.click(colourSelector, {
    position: { x: 100, y: 100 },
  });
}

export async function clickActionCloseModalFilterButton(
  condition?: formType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${mobileModalCloseButton}`;
  await page.click(selector);
}
