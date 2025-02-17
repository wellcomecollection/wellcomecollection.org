import { test } from '@playwright/test';

import { newAllSearch } from './helpers/contexts';
import { searchQuerySubmitAndWait } from './helpers/search';
import { baseUrl, slowExpect } from './helpers/utils';

test.describe.configure({ mode: 'parallel' });

test('(1) | The user is searching', async ({ page, context }) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('opening times', page);

  // Contains client-side Catalogue works
  await slowExpect(
    page.getByRole('link', { name: 'All catalogue results' })
  ).toBeVisible();

  // …and images
  await slowExpect(
    page.getByRole('link', { name: 'All image results' })
  ).toBeVisible();

  // In page link (not the one in the footer) goes to the opening times page
  await page.getByRole('link', { name: 'Opening times Find out' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/visit-us/opening-times`);
});

test('(2) | The user is searching for an event', async ({ page, context }) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('Patterns of Life event', page);
  await slowExpect(
    page.getByText('Wednesday 14 March 2018, 15:30 – 17:00')
  ).toBeVisible();
  await page.getByRole('link', { name: 'Cell: the Patterns of Life' }).click();
  await slowExpect(page).toHaveURL(
    `${baseUrl}/events/cell--the-patterns-of-life`
  );
});

test('(3) | The user is searching for an exhibition', async ({
  page,
  context,
}) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('Being Human', page);
  await slowExpect(
    page.getByText('5 September 2019 – 1 January 2090')
  ).toBeVisible();
  await page.getByRole('link', { name: 'Exhibition Being human' }).click();
  await slowExpect(page).toHaveURL(`${baseUrl}/exhibitions/being-human`);
});
