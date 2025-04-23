import { expect, test } from '@playwright/test';

import { search } from './helpers/contexts';
import {
  locateAndConfirmContributorInfoMatchesStory,
  navigateToNextPageAndConfirmNavigation,
  navigateToStoryResultAndConfirmTitleMatches,
  searchQuerySubmitAndWait,
  selectAndWaitForFilter,
  testIfFilterIsApplied,
} from './helpers/search';

test.describe.configure({ mode: 'parallel' });

test('(1) | The user can search for instances of a topic and filter their results by type and contributor', async ({
  page,
  context,
}) => {
  await search(context, page, 'stories');
  await searchQuerySubmitAndWait('milk', page);

  await selectAndWaitForFilter('Formats', 'W7TfJRAAAJ1D0eLK', page); // Articles
  await testIfFilterIsApplied('Article', page);
  await selectAndWaitForFilter('Contributors', 'WfLM2yoAAKKpVrxD', page);
  // Contributor (AW)
  await testIfFilterIsApplied('Alice White', page);
  await navigateToStoryResultAndConfirmTitleMatches(1, page);
});

test(`(2) | The user can see the correct contributor's name below the story title in search results`, async ({
  page,
  context,
}) => {
  await search(context, page, 'stories');
  // Article ID search
  await searchQuerySubmitAndWait('XLRmEBEAABp4vDEG', page);

  await locateAndConfirmContributorInfoMatchesStory('Litchfield', page);

  await expect(page.getByTestId('contributor-name')).toHaveText(
    'Words by Jack Litchfield'
  );
});

test(`(3) | The user can paginate through their search results`, async ({
  page,
  context,
}) => {
  await search(context, page, 'stories');
  await searchQuerySubmitAndWait('body', page);

  await navigateToNextPageAndConfirmNavigation(page);
  await navigateToNextPageAndConfirmNavigation(page);

  await expect(
    page.getByTestId('pagination').getByTestId('current-page')
  ).toHaveText('3');
});

test(`(4) | The user can sort their story search results by oldest and most recent`, async ({
  page,
  context,
}) => {
  await search(context, page, 'stories');
  await searchQuerySubmitAndWait('cats', page);

  const select = page.locator('select[name="sortOrder"]');

  await select.selectOption({ index: 2 });
  await expect(select).toHaveValue('publicationDate.desc');

  await select.selectOption({ index: 1 });
  await expect(select).toHaveValue('publicationDate.asc');
  // As this is the oldest result, it should always be the first
  // story returned unless we change our relevancy formula
  await expect(page.getByTestId('story-search-result').first()).toContainText(
    'Eels and feels'
  );
});

test(`(5) | Stories with an overridden date should display and reflect the chronology of that date`, async ({
  page,
  context,
}) => {
  await search(context, page, 'stories');
  await searchQuerySubmitAndWait(`ken's ten`, page);

  const select = page.locator('select[name="sortOrder"]');
  await select.selectOption({ index: 1 });
  await expect(select).toHaveValue('publicationDate.asc');

  const firstResult = page.getByTestId('story-search-result').first();

  await expect(firstResult.getByRole('heading')).toContainText(
    `Ken’s ten: looking back at ten years of Wellcome Collection`
  );

  const publicationDate = firstResult.locator('time');

  await expect(publicationDate).toContainText('8 August 2017');
});
