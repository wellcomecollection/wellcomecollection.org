// For overall behaviour / behaviour on category change

import { expect, test } from '@playwright/test';

import { search } from './helpers/contexts';
import {
  searchQuerySubmitAndWait,
  selectAndWaitForColourFilter,
  selectAndWaitForFilter,
  testIfFilterIsApplied,
} from './helpers/search';
import { baseUrl, slowExpect } from './helpers/utils';

test.describe.configure({ mode: 'parallel' });

test('(1) | The users changes tabs; the query (but not the filters) should be maintained', async ({
  page,
  context,
}) => {
  await search(context, page, 'images');
  await searchQuerySubmitAndWait('art of science', page);
  await selectAndWaitForColourFilter(page);
  await expect(
    await page.getByTestId('image-search-results-container')
  ).toBeVisible();
  await page.getByRole('link', { name: 'Catalogue' }).click();
  await slowExpect(page).toHaveURL(
    `${baseUrl}/search/works?query=art%20of%20science`
  );
});

test("(3) | The user does a search with filters that doesn't have results; they should be informed with the relevant no results component", async ({
  page,
  context,
}) => {
  const queryString = 'gsdhg;djs';
  await search(context, page, 'images');
  await selectAndWaitForFilter('Licences', 'pdm', page); // Public Domain Mark
  await testIfFilterIsApplied('Public Domain Mark', page);
  await searchQuerySubmitAndWait(queryString, page);

  await expect(await page.getByTestId('search-no-results')).toHaveText(
    `We couldn’t find anything that matched ${queryString} with the filters you have selected.`
  );
});

test('(4) | The search input stays focussed when submitted', async ({
  context,
  page,
}) => {
  await search(context, page, 'works');
  await searchQuerySubmitAndWait('worms', page);
  await expect(page.getByRole('searchbox')).toBeFocused();
});

test('(5) | The search input does not have focus on initial load', async ({
  context,
  page,
}) => {
  await search(context, page, 'works');
  await expect(page.getByRole('searchbox')).not.toBeFocused();
});

test('(6) | Boolean filters are disabled when there are no results that match them', async ({
  context,
  page,
}) => {
  await search(context, page, 'events');
  await selectAndWaitForFilter('Event types', 'W-BjXhEAAASpa8Kb', page); // Shopping
  await expect(
    page.getByLabel('Catch-up events only', { exact: false })
  ).toBeDisabled();
});
