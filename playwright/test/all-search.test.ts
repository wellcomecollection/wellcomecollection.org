import { test } from '@playwright/test';

import { newAllSearch } from './helpers/contexts';
import { searchQuerySubmitAndWait } from './helpers/search';
import { baseUrl, slowExpect } from './helpers/utils';

test.describe.configure({ mode: 'parallel' });

test('(1) | The user is searching for venue opening times', async ({
  page,
  context,
}) => {
  await newAllSearch(context, page);
  await searchQuerySubmitAndWait('opening times', page);
  await page.getByRole('link', { name: 'Opening times Find out' }).click(); // not the one in the footer
  await slowExpect(page).toHaveURL(`${baseUrl}/visit-us/opening-times`);
});

test('(2) | The user is searching for a visual story', async ({
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

test('(3) | The user is searching for an event', async ({ page, context }) => {
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

test('(4) | The user is searching for an exhibition', async ({
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

// test('(2) | The user clicks on "All Stories" on the Overview page; they should be taken to the stories search page', async ({
//   page,
//   context,
// }) => {
//   await newAllSearch(context, page);
//   await searchQuerySubmitAndWait('art of science', page);
//   await page.getByRole('link', { name: 'All stories' }).click();
//   await slowExpect(page).toHaveURL(
//     `${baseUrl}/search/stories?query=art+of+science`
//   );
// });

// test("(3) | The user does a search with filters that doesn't have results; they should be informed with the relevant no results component", async ({
//   page,
//   context,
// }) => {
//   const queryString = 'gsdhg;djs';
//   await newAllSearch(context, page, 'images');
//   await selectAndWaitForFilter('Licences', 'pdm', page); // Public Domain Mark
//   await testIfFilterIsApplied('Public Domain Mark', page);
//   await searchQuerySubmitAndWait(queryString, page);

//   await expect(await page.getByTestId('search-no-results')).toHaveText(
//     `We couldn’t find anything that matched ${queryString} with the filters you have selected.`
//   );
// });

// test('(4) | The search input stays focussed when submitted', async ({
//   context,
//   page,
// }) => {
//   await newAllSearch(context, page, 'works');
//   await searchQuerySubmitAndWait('worms', page);
//   await expect(page.getByRole('searchbox')).toBeFocused();
// });

// test('(5) | The search input does not have focus on initial load', async ({
//   context,
//   page,
// }) => {
//   await newAllSearch(context, page, 'works');
//   await expect(page.getByRole('searchbox')).not.toBeFocused();
// });

// test('(6) | Boolean filters are disabled when there are no results that match them', async ({
//   context,
//   page,
// }) => {
//   await newAllSearch(context, page, 'events');
//   await selectAndWaitForFilter('Event types', 'W-BjXhEAAASpa8Kb', page); // Shopping
//   await expect(
//     page.getByLabel('Catch-up events only', { exact: false })
//   ).toBeDisabled();
// });
