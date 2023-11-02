import { Page } from 'playwright';
import { URL, URLSearchParams } from 'url';
import { expect } from '@playwright/test';
import { isMobile } from '../contexts';
import safeWaitForNavigation from './safeWaitForNavigation';
import { formatFilterMobileButton } from '../selectors/search';

export const worksSearchForm = '#search-searchbar';

const removeCachebustParameter = (url: string) => {
  const urlObj = new URL(url);
  urlObj.searchParams.delete('cachebust');
  return urlObj.href;
};

export const searchFor = async (query: string, page: Page): Promise<void> => {
  await page.fill(worksSearchForm, query);
  await Promise.all([
    page.press(worksSearchForm, 'Enter'),
    page.waitForURL(`${removeCachebustParameter(page.url())}?query=${query}`),
  ]);
};

export const expectSearchParam = (
  expectedKey: string,
  expectedVal: string | undefined,
  page: Page
) => {
  const params = new URLSearchParams(page.url());
  console.log({ params });
  if (expectedVal) {
    const foundMatchingParam = Array.from(params).find(([key, val], i) => {
      if (i === 0) {
        // The first key returns the whole URL.
        // This is fine if it has "cachebust" which we ignored,
        // but if the first value is a valid filter, it never matches.
        return (
          key.slice(key.indexOf('?') + 1) === expectedKey && val === expectedVal
        );
      } else {
        return key === expectedKey && val === expectedVal;
      }
    });

    if (!foundMatchingParam) {
      console.info('No matching params for', page.url(), {
        expectedKey,
        expectedVal,
      });
    }
    expect(foundMatchingParam).toBeTruthy();
  } else {
    const noMatchProps = !Array.from(params).find(
      ([key]) => key === expectedKey
    );

    expect(noMatchProps).toBeTruthy();
  }
};

export const openDropdown = async (id: string, page: Page) => {
  if (isMobile(page)) {
    await page.click(formatFilterMobileButton);
  } else {
    await page.click(`button[aria-controls="${id}"]`);
  }
};

export const selectFilter = async (
  filterId: string,
  checkboxId: string,
  page: Page
) => {
  await openDropdown(filterId, page);

  const checkbox = page.locator(
    `input[form="search-page-form"][name="${filterId}"][value="${checkboxId}"]`
  );

  // Click checkbox
  // Wait for Checkbox to be checked, this happens once the page has loaded
  await Promise.all([
    checkbox.click(),
    page.waitForURL(url => url.search.indexOf(filterId) > 0, {
      waitUntil: 'domcontentloaded',
    }),
  ]);

  if (isMobile(page)) {
    await page.click(`"Show results"`);
  }
};

export const navigateToNextPage = async (page: Page) => {
  // data-testid is only set on Pagination components that aren't hidden on mobile
  // in `common/views/components/Pagination/Pagination.tsx`
  const nextButton = page
    .locator('[data-testid="pagination"]')
    .getByRole('link', { name: 'Next' });

  const currentPage = Number(new URL(page.url()).searchParams.get('page') || 1);

  await Promise.all([
    nextButton.click(),
    page.waitForURL(
      url => url.search.indexOf(`page=${currentPage + 1}`) > 0
      //  {
      //   waitUntil: 'domcontentloaded',
      // }
    ),
  ]);
};

export const navigateToResult = async (n = 1, page: Page) => {
  const result = `main ul li:nth-of-type(${n}) a`;
  await page.waitForTimeout(1000);
  const searchResultTitle = await page.textContent(`${result} h3`);

  // For reasons I don't really understand, the safeWaitForNavigation will timeout…
  // but only in the mobile tests.
  //
  // Since that helper is only a test convenience and isn't testing the behaviour of
  // the site, I haven't investigated further -- this seems to make the tests happy.
  if (isMobile(page)) {
    await page.click(result);
    await safeWaitForNavigation(page);
  } else {
    await Promise.all([safeWaitForNavigation(page), page.click(result)]);
  }

  await page.waitForTimeout(1000);
  const title = await page.textContent('h1');
  expect(title).toBe(searchResultTitle);
};
