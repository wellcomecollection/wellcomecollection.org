import { test, expect } from '@playwright/test';
import { newSearch } from './helpers/contexts';
import {
  locateAndConfirmContributorInfoMatchesStory,
  navigateToNextPageAndConfirmNavigation,
  navigateToStoryResultAndConfirmTitleMatches,
  searchQuerySubmitAndWait,
  selectAndWaitForFilter,
  testIfFilterIsApplied,
} from './helpers/search';

test.describe.configure({ mode: 'parallel' });

// Test that filters work (mobile and desktop)
test('(1) | The user can search for instances of a topic and format their results by type and contributor', async ({
  page,
  context,
}) => {
  await newSearch(context, page, 'stories');
  await searchQuerySubmitAndWait('milk', page);
  await selectAndWaitForFilter('Formats', 'W7TfJRAAAJ1D0eLK', page); // Articles
  await testIfFilterIsApplied('Article', page);
  await selectAndWaitForFilter('Contributors', 'WfLM2yoAAKKpVrxD', page);
  // Contributor (AW)
  await testIfFilterIsApplied('Alice White', page);
  await navigateToStoryResultAndConfirmTitleMatches(1, page);
});

// Test that contributors are displayed
test(`(2) | The user can see the correct contributor's name below the story title in search results`, async ({
  page,
  context,
}) => {
  await newSearch(context, page, 'stories');
  await searchQuerySubmitAndWait('medieval doodles', page);
  // In case of similarly titled article
  await selectAndWaitForFilter('Contributors', 'XIp1ExAAAPyQB4NN', page);
  // Contributor (JL)
  await locateAndConfirmContributorInfoMatchesStory('Litchfield', page);
  await expect(page.getByTestId('contributor-name')).toHaveText(
    'Words by Jack Litchfield'
  );
});

// Test pagination
test(`(3) | The user can paginate through their search results`, async ({
  page,
  context,
}) => {
  await newSearch(context, page, 'stories');
  await searchQuerySubmitAndWait('body', page);
  await navigateToNextPageAndConfirmNavigation(page);
  await navigateToNextPageAndConfirmNavigation(page);
  await expect(
    page.getByTestId('pagination').getByTestId('current-page')
  ).toHaveText('3');
});

// Test sorting by date works and makes sense
