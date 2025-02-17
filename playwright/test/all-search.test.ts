import { test } from '@playwright/test';

import { newAllSearch } from './helpers/contexts';
import { searchQuerySubmitAndWait } from './helpers/search';
import { baseUrl, slowExpect } from './helpers/utils';

test.describe.configure({ mode: 'parallel' });

test('(1) | The user is looking for venue opening times', async ({
  page,
  context,
}) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('opening times', page);
  await page.getByRole('link', { name: 'Opening times Find out' }).click(); // not the one in the footer
  await slowExpect(page).toHaveURL(`${baseUrl}/visit-us/opening-times`);
});

test('(2) | The user is looking for a visual story', async ({
  page,
  context,
}) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('visual story', page);
  await page
    .getByRole('link', { name: 'Genetic Automata visual story' })
    .click();
  await slowExpect(page).toHaveURL(
    `${baseUrl}/visual-stories/genetic-automata-visual-story`
  );
});
