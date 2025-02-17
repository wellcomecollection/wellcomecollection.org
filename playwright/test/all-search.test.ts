import { test } from '@playwright/test';

import { newAllSearch } from './helpers/contexts';
import { searchQuerySubmitAndWait } from './helpers/search';
import { baseUrl, slowExpect } from './helpers/utils';

test.describe.configure({ mode: 'parallel' });

test.only('(1) | The user is looking for venue opening times', async ({
  page,
  context,
}) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('opening times', page);
  await page.getByRole('link', { name: 'Opening times Find out' }).click(); // not the one in the footer
  await slowExpect(page).toHaveURL(`${baseUrl}/visit-us/opening-times`);
});
