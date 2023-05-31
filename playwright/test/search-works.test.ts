import { Page } from 'playwright';
import { URL, URLSearchParams } from 'url';
import { test, expect } from '@playwright/test';
import {
  isMobile,
  newWorksSearch,
  workWithDigitalLocationAndLocationNote,
} from './contexts';
import safeWaitForNavigation from './helpers/safeWaitForNavigation';
import { formatFilterMobileButton } from './selectors/search';

export const worksSearchForm = '#search-searchbar';
export const searchFor = async (query: string, page: Page): Promise<void> => {
  console.info('searchFor', query);
  await page.fill(worksSearchForm, query);
  await Promise.all([
    page.press(worksSearchForm, 'Enter'),
    safeWaitForNavigation(page),
  ]);
};

const expectSearchParam = (
  expectedKey: string,
  expectedVal: string | undefined,
  page: Page
) => {
  console.info('expectSearchParam', { expectedKey, expectedVal });
  const params = new URLSearchParams(page.url());

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
      console.log(page.url());
    }

    expect(foundMatchingParam).toBeTruthy();
  } else {
    const noMatchProps = !Array.from(params).find(
      ([key]) => key === expectedKey
    );

    expect(noMatchProps).toBeTruthy();
  }
};

const openDropdown = async (label: string, page: Page) => {
  console.info('openDropdown', label);
  if (isMobile(page)) {
    await page.click(formatFilterMobileButton);
  } else {
    await page.click(`button :text("${label}")`);
  }
};

const selectCheckbox = async (label: string, page: Page) => {
  console.info('selectCheckbox', label);
  await Promise.all([
    safeWaitForNavigation(page),
    page.click(`label :text("${label}")`),
  ]);
  await page.waitForTimeout(1000);

  if (isMobile(page)) {
    await page.click(`"Show results"`);
  }
};

const navigateToNextPage = async (page: Page) => {
  // data-testid is only set on Pagination components that aren't hidden on mobile
  // in `common/views/components/Pagination/Pagination.tsx`
  await page.waitForTimeout(2000);

  await Promise.all([
    safeWaitForNavigation(page),
    page.click('[data-testid="pagination"] button'),
  ]);
};

const navigateToResult = async (n = 1, page: Page) => {
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

test.describe.configure({ mode: 'parallel' });

test.describe('Scenario 1: The person is looking for an archive', () => {
  test('the work should be browsable to from the search results', async ({
    page,
    context,
  }) => {
    await newWorksSearch(context, page);
    await searchFor('Persian', page);
    await openDropdown('Formats', page);
    await selectCheckbox('Archives and manuscripts', page);
    await navigateToNextPage(page);

    expectSearchParam('workType', 'h', page);

    await navigateToResult(3, page);
  });

  test('and the user can get back to their original search results', async ({
    page,
    context,
  }) => {
    // Open the search page, search for a term, apply a filter, navigate away from
    // the first page.
    await newWorksSearch(context, page);
    await searchFor('Persian', page);
    await openDropdown('Formats', page);
    await selectCheckbox('Archives and manuscripts', page);
    await navigateToNextPage(page);

    // Save the URL of the current search page, which will be something like
    // https://www-stage.wellcomecollection.org/search/works?query=Persian&workType=h&page=2
    const originalSearchUrl = new URL(page.url());

    // Now go to the third result on the page, and look for "Back to search results".
    await navigateToResult(3, page);

    const backToSearchResults = await page.$(
      'a:has-text("Back to search results")'
    );
    expect(backToSearchResults).toBeTruthy();

    // Note: we expect the URLs on the "Back to search results" link to be relative,
    // but the URL class only takes absolute URLs.
    //
    // Check this is a relative URL, then construct an absolute URL we can compare.
    const backToSearchResultsUrlString =
      (await backToSearchResults?.getAttribute('href')) as string;
    expect(backToSearchResultsUrlString.startsWith('/')).toBe(true);

    const backToSearchResultsUrl = new URL(
      `${process.env.PLAYWRIGHT_BASE_URL}${backToSearchResultsUrlString}`
    );

    // Now compare the URLs.  Note that the query parameters may be in a different order,
    // but they're still equivalent for our purposes, e.g.
    //
    //      /search/works?query=Persian&workType=h&page=2 and
    //      /search/works?query=Persian&page=2&workType=h
    //
    // are both totally fine.  Sorting them first makes them easier to compare.
    expect(originalSearchUrl.pathname).toEqual(backToSearchResultsUrl.pathname);

    originalSearchUrl.searchParams.sort();
    backToSearchResultsUrl.searchParams.sort();

    expect(originalSearchUrl.searchParams).toEqual(
      backToSearchResultsUrl.searchParams
    );
  });
});

test.describe('Scenario 2: The person is searching for a work on open shelves', () => {
  test('the work should be browsable to from the search results', async ({
    page,
    context,
  }) => {
    await newWorksSearch(context, page);
    await searchFor('eyes', page);
    await openDropdown('Locations', page);
    await selectCheckbox('Open shelves', page);
    await navigateToNextPage(page);

    expectSearchParam('availabilities', 'open-shelves', page);

    await navigateToResult(6, page);
  });
});

test.describe('Scenario 3: The person is searching for a work that is available online', () => {
  test('the work should be browsable to from the search results', async ({
    page,
    context,
  }) => {
    await newWorksSearch(context, page);
    await searchFor('skin', page);
    await openDropdown('Locations', page);
    await selectCheckbox('Online', page);
    await navigateToNextPage(page);

    expectSearchParam('availabilities', 'online', page);

    await navigateToResult(8, page);
  });
});

test.describe('Scenario 4: The person is searching for a work from Wellcome Images', () => {
  test('the work should be browsable to from the search results', async ({
    page,
    context,
  }) => {
    await newWorksSearch(context, page);
    await searchFor('skeleton', page);
    await openDropdown('Formats', page);
    await selectCheckbox('Digital images', page);
    await navigateToNextPage(page);

    expectSearchParam('workType', 'q', page);

    await navigateToResult(1, page);
  });
});

test.describe('Scenario 5: The person is searching for a work in closed stores', () => {
  test('the work should be browsable to from the search results', async ({
    page,
    context,
  }) => {
    await newWorksSearch(context, page);
    await searchFor('brain', page);
    await openDropdown('Locations', page);
    await selectCheckbox('Closed stores', page);
    await navigateToNextPage(page);

    expectSearchParam('availabilities', 'closed-stores', page);

    await navigateToResult(6, page);
  });
});

test.describe('Scenario 6: The reader is searching for works from a particular year', () => {
  test('the work should be browsable to from the search results', async ({
    page,
    context,
  }) => {
    await newWorksSearch(context, page);
    await searchFor('brain', page);
    await openDropdown('Dates', page);

    // Note: if you put both `page.locator(…).fill(…)` commands in a
    // single Promise.all(), they can interfere in such a way that only
    // one of them ends up in the final URL. :-/

    await Promise.all([
      page
        .locator('input[form="search-page-form"][name="production.dates.from"]')
        .fill('1939'),
      safeWaitForNavigation(page),
    ]);

    await Promise.all([
      page
        .locator('input[form="search-page-form"][name="production.dates.to"]')
        .fill('2001'),
      safeWaitForNavigation(page),
    ]);

    if (isMobile(page)) {
      await page.click(`"Show results"`);
    }

    expectSearchParam('production.dates.from', '1939', page);
    expectSearchParam('production.dates.to', '2001', page);

    // This is a check that we have actually loaded some results from
    // the API, and the API hasn't just errored out.
    await navigateToResult(6, page);
  });
});

test.describe('Scenario 7: The user is sorting by production dates in search', () => {
  test('Sort updates URL query and goes back to the first page', async ({
    context,
    page,
  }) => {
    await newWorksSearch(context, page);

    const select = page.locator('select[name="sortOrder"]');
    await select.selectOption({ index: 2 });

    await safeWaitForNavigation(page);
    await navigateToNextPage(page);

    expectSearchParam('sortOrder', 'desc', page);
    expectSearchParam('sort', 'production.dates', page);
    expectSearchParam('page', '2', page);

    await select.selectOption({ index: 1 });
    await safeWaitForNavigation(page);

    expectSearchParam('sortOrder', 'asc', page);
    expectSearchParam('page', undefined, page);
  });
});

test.describe('Scenario 8: The user is coming from a prefiltered series search', () => {
  test('The user should be able to add more filters', async ({
    context,
    page,
  }) => {
    await workWithDigitalLocationAndLocationNote(context, page);

    await page.click('a >> text="Medical Heritage LIbrary"'); // Medical Heritage LIbrary
    await safeWaitForNavigation(page);

    expectSearchParam('partOf.title', 'Medical Heritage LIbrary', page);

    await openDropdown('Formats', page);
    await selectCheckbox('Books', page);

    expectSearchParam('partOf.title', 'Medical Heritage LIbrary', page);
    expectSearchParam('workType', 'a', page);
  });
});
