import { worksSearch } from './contexts';
import { searchFor, worksSearchForm } from './works-search.test';

test('stays focussed on the query input when submitted', async () => {
  worksSearch();
  await searchFor('worms');
  // see: https://github.com/microsoft/playwright/issues/2159#issuecomment-625883641
  const isFocussed = await page.$eval(
    worksSearchForm,
    el => el === document.activeElement
  );

  expect(isFocussed).toBeTruthy();
});

test('search input does not have focus on initial load', async () => {
  await worksSearch();
  const isFocussed = await page.$eval(
    worksSearchForm,
    el => el === document.activeElement
  );

  expect(isFocussed).toBeFalsy();
});
