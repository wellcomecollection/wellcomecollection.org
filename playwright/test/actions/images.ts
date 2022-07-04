import {
  colourSelector,
  colourSelectorFilterDropDown,
  modalexpandedImaged,
  modalexpandedImageViewMoreButton,
} from '../selectors/images';
import { Page } from 'playwright';
import safeWaitForNavigation from '../helpers/safeWaitForNavigation';

export const clickActionColourDropDown = async (page: Page): Promise<void> => {
  await page.click(colourSelectorFilterDropDown);
};

export const selectColourInPicker = async (page: Page): Promise<void> => {
  await Promise.all([safeWaitForNavigation(page), page.click(colourSelector)]);
};

export const clickActionClickViewExpandedImage = async (
  page: Page
): Promise<void> => {
  await page.click(
    `${modalexpandedImaged} ${modalexpandedImageViewMoreButton}`
  );
};
