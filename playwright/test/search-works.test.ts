import { URL } from 'url';
import { test, expect } from '@playwright/test';
import {
  isMobile,
  newWorksSearch,
  workWithDigitalLocationAndLocationNote,
} from './contexts';
import safeWaitForNavigation from './helpers/safeWaitForNavigation';
import {
  expectSearchParam,
  navigateToNextPage,
  navigateToResult,
  openDropdown,
  searchFor,
  selectFilter,
} from './helpers/search';

test.describe.configure({ mode: 'parallel' });

test('(1.1) | The user is looking for an archive; it should be browsable from the search results', async ({
  page,
  context,
}) => {
  await newWorksSearch(context, page);
  await searchFor('Persian', page);
  await selectFilter('workType', 'h', page); // Formats > Archives and manuscripts
  await navigateToNextPage(page);

  expectSearchParam('workType', 'h', page);

  await navigateToResult(3, page);
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

  expectSearchParam('availabilities', 'open-shelves', page);

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

  expectSearchParam('availabilities', 'online', page);

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

  expectSearchParam('workType', 'q', page);

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

  expectSearchParam('availabilities', 'closed-stores', page);

  await navigateToResult(6, page);
});

test('(6) | The user is searching for works from a particular year; it should be browsable from the search results', async ({
  page,
  context,
}) => {
  await newWorksSearch(context, page);
  await searchFor('brain', page);
  await openDropdown('production.dates', page);

  // Note: if you put both `page.locator(…).fill(…)` commands in a
  // single Promise.all(), they can interfere in such a way that only
  // one of them ends up in the final URL. :-/

  await Promise.all([
    safeWaitForNavigation(page),
    page
      .locator('input[form="search-page-form"][name="production.dates.from"]')
      .fill('1939'),
  ]);

  await Promise.all([
    safeWaitForNavigation(page),
    page
      .locator('input[form="search-page-form"][name="production.dates.to"]')
      .fill('2001'),
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

test.only('(7) | The user is sorting by production dates in search; sort updates URL query and goes back to the first page', async ({
  context,
  page,
}) => {
  await newWorksSearch(context, page);

  const select = page.locator('select[name="sortOrder"]');
  await select.waitFor();

  await Promise.all([
    select.selectOption({ index: 2 }),
    page.waitForURL(
      url =>
        url.search.indexOf('sortOrder=desc') > 0 &&
        url.search.indexOf('sort=production.dates') > 0
    ),
  ]);

  await navigateToNextPage(page);

  expectSearchParam('sortOrder', 'desc', page);
  expectSearchParam('sort', 'production.dates', page);
  expectSearchParam('page', '2', page);

  await Promise.all([
    select.selectOption({ index: 1 }),
    page.waitForURL(
      url => {
        return (
          url.search.indexOf('sortOrder=asc') > 0 &&
          url.search.indexOf('sort=production.dates') > 0 &&
          url.search.indexOf('page') === -1
        );
      },
      {
        waitUntil: 'domcontentloaded',
      }
    ),
  ]);
});

test('(8) | The user is coming from a prefiltered series search; they should be able to add more filters', async ({
  context,
  page,
}) => {
  await workWithDigitalLocationAndLocationNote(context, page);

  await page.click('a >> text="Medical Heritage LIbrary"'); // Medical Heritage LIbrary
  await safeWaitForNavigation(page);

  expectSearchParam('partOf.title', 'Medical Heritage LIbrary', page);

  await selectFilter('workType', 'a', page); // Formats > Books

  expectSearchParam('partOf.title', 'Medical Heritage LIbrary', page);
  expectSearchParam('workType', 'a', page);
});
