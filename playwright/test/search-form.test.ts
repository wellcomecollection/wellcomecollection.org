import { test, expect } from '@playwright/test';
import { worksSearch } from './contexts';
import { searchFor, worksSearchForm } from './works-search.test';

test('stays focussed on the query input when submitted', async ({
  context,
  page,
}) => {
  await worksSearch(context, page);
  await searchFor('worms', page);
  await expect(page.locator(worksSearchForm)).toBeFocused();
});

test('search input does not have focus on initial load', async ({
  context,
  page,
}) => {
  await worksSearch(context, page);
  await expect(page.locator(worksSearchForm)).not.toBeFocused();
});
