import { expect, test } from '@playwright/test';

import { isMobile, search } from './helpers/contexts';
import {
  clickImageSearchResultItem,
  searchQuerySubmitAndWait,
} from './helpers/search';
import { baseUrl, ItemViewerURLRegex, slowExpect } from './helpers/utils';

test.describe.configure({ mode: 'parallel' });

test('(1) | The user can find addressable site content', async ({
  page,
  context,
}) => {
  await search(context, page);
  await searchQuerySubmitAndWait('opening times', page);
  // In page link (not the one in the footer) goes to the opening times page
  await page.getByRole('link', { name: 'Opening times Find out' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/visit-us/opening-times`);
});

test('(2) | The user can find catalogue works', async ({ page, context }) => {
  await search(context, page);
  await searchQuerySubmitAndWait('test', page);
  await page.getByRole('link', { name: 'All catalogue results' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/search/works?query=test`);
});

test('(3) | The user can find images', async ({ page, context }) => {
  if (isMobile(page)) return; // hidden on smaller screens

  await search(context, page);
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

test('(4) | The user can find work types', async ({ page, context }) => {
  if (isMobile(page)) return; // hidden on smaller screens
  await search(context, page);
  await searchQuerySubmitAndWait('test', page);
  await page.getByRole('link', { name: /^Books \(/ }).click();
  await slowExpect(page).toHaveURL(
    `${baseUrl}/search/works?query=test&workType=a`
  );
});

test('(5) | The user can find catalogue images', async ({ page, context }) => {
  await search(context, page);
  await searchQuerySubmitAndWait('test', page);
  await page.getByRole('link', { name: 'All image results' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/search/images?query=test`);
});

test('(6) | The user gets a message if search yields no results', async ({
  page,
  context,
}) => {
  await search(context, page);
  await searchQuerySubmitAndWait('bananana', page);
  const noResultsMessage = page.getByTestId('search-no-results');
  await slowExpect(noResultsMessage).toContainText(
    'We couldn’t find anything that matched bananana'
  );
});

test('(7) | The user can paginate through results', async ({
  page,
  context,
}) => {
  await search(context, page);
  await searchQuerySubmitAndWait('test', page);
  await page.getByRole('link', { name: 'Next (page 2)' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/search?query=test&page=2`);
});

test('(8) | The user sees content results even if the Catalogue API is down', async ({
  page,
  context,
}) => {
  // Block the api calls before navigating
  await page.route('*/**/catalogue/v2/works*', async route => {
    await route.fulfill({ status: 500 });
  });
  await page.route('*/**/catalogue/v2/images*', async route => {
    await route.fulfill({ status: 500 });
  });

  await search(context, page);

  const allCatalogueResultsLink = await page.getByRole('link', {
    name: 'All catalogue results',
  });
  const allImageResultsLink = await page.getByRole('link', {
    name: 'All image results',
  });

  await expect(allCatalogueResultsLink).not.toBeVisible();
  await expect(allImageResultsLink).not.toBeVisible();

  await expect(page.getByTestId('search-content-results')).toBeVisible();
});
