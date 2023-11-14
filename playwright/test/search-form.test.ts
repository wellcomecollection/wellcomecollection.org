import { test, expect } from '@playwright/test';
import { newWorksSearch } from './contexts';
import { searchQueryAndSubmit } from './helpers/search';

const worksSearchForm = '#search-searchbar';

test('stays focussed on the query input when submitted', async ({
  context,
  page,
}) => {
  await newWorksSearch(context, page);
  await searchQueryAndSubmit('worms', page);
  await expect(page.locator(worksSearchForm)).toBeFocused();
});

test('search input does not have focus on initial load', async ({
  context,
  page,
}) => {
  await newWorksSearch(context, page);
  await expect(page.locator(worksSearchForm)).not.toBeFocused();
});
