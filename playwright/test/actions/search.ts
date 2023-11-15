import { imagesResultsListItem, searchImagesForm } from '../selectors/images';
import { worksSearchImagesInputField } from '../selectors/search';
import { fillInputAction } from './common';
import { Page } from 'playwright';

// Fill actions
export const fillActionSearchInput = async (
  value: string,
  page: Page
): Promise<void> => {
  const selector = `${searchImagesForm} ${worksSearchImagesInputField}`;
  await fillInputAction(selector, value, page);
};

export const clickActionClickSearchResultItem = async (
  nthChild: number,
  page: Page
): Promise<void> => {
  const selector = `${imagesResultsListItem}:nth-child(${nthChild}) a`;

  await page.click(selector);
};
