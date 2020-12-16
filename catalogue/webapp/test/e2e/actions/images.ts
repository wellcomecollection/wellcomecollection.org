import {
  colourSelector,
  colourSelectorFilterDropDown,
  imagesResultsListItem,
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

export async function clickActionClickImageResultItem(
  nthChild: number
): Promise<void> {
  await page.click(`${imagesResultsListItem}:nth-child(${nthChild}) a`);
}

export async function clickActionClickViewExpandedImage(): Promise<void> {
  await page.click(
    `${modalexpandedImaged} ${modalexpandedImageViewMoreButton}`
  );
}
