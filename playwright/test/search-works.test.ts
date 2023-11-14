import { URL } from 'url';
import { test, expect } from '@playwright/test';
import {
  isMobile,
  newWorksSearch,
  workWithDigitalLocationAndLocationNote,
} from './contexts';
import {
  navigateToNextPageAndConfirmNavigation,
  navigateToResultAndConfirmTitleMatches,
  openFilterDropdown,
  searchQueryAndSubmit,
  selectFilterAndWaitForApplied,
  testIfFilterIsApplied,
} from './helpers/search';

test.describe.configure({ mode: 'parallel' });

test('(1) | The user is looking for an archive; it should be browsable from the search results', async ({
  page,
  context,
}) => {
  await newWorksSearch(context, page);
  await searchQueryAndSubmit('Persian', page);
  await selectFilterAndWaitForApplied('workType', 'h', page); // Formats > Archives and manuscripts
  await navigateToNextPageAndConfirmNavigation(page);
  await navigateToResultAndConfirmTitleMatches(3, page);
});

test('(2) | The user is looking for a video; they can get back to their original search results', async ({
  page,
  context,
}) => {
  await newWorksSearch(context, page);
  await searchQueryAndSubmit('Britain', page);
  await selectFilterAndWaitForApplied('workType', 'g', page); // Formats > Video
  await navigateToNextPageAndConfirmNavigation(page);

  // Save the URL of the current search page, which will be something like
  // https://www-stage.wellcomecollection.org/search/works?query=Britain&workType=g&page=2
  const originalSearchUrl = new URL(page.url());

  await navigateToResultAndConfirmTitleMatches(3, page);

  const backToSearchResults = page.getByRole('link', {
    name: 'Back to search results',
  });
  await expect(backToSearchResults).toBeVisible();
  await backToSearchResults.click();

  await page.waitForURL(url => {
    // Now compare the URLs.  Note that the query parameters may be in a different order,
    // but they're still equivalent for our purposes, e.g.
    //
    //      /search/works?query=Britain&workType=g&page=2 and
    //      /search/works?query=Britain&page=2&workType=g
    //
    // are both totally fine.  Sorting them first makes them easier to compare.

    expect(originalSearchUrl.searchParams.sort()).toEqual(
      url.searchParams.sort()
    );
    return true; // Won't get here if the expect above fails
  });
});

// This is a check that we have actually loaded some results from
// the API, and the API hasn't just errored out.
test('(3) | The user is searching for a work from a particular year; there is a list of results', async ({
  page,
  context,
}) => {
  await newWorksSearch(context, page);
  await searchQueryAndSubmit('brain', page);
  await openFilterDropdown('production.dates', page);

  await page
    .locator('input[form="search-page-form"][name="production.dates.from"]')
    .fill('1939');

  await page
    .locator('input[form="search-page-form"][name="production.dates.to"]')
    .fill('2001');

  if (isMobile(page)) {
    await page.click(`"Show results"`);
  }

  await testIfFilterIsApplied('From 1939', page);
  await testIfFilterIsApplied('To 2001', page);

  await expect(page.getByTestId('work-search-result')).toHaveCount(25);
});

test('(4) | The user is sorting by production dates in search; sort updates URL query and goes back to the first page', async ({
  context,
  page,
}) => {
  await newWorksSearch(context, page);

  const select = page.locator('select[name="sortOrder"]');

  await select.selectOption({ index: 2 });
  await expect(select).toHaveValue('production.dates.desc');

  await navigateToNextPageAndConfirmNavigation(page);

  await select.selectOption({ index: 1 });
  await expect(select).toHaveValue('production.dates.asc');
  await expect(
    page.getByTestId('pagination').locator('input[name="page"]')
  ).toHaveValue('1');
});

test('(5) | The user is coming from a prefiltered series search; they should be able to add more filters', async ({
  context,
  page,
}) => {
  await workWithDigitalLocationAndLocationNote(context, page);

  await page.click('a >> text="Medical Heritage LIbrary"'); // Medical Heritage LIbrary
  await expect(page.locator('form[role="search"]')).toHaveId(
    'search-page-form'
  );

  await testIfFilterIsApplied('Medical Heritage LIbrary', page);

  await selectFilterAndWaitForApplied('workType', 'a', page); // Formats > Books

  await testIfFilterIsApplied('Medical Heritage LIbrary', page);
  await testIfFilterIsApplied('Books', page);
});
