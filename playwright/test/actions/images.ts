import {
  colourSelector,
  colourSelectorFilterDropDown,
  modalexpandedImaged,
  modalexpandedImageViewMoreButton,
} from '../selectors/images';
import { Page } from 'playwright';

export const clickActionColourDropDown = async (page: Page): Promise<void> => {
  await page.click(colourSelectorFilterDropDown);
};

export const clickActionColourPicker = async (page: Page): Promise<void> => {
  await page.click(colourSelector);
};

export const clickActionClickViewExpandedImage = async (
  page: Page
): Promise<void> => {
  await page.click(
    `${modalexpandedImaged} ${modalexpandedImageViewMoreButton}`
  );
};
