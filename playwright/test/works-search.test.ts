import { test, expect } from '@playwright/test';
import { isMobile, worksSearch } from './contexts';
import { URLSearchParams } from 'url';
import { Page } from 'playwright';

export const worksSearchForm = '[aria-label="Search the catalogue"]';
export const searchFor = (query: string) => async (page: Page) => {
  console.info('searchFor', query);
  await page.fill(worksSearchForm, query);
  await page.press(worksSearchForm, 'Enter');
};

const expectSearchParam =
  (expectedKey: string, expectedVal: string) => (page: Page) => {
    console.info('expectSearchParam', { expectedKey, expectedVal });
    const params = new URLSearchParams(page.url());
    expect(
      Array.from(params).find(
        ([key, val]) => key === expectedKey && val === expectedVal
      )
    ).toBeTruthy();
  };

const openDropdown = (label: string) => async (page: Page) => {
  console.info('openDropdown', label);
  if (isMobile(page)) {
  } else {
    await page.click(`button :text("${label}")`);
  }
};

const selectCheckbox = (label: string) => async (page: Page) => {
  if (isMobile(page)) {
    // TODO: Make this a user centric selector
    // for some reason `"Filters"` isn't working.
    await page.click(`[aria-controls="mobile-filters-modal"]`);
  }

  await page.click(`label :text("${label}")`);

  if (isMobile(page)) {
    await page.click(`"Show results"`);
  }
  await page.waitForNavigation();
};

const navigateToNextPage = async (page: Page) => {
  // Not a massive fan of this selector, as it isn't very user-centric,
  // but the selector `Next (page 2)` doesn't work as it's `visually-hidden`
  // we also use nth-of-type as the bottom navigation is the one ued on mobile
  // another hack
  await page.click('[aria-label="Pagination navigation"]:nth-of-type(1) a');
  await page.waitForNavigation();
};

const navigateToResult =
  (n = 1) =>
  async (page: Page) => {
    const result = `[role="main"] ul li:nth-of-type(${n}) a`;
    const searchResultTitle = await page.textContent(`${result} h2`);

    await page.click(result);
    await page.waitForNavigation();

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
    await searchFor('Persian')(page);
    await openDropdown('Formats')(page);
    await selectCheckbox('Archives and manuscripts')(page);
    await navigateToNextPage(page);

    expectSearchParam('workType', 'h')(page);

    await navigateToResult(3)(page);
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
      await searchFor('eyes')(page);
      await openDropdown('Locations')(page);
      await selectCheckbox('Open shelves')(page);
      await navigateToNextPage(page);

      expectSearchParam('availabilities', 'open-shelves')(page);

      await navigateToResult(6)(page);
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
      await searchFor('skin')(page);
      await openDropdown('Locations')(page);
      await selectCheckbox('Online')(page);
      await navigateToNextPage(page);

      expectSearchParam('availabilities', 'online')(page);

      await navigateToResult(8)(page);
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
      await searchFor('skeleton')(page);
      await openDropdown('Formats')(page);
      await selectCheckbox('Digital images')(page);
      await navigateToNextPage(page);

      expectSearchParam('workType', 'q')(page);

      await navigateToResult(1)(page);
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
      await searchFor('brain')(page);
      await openDropdown('Locations')(page);
      await selectCheckbox('Closed stores')(page);
      await navigateToNextPage(page);

      expectSearchParam('availabilities', 'closed-stores')(page);

      await navigateToResult(6)(page);
    });
  }
);
