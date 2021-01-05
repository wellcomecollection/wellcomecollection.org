import {
  colourSelector,
  colourSelectorFilterDropDown,
  modalexpandedImaged,
  modalexpandedImageViewMoreButton,
} from '../selectors/images';

export async function clickActionColourDropDown(): Promise<void> {
  await page.click(colourSelectorFilterDropDown);
}

export async function clickActionColourPicker(): Promise<void> {
  await page.click(colourSelector, {
    position: { x: 100, y: 100 },
  });
}

export async function clickActionClickViewExpandedImage(): Promise<void> {
  await page.click(
    `${modalexpandedImaged} ${modalexpandedImageViewMoreButton}`
  );
}
