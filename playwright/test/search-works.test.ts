import { URL } from 'url';
import { test, expect } from '@playwright/test';
import {
  isMobile,
  newWorksSearch,
  workWithDigitalLocationAndLocationNote,
} from './contexts';
import {
  navigateToNextPage,
  navigateToResult,
  openDropdown,
  searchFor,
  selectFilter,
  worksSearchForm,
} from './helpers/search';
import { formatFilterMobileButton } from './selectors/search';

test.describe.configure({ mode: 'parallel' });

test('(1.1) | The user is looking for an archive; it should be browsable from the search results', async ({
  page,
  context,
}) => {
  await newWorksSearch(context, page);

  // searchFor
  await page.fill(worksSearchForm, 'Persian');
  await page.press(worksSearchForm, 'Enter');

  // selectFilter
  if (isMobile(page)) {
    await page.click(formatFilterMobileButton);
  } else {
    await page.click('button[aria-controls="workType"]');
  }

  const filterCheckbox = page.locator(
    'input[form="search-page-form"][type="checkbox"][name="workType"][value="h"]'
  ); // Formats > Archives and manuscripts

  await filterCheckbox.click();
  await expect(filterCheckbox).toBeChecked();

  if (isMobile(page)) {
    await page.click(`"Show results"`);
  }

  // navigateToNextPage
  const nextButton = page
    .locator('[data-testid="pagination"]')
    .getByRole('link', { name: 'Next' });

  await nextButton.click();

  // confirm navigateToNextPage
  await expect(page).toHaveURL(/workType=h/);
  await expect(
    page.getByTestId('pagination').locator('input[name="page"]')
  ).toHaveValue('2');

  // navigateToResult
  const result = `main ul li:nth-of-type(3) a`;
  const searchResultTitle = await page.textContent(`${result} h3`);
  await page.click(result);

  const title = await page.locator('h1');
  await expect(title).toHaveId('work-info');
  await expect(title).toContainText(String(searchResultTitle));
});

test('(1.2) | The user is looking for an archive; they can get back to their original search results', async ({
  page,
  context,
}) => {
  // Open the search page, search for a term, apply a filter, navigate away from
  // the first page.
  await newWorksSearch(context, page);
  await searchFor('Persian', page);
  await selectFilter('workType', 'h', page); // Formats > Archives and manuscripts
  await navigateToNextPage(page);

  await expect(
    page.getByTestId('pagination').locator('input[name="page"]')
  ).toHaveValue('2');

  // Save the URL of the current search page, which will be something like
  // https://www-stage.wellcomecollection.org/search/works?query=Persian&workType=h&page=2
  const originalSearchUrl = new URL(page.url());

  // Now go to the third result on the page, and look for "Back to search results".
  await navigateToResult(3, page);

  const backToSearchResults = page.locator(
    'a:has-text("Back to search results")'
  );
  await expect(backToSearchResults).toBeVisible();

  // Note: we expect the URLs on the "Back to search results" link to be relative,
  // but the URL class only takes absolute URLs.
  //
  // Check this is a relative URL, then construct an absolute URL we can compare.
  const backToSearchResultsUrlString = (await backToSearchResults?.getAttribute(
    'href'
  )) as string;
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

test('(2) | The user is searching for a work on open shelves; it should be browsable from the search results', async ({
  page,
  context,
}) => {
  await newWorksSearch(context, page);
  await searchFor('eyes', page);
  await selectFilter('availabilities', 'open-shelves', page); // Locations > Open shelves
  await navigateToNextPage(page);

  await expect(
    page.getByTestId('pagination').locator('input[name="page"]')
  ).toHaveValue('2');

  const searchParams = new URLSearchParams(new URL(page.url()).search);
  expect(searchParams.get('availabilities')).toEqual('open-shelves');

  await navigateToResult(6, page);
});

test('(3) | The user is searching for a work that is available online; it should be browsable from the search results', async ({
  page,
  context,
}) => {
  await newWorksSearch(context, page);
  await searchFor('skin', page);
  await selectFilter('availabilities', 'online', page); // Locations > Online
  await navigateToNextPage(page);

  await expect(
    page.getByTestId('pagination').locator('input[name="page"]')
  ).toHaveValue('2');

  const searchParams = new URLSearchParams(new URL(page.url()).search);
  expect(searchParams.get('availabilities')).toEqual('online');

  await navigateToResult(8, page);
});

test('(4) | The user is searching for a work from Wellcome Images; it should be browsable from the search results', async ({
  page,
  context,
}) => {
  await newWorksSearch(context, page);
  await searchFor('skeleton', page);
  await selectFilter('workType', 'q', page); // Formats > Digital images
  await navigateToNextPage(page);

  await expect(
    page.getByTestId('pagination').locator('input[name="page"]')
  ).toHaveValue('2');

  const searchParams = new URLSearchParams(new URL(page.url()).search);
  expect(searchParams.get('workType')).toEqual('q');

  await navigateToResult(1, page);
});

test('(5) | The user is searching for a work in closed stores; it should be browsable from the search results', async ({
  page,
  context,
}) => {
  await newWorksSearch(context, page);
  await searchFor('brain', page);
  await selectFilter('availabilities', 'closed-stores', page); // Locations > Closed stores
  await navigateToNextPage(page);

  await expect(
    page.getByTestId('pagination').locator('input[name="page"]')
  ).toHaveValue('2');

  const searchParams = new URLSearchParams(new URL(page.url()).search);
  expect(searchParams.get('availabilities')).toEqual('closed-stores');

  await navigateToResult(6, page);
});

test('(6) | The user is searching for works from a particular year; it should be browsable from the search results', async ({
  page,
  context,
}) => {
  await newWorksSearch(context, page);
  await searchFor('brain', page);
  await openDropdown('production.dates', page);

  const datesFrom = page.locator(
    'input[form="search-page-form"][name="production.dates.from"]'
  );
  await datesFrom.fill('1939');

  const datesTo = page.locator(
    'input[form="search-page-form"][name="production.dates.to"]'
  );
  await datesTo.fill('2001');

  if (isMobile(page)) {
    await page.click(`"Show results"`);
    await expect(page.getByRole('button', { name: 'Filters 1' })).toBeVisible();
  } else {
    await expect(
      page.getByRole('link', { name: 'remove From 1939' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'remove To 2001' })
    ).toBeVisible();
  }

  // This is a check that we have actually loaded some results from
  // the API, and the API hasn't just errored out.
  await navigateToResult(6, page);
});

test('(7) | The user is sorting by production dates in search; sort updates URL query and goes back to the first page', async ({
  context,
  page,
}) => {
  await newWorksSearch(context, page);

  const select = page.locator('select[name="sortOrder"]');
  await select.selectOption({ index: 2 });

  await expect(page).toHaveURL(/sortOrder=desc/);
  await expect(page).toHaveURL(/sort=production\.dates/);

  await navigateToNextPage(page);

  await expect(
    page.getByTestId('pagination').locator('input[name="page"]')
  ).toHaveValue('2');

  await select.selectOption({ index: 1 });

  await expect(page).toHaveURL(/sortOrder=asc/);
  await expect(page).toHaveURL(/sort=production\.dates/);
  await expect(
    page.getByTestId('pagination').locator('input[name="page"]')
  ).toHaveValue('1');
});

test('(8) | The user is coming from a prefiltered series search; they should be able to add more filters', async ({
  context,
  page,
}) => {
  await workWithDigitalLocationAndLocationNote(context, page);

  await page.click('a >> text="Medical Heritage LIbrary"'); // Medical Heritage LIbrary
  await expect(page.locator('form[role="search"]')).toHaveId(
    'search-page-form'
  );

  await expect(page).toHaveURL(/partOf\.title=Medical\+Heritage\+LIbrary/);

  await selectFilter('workType', 'a', page); // Formats > Books

  await expect(page).toHaveURL(/partOf\.title=Medical\+Heritage\+LIbrary/);
  await expect(page).toHaveURL(/workType=a/);
});
