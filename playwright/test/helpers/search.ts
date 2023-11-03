import { Page } from 'playwright';
import { expect } from '@playwright/test';
import { isMobile } from '../contexts';
import { formatFilterMobileButton } from '../selectors/search';

export const worksSearchForm = '#search-searchbar';

export const searchQueryAndSubmit = async (
  query: string,
  page: Page
): Promise<void> => {
  await page.fill(worksSearchForm, query);
  await page.press(worksSearchForm, 'Enter');
};

export const openFilterDropdown = async (id: string, page: Page) => {
  if (isMobile(page)) {
    await page.click(formatFilterMobileButton);
  } else {
    await page.click(`button[aria-controls="${id}"]`);
  }
};

export const selectFilterAndWaitForApplied = async (
  filterId: string,
  checkboxId: string,
  page: Page
) => {
  await openFilterDropdown(filterId, page);

  const checkbox = page.locator(
    `input[form="search-page-form"][name="${filterId}"][value="${checkboxId}"]`
  );

  await checkbox.click();

  await expect(checkbox).toBeChecked();

  if (isMobile(page)) {
    await page.click(`"Show results"`);
  }
};

export const navigateToNextPageAndConfirmNavigation = async (page: Page) => {
  const currentPage = await page
    .getByTestId('pagination')
    .locator('input[name="page"]')
    .inputValue();
  const nextButton = page
    .locator('[data-testid="pagination"]')
    .getByRole('link', { name: 'Next' });

  await nextButton.click();
  await expect(
    page.getByTestId('pagination').locator('input[name="page"]')
  ).toHaveValue(String(Number(currentPage) + 1));
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
