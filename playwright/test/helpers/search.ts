import { Page } from 'playwright';
import { expect } from '@playwright/test';
import { isMobile } from './contexts';

export const searchQueryAndSubmit = async (
  query: string,
  page: Page
): Promise<void> => {
  const searchBar = page.getByLabel('Search the catalogue');

  await searchBar.fill(query);
  await searchBar.press('Enter');
};

export const openFilterDropdown = async (name: string, page: Page) => {
  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Filters' }).click();
  } else {
    await page.getByRole('button', { name }).click();
  }
};

export const selectAndWaitForFilter = async (
  filterName: string,
  checkboxId: string,
  page: Page
) => {
  await openFilterDropdown(filterName, page);

  const checkbox = page.locator(
    `input[form="search-page-form"][value="${checkboxId}"]`
  );

  await checkbox.click();

  await expect(checkbox).toBeChecked();

  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Show results' }).click();
  }
};

export const navigateToNextPageAndConfirmNavigation = async (page: Page) => {
  const paginationInput = page.getByTestId('pagination').getByRole('textbox');

  const currentPage = await paginationInput.inputValue();
  const nextButton = page
    .getByTestId('pagination')
    .getByRole('link', { name: 'Next' });

  await nextButton.click();

  await expect(paginationInput).toHaveValue(String(Number(currentPage) + 1));
};

export const navigateToResultAndConfirmTitleMatches = async (
  n = 1,
  page: Page
) => {
  const result = `main ul li:nth-of-type(${n}) a`;
  const searchResultTitle = await page.textContent(`${result} h3`);
  await page.click(result);

  const title = await page.locator('h1');
  await expect(title).toHaveId('work-info');
  await expect(title).toContainText(String(searchResultTitle)); // searchResultTitle could also be null but I expect it would fail accordingly
};

// TODO
// This could probably be better - We should have a different way of spotting if a filter is applied
// Especially for mobile where they are hidden in the modal.
// This isn't solid for multiple reasons such as the fact that "books" could be found multiple times without being the one you want.
//
// As we are considering a redesign of filters, this should be considered as part of it
export const testIfFilterIsApplied = async (label: string, page: Page) => {
  await expect(page.getByRole('status')).toHaveText(
    new RegExp(`.*${label}.*`, 'i')
  );
};
