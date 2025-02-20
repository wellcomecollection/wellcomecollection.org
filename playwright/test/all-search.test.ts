import { test } from '@playwright/test';

import { isMobile, newAllSearch } from './helpers/contexts';
import {
  clickImageSearchResultItem,
  searchQuerySubmitAndWait,
} from './helpers/search';
import { baseUrl, slowExpect } from './helpers/utils';

const ItemViewerURLRegex = /\/works\/[a-zA-Z0-9]+\/images[?]id=/;

test('The user can find addressable site content', async ({
  page,
  context,
}) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('opening times', page);
  // In page link (not the one in the footer) goes to the opening times page
  await page.getByRole('link', { name: 'Opening times Find out' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/visit-us/opening-times`);
});

test('The user can find catalogue works', async ({ page, context }) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('test', page);
  await page.getByRole('link', { name: 'All catalogue results' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/search/works?query=test`);
});

test('The user can find images', async ({ page, context }) => {
  if (isMobile(page)) return; // hidden on smaller screens

  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('test', page);
  await slowExpect(
    page.getByTestId('image-search-results-container')
  ).toBeVisible();
  await clickImageSearchResultItem(1, page);

  // Check we show visually similar images. This could theoretically fail
  // if the first result doesn't have any similar images, but if it fails
  // it's much more likely we've broken something on the page.
  await slowExpect(
    page.getByRole('heading', { name: 'Visually similar images' })
  ).toBeVisible();

  await page.getByRole('link', { name: 'View expanded image' }).click();
  await slowExpect(page).toHaveURL(RegExp(ItemViewerURLRegex));
});

test('The user can find work types', async ({ page, context }) => {
  if (isMobile(page)) return; // hidden on smaller screens
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('test', page);
  await page.getByRole('link', { name: /^Books \(/ }).click();
  await slowExpect(page).toHaveURL(
    `${baseUrl}/search/works?query=test&workType=a`
  );
});

test('The user can find catalogue images', async ({ page, context }) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('test', page);
  await page.getByRole('link', { name: 'All image results' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/search/images?query=test`);
});

test('The user gets a message if search yields no results', async ({
  page,
  context,
}) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('bananana', page);
  const noResultsMessage = page.getByTestId('search-no-results');
  await slowExpect(noResultsMessage).toContainText(
    'We couldn’t find anything that matched bananana'
  );
});

test('The user can paginate through results', async ({ page, context }) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('test', page);
  await page.getByRole('link', { name: 'Next (page 2)' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/search?query=test&page=2`);
});
