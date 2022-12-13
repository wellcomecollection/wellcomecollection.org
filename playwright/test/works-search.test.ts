import { test, expect } from '@playwright/test';
import { isMobile, worksSearch } from './contexts';
import { URLSearchParams } from 'url';
import { Page } from 'playwright';
import safeWaitForNavigation from './helpers/safeWaitForNavigation';

export const worksSearchForm = '[aria-label="Search the catalogue"]';
export const searchFor = async (query: string, page: Page): Promise<void> => {
  console.info('searchFor', query);
  await page.fill(worksSearchForm, query);
  await Promise.all([
    page.press(worksSearchForm, 'Enter'),
    safeWaitForNavigation(page),
  ]);
};

const expectSearchParam = (
  expectedKey: string,
  expectedVal: string,
  page: Page
) => {
  console.info('expectSearchParam', { expectedKey, expectedVal });
  const params = new URLSearchParams(page.url());

  const foundMatchingParam = Array.from(params).find(
    ([key, val]) => key === expectedKey && val === expectedVal
  );

  if (!foundMatchingParam) {
    console.log(page.url());
  }

  expect(foundMatchingParam).toBeTruthy();
};

const openDropdown = async (label: string, page: Page) => {
  console.info('openDropdown', label);
  if (isMobile(page)) {
  } else {
    await page.click(`button :text("${label}")`);
  }
};

const selectCheckbox = async (label: string, page: Page) => {
  if (isMobile(page)) {
    // TODO: Make this a user centric selector
    // for some reason `"Filters"` isn't working.
    await page.click(`[aria-controls="mobile-filters-modal"]`);
  }

  await Promise.all([
    safeWaitForNavigation(page),
    page.click(`label :text("${label}")`),
  ]);

  if (isMobile(page)) {
    await page.click(`"Show results"`);
  }
};

const navigateToNextPage = async (page: Page) => {
  // Not a massive fan of this selector, as it isn't very user-centric,
  // but the selector `Next (page 2)` doesn't work as it's `visually-hidden`
  // we also use nth-of-type as the bottom navigation is the one ued on mobile
  // another hack
  await Promise.all([
    safeWaitForNavigation(page),
    page.click(`[id="pagination"]:nth-of-type(1) button`),
  ]);
};

const navigateToResult = async (n = 1, page: Page) => {
  const result = `[role="main"] ul li:nth-of-type(${n}) a`;
  const searchResultTitle = await page.textContent(`${result} h3`);

  await Promise.all([safeWaitForNavigation(page), page.click(result)]);

  const title = await page.textContent('h1');
  expect(title).toBe(searchResultTitle);
};

test.describe.configure({ mode: 'parallel' });

test.describe('Scenario 1: The person is looking for an archive', () => {
  test('the work should be browsable to from the search results', async ({
    page,
    context,
  }) => {
    await worksSearch(context, page);
    await searchFor('Persian', page);
    await openDropdown('Formats', page);
    await selectCheckbox('Archives and manuscripts', page);
    await navigateToNextPage(page);

    expectSearchParam('workType', 'h', page);

    await navigateToResult(3, page);
  });
});

test.describe(
  'Scenario 2: The person is searching for a work on open shelves',
  () => {
    test('the work should be browsable to from the search results', async ({
      page,
      context,
    }) => {
      await worksSearch(context, page);
      await searchFor('eyes', page);
      await openDropdown('Locations', page);
      await selectCheckbox('Open shelves', page);
      await navigateToNextPage(page);

      expectSearchParam('availabilities', 'open-shelves', page);

      await navigateToResult(6, page);
    });
  }
);

test.describe(
  'Scenario 3: The person is searching for a work that is available online',
  () => {
    test('the work should be browsable to from the search results', async ({
      page,
      context,
    }) => {
      await worksSearch(context, page);
      await searchFor('skin', page);
      await openDropdown('Locations', page);
      await selectCheckbox('Online', page);
      await navigateToNextPage(page);

      expectSearchParam('availabilities', 'online', page);

      await navigateToResult(8, page);
    });
  }
);

test.describe(
  'Scenario 4: The person is searching for a work from Wellcome Images',
  () => {
    test('the work should be browsable to from the search results', async ({
      page,
      context,
    }) => {
      await worksSearch(context, page);
      await searchFor('skeleton', page);
      await openDropdown('Formats', page);
      await selectCheckbox('Digital images', page);
      await navigateToNextPage(page);

      expectSearchParam('workType', 'q', page);

      await navigateToResult(1, page);
    });
  }
);

test.describe(
  'Scenario 5: The person is searching for a work in closed stores',
  () => {
    test('the work should be browsable to from the search results', async ({
      page,
      context,
    }) => {
      await worksSearch(context, page);
      await searchFor('brain', page);
      await openDropdown('Locations', page);
      await selectCheckbox('Closed stores', page);
      await navigateToNextPage(page);

      expectSearchParam('availabilities', 'closed-stores', page);

      await navigateToResult(6, page);
    });
  }
);

test.describe(
  'Scenario 6: The reader is searching for works from a particular year',
  () => {
    test('the work should be browsable to from the search results', async ({
      page,
      context,
    }) => {
      // TODO: For some reason `"Filters"` isn't working on mobile.  The original
      // purpose of this test was to check the logic behind the filters, not the UI.
      // See https://wellcome.slack.com/archives/C8X9YKM5X/p1663763975934799
      //
      // Ideally we'd also be able to test mobile in this test, but it's not critical.
      if (isMobile(page)) {
        return;
      }

      await worksSearch(context, page);
      await searchFor('brain', page);
      await openDropdown('Dates', page);

      // Note: if you put both `page.locator(…).fill(…)` commands in a
      // single Promise.all(), they can interfere in such a way that only
      // one of them ends up in the final URL. :-/

      await Promise.all([
        page.locator('input[name="production.dates.from"]').fill('1939'),
        safeWaitForNavigation(page),
      ]);

      await Promise.all([
        page.locator('input[name="production.dates.to"]').fill('2001'),
        safeWaitForNavigation(page),
      ]);

      expectSearchParam('production.dates.from', '1939', page);
      expectSearchParam('production.dates.to', '2001', page);

      // This is a check that we have actually loaded some results from
      // the API, and the API hasn't just errored out.
      await navigateToResult(6, page);
    });
  }
);
