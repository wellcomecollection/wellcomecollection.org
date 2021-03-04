import { isMobile, worksSearch } from './contexts';
import { URLSearchParams } from 'url';

// Not sure why this isn't working here, it's now in the contexts
// beforeEach(async () => {
//   context.addCookies([
//     {
//       name: 'WC_cookiesAccepted',
//       value: 'true',
//       path: '/',
//       domain: new URL(baseUrl).host,
//     },
//   ]);
// });

async function searchFor(query: string) {
  console.info('searchFor', query);
  const searchInput = '[aria-label="Search the catalogue"]';
  await page.fill(searchInput, query);
  await page.press(searchInput, 'Enter');
}

function expectSearchParam(expectedKey: string, expectedVal: string) {
  console.info('expectSearchParam', { expectedKey, expectedVal });
  const params = new URLSearchParams(page.url());
  expect(
    Array.from(params).find(
      ([key, val]) => key === expectedKey && val === expectedVal
    )
  ).toBeTruthy();
}

async function openDropdown(label: string) {
  console.info('openDropdown', label);
  if (isMobile) {
  } else {
    await page.click(`button :text("${label}")`);
  }
}

async function selectCheckbox(label: string) {
  if (isMobile) {
    // TODO: Make this a user centric selector
    // for some reason `"Filters"` isn't working.
    await page.click(`[aria-controls="mobile-filters-modal"]`);
  }

  await page.click(`label :text("${label}")`);

  if (isMobile) {
    await page.click(`"Show results"`);
  }
  await page.waitForNavigation();
}

async function navigateToNextPage() {
  // Not a massive fan of this selector, as it isn't very user-centric,
  // but the selector `Next (page 2)` doesn't work as it's `visually-hidden`
  // we also use nth-of-type as the bottom navigation is the one ued on mobile
  // another hack
  await page.click('[aria-label="Pagination navigation"]:nth-of-type(1) a');
  await page.waitForNavigation();
}

async function navigateToResult(n = 1) {
  const result = `[role="main"] ul li:nth-of-type(${n}) a`;
  const searchResultTitle = await page.textContent(`${result} h2`);

  await page.click(result);
  await page.waitForNavigation();

  const title = await page.textContent('h1');
  expect(title).toBe(searchResultTitle);
}

describe('Scenario 1: The person is looking for an archive', () => {
  test('the work should be browsable to from the search results', async () => {
    await worksSearch();
    await searchFor('Persian');
    await openDropdown('Formats');
    await selectCheckbox('Archives and manuscripts');
    await navigateToNextPage();

    expectSearchParam('workType', 'h');

    await navigateToResult(3);
  });
});

describe('Scenario 2: The person is searching for a work in the physical library', () => {
  test('the work should be browsable to from the search results', async () => {
    await worksSearch();
    await searchFor('Miasma');
    await selectCheckbox('In the library');
    await navigateToNextPage();

    expectSearchParam('availabilities', 'in-library');

    await navigateToResult(6);
  });
});

describe('Scenario 3: The person is searching for a work that is available online', () => {
  test('the work should be browsable to from the search results', async () => {
    await worksSearch();
    await searchFor('skin');
    await selectCheckbox('Online');
    await navigateToNextPage();

    expectSearchParam('availabilities', 'online');

    await navigateToResult(8);
  });
});

describe('Scenario 4: The person is searching for a work from Wellcome Images', () => {
  test('the work should be browsable to from the search results', async () => {
    await worksSearch();
    await searchFor('skeleton');
    await openDropdown('Formats');
    await selectCheckbox('Digital images');
    await navigateToNextPage();

    expectSearchParam('workType', 'q');

    await navigateToResult(1);
  });
});
