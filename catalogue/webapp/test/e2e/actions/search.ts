import { searchImagesForm } from '../selectors/images';
import {
  formatFilterDropDown,
  formatFilterDropDownButton,
  formatFilterMobileButton,
  mobileModal,
  mobileModalCloseButton,
  worksSearchInputField,
} from '../selectors/search';
import { searchWorksForm } from '../selectors/works';
import { isMobile, fillInputAction, pressEnterAction } from './common';

type formType = 'images' | 'works';

// Fill actions

export async function fillActionSearchInput(
  value: string,
  condition?: formType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${worksSearchInputField}`;

  await fillInputAction(selector, value);
}

// Press actions

export async function pressActionEnterSearchInput(): Promise<void> {
  await pressEnterAction(worksSearchInputField);
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
  condition?: formType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${formatFilterMobileButton}`;

  await page.click(selector);
}

export async function clickActionCloseModalFilterButton(
  condition?: formType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${mobileModalCloseButton}`;
  await page.click(selector);
}
