import { test } from '@playwright/test';

import { newAllSearch } from './helpers/contexts';
import { searchQuerySubmitAndWait } from './helpers/search';
import { baseUrl, slowExpect } from './helpers/utils';

test.describe.configure({ mode: 'parallel' });

test('(1) | The user can search for addressable site content', async ({
  page,
  context,
}) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('opening times', page);
  // In page link (not the one in the footer) goes to the opening times page
  await page.getByRole('link', { name: 'Opening times Find out' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/visit-us/opening-times`);
});

test('(2) | The user can find catalogue works', async ({ page, context }) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('test', page);
  await page.getByRole('link', { name: 'All catalogue results' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/search/works?query=test`);
});

test('(3) | The user can find catalogue images', async ({ page, context }) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('test', page);
  await page.getByRole('link', { name: 'All image results' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/search/images?query=test`);
});

test.only('(4) | The user gets a message if search yields no results', async ({
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
