import { imagesResultsListItem, searchImagesForm } from '../selectors/images';
import {
  formatFilterDropDown,
  formatFilterDropDownButton,
  formatFilterMobileButton,
  mobileModal,
  mobileModalCloseButton,
  worksSearchImagesInputField,
} from '../selectors/search';
import { fillInputAction } from './common';
import { Page } from 'playwright';
import { isMobile } from '../contexts';

// Fill actions
export const fillActionSearchInput =
  (value: string) =>
  async (page: Page): Promise<void> => {
    const selector = `${searchImagesForm} ${worksSearchImagesInputField}`;
    await fillInputAction(selector, value)(page);
  };

// Press actions
export const pressActionEnterSearchInput = async (
  page: Page
): Promise<void> => {
  const selector = `${searchImagesForm} ${worksSearchImagesInputField}`;
  await page.press(selector, 'Enter');
};

// Click actions
export const clickActionFormatDropDown = async (page: Page): Promise<void> => {
  await page.click(formatFilterDropDownButton);
};

export const clickActionFormatRadioCheckbox =
  (filterName: string) =>
  async (page: Page): Promise<void> => {
    const selector = `${
      isMobile(page) ? mobileModal : formatFilterDropDown
    } label[aria-label="Radio checkbox ${filterName}"]`;
    await page.click(selector);
  };

export const clickActionModalFilterButton = async (
  page: Page
): Promise<void> => {
  const selector = `${searchImagesForm} ${formatFilterMobileButton}`;
  await page.click(selector);
};

export const clickActionCloseModalFilterButton = async (
  page: Page
): Promise<void> => {
  const selector = `${searchImagesForm} ${mobileModalCloseButton}`;
  await page.click(selector);
};

export const clickActionClickSearchResultItem =
  (nthChild: number) =>
  async (page: Page): Promise<void> => {
    const selector = `${imagesResultsListItem}:nth-child(${nthChild}) a`;

    await page.click(selector);
  };
