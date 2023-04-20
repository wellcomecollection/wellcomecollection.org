import { Page, test as base, expect } from '@playwright/test';
import { concept } from './contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleCookies } from './helpers/utils';
import { imagesByThisPerson, worksByThisPerson } from './selectors/concepts';

const domain = new URL(baseUrl).host;

const test = base.extend({
  context: async ({ context }, use) => {
    const defaultToggleAndTestCookies = await makeDefaultToggleCookies(domain);
    await context.addCookies([
      { name: 'WC_cookiesAccepted', value: 'true', domain: domain, path: '/' },
      ...defaultToggleAndTestCookies,
    ]);

    await use(context);
  },
});

const conceptIds = {
  // Chosen because there are no associated works if you don't quote
  // the search properly.
  'Thackrah, Charles Turner, 1795-1833': 'd46ea7yk',

  // Chosen because there are no associated images if you don't quote
  // the search properly.
  'John, the Baptist, Saint': 'qd86ycny',

  // Chosen because there are works both about and by this person
  'Stephens, Joanna': 'pg43g9hn',

  // Chosen because there are images both about and by this person
  'Darwin, Charles, 1809-1882': 'v3m7uhy9',

  // A Genre chosen because it has works and images both about and using the technique
  Songs: 'cfxnfvnc',
  // A Genre with both works and images using it.
  Lithographs: 'fmydsuw2',
};

test.describe('concepts @conceptPage', () => {
  test('concept pages get a list of related works', async ({
    page,
    context,
  }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the query we send to the works API.
    await concept(
      conceptIds['Thackrah, Charles Turner, 1795-1833'],
      context,
      page
    );
    await page.waitForSelector('h2 >> text="Catalogue"');
  });

  test('concept pages link to a filtered search for works about this subject/person', async ({
    page,
    context,
  }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the link to a filtered search.
    await concept(conceptIds['Stephens, Joanna'], context, page);

    // Note: the `link-reset` class is added by ButtonSolid, and is a way to
    // make sure we find the "All Works" link, and not a link to an individual work.
    const aboutThisPerson = await page.waitForSelector(
      'div#tabpanel-worksAbout a.link-reset'
    );

    const content = await aboutThisPerson.textContent();

    expect(content?.startsWith('All works')).toBe(true);
    expect(await aboutThisPerson.getAttribute('href')).toBe(
      '/search/works?subjects.label=%22Stephens%2C+Joanna%22'
    );
  });

  test('concept pages link to a filtered search for works by this subject/person', async ({
    page,
    context,
  }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the link to a filtered search.
    await concept(conceptIds['Stephens, Joanna'], context, page);

    await page.click(worksByThisPerson);

    // Note: the `link-reset` class is added by ButtonSolid, and is a way to
    // make sure we find the "All Works" link, and not a link to an individual work.
    const byThisPerson = await page.waitForSelector(
      'div#tabpanel-worksBy a.link-reset'
    );

    const content = await byThisPerson.textContent();

    expect(content?.startsWith('All works')).toBe(true);
    expect(await byThisPerson.getAttribute('href')).toBe(
      '/search/works?contributors.agent.label=%22Stephens%2C+Joanna%22'
    );
  });

  test('concept pages get a list of related images', async ({
    page,
    context,
  }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the query we send to the images API.
    await concept(conceptIds['John, the Baptist, Saint'], context, page);
    await page.waitForSelector('h2 >> text="Images"');
  });

  test('concept pages link to a filtered search for images about this subject/person', async ({
    page,
    context,
  }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the link to a filtered search.
    await concept(conceptIds['Darwin, Charles, 1809-1882'], context, page);

    // Note: the `link-reset` class is added by ButtonSolid, and is a way to
    // make sure we find the "All Works" link, and not a link to an individual work.
    const aboutThisPerson = await page.waitForSelector(
      'div#tabpanel-imagesAbout a.link-reset'
    );

    const content = await aboutThisPerson.textContent();

    expect(content?.startsWith('All images')).toBe(true);
    expect(await aboutThisPerson.getAttribute('href')).toBe(
      '/search/images?source.subjects.label=%22Darwin%2C+Charles%2C+1809-1882%22'
    );
  });

  test('concept pages link to a filtered search for images by this subject/person', async ({
    page,
    context,
  }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the link to a filtered search.
    await concept(conceptIds['Darwin, Charles, 1809-1882'], context, page);

    await page.click(imagesByThisPerson);

    // Note: the `link-reset` class is added by ButtonSolid, and is a way to
    // make sure we find the "All Works" link, and not a link to an individual work.
    const byThisPerson = await page.waitForSelector(
      'div#tabpanel-imagesBy a.link-reset'
    );

    const content = await byThisPerson.textContent();

    expect(content?.startsWith('All images')).toBe(true);
    expect(await byThisPerson.getAttribute('href')).toBe(
      '/search/images?source.contributors.agent.label=%22Darwin%2C+Charles%2C+1809-1882%22'
    );
  });
});

const allRecordsLink = async (
  page: Page,
  tabId: string | undefined,
  recordType: string
) => {
  // Note: the `link-reset` class is added by ButtonSolid, and is a way to
  // make sure we find the "All Works" link, and not a link to an individual work.
  const allRecords = await page.waitForSelector(
    `div#tabpanel-${tabId} a.link-reset`
  );
  const content = await allRecords.textContent();

  expect(content?.startsWith(`All ${recordType}`)).toBe(true);
  return allRecords;
};

// assert the tab specified is visible
const showsTab = async (page: Page, tabId: string, tabText: string) => {
  const tab = await page.waitForSelector(`button#tab-${tabId}`);
  const content = await tab.textContent();
  expect(content?.startsWith(tabText)).toBe(true);
};

test.describe(
  'genres with works and images both about and using @conceptPage @genres',
  () => {
    test.beforeEach(async ({ page, context }) => {
      await concept(conceptIds['Songs'], context, page);
    });

    test('two works sections are shown: about and using', async ({ page }) => {
      await showsTab(page, 'worksAbout', 'About this type/technique');
      await showsTab(page, 'worksIn', 'Using this type/technique');
      expect(''.toBe(''));
    });

    test('the "All works" link filters by all ids associated with the concept', async ({
      page,
    }) => {
      await page.click(`css=button#tab-worksIn`);

      const allWorks = await allRecordsLink(page, 'worksIn', 'works');
      expect(await allWorks.getAttribute('href')).toBe(
        `/search/works?genres.concepts=${encodeURIComponent(
          '"cfxnfvnc","sndumejv","vb3xq295"'
        )}`
      );
    });

    test('two images sections are shown: about and using', async ({ page }) => {
      await showsTab(page, 'imagesAbout', 'About this type/technique');
      await showsTab(page, 'imagesIn', 'Using this type/technique');
    });

    test('the "All images" link filters by all ids associated with the concept', async ({
      page,
    }) => {
      await page.click(`css=button#tab-imagesIn`);
      const allImages = await allRecordsLink(page, 'imagesIn', 'images');
      expect(await allImages.getAttribute('href')).toBe(
        `/search/images?source.genres.concepts=${encodeURIComponent(
          '"cfxnfvnc","sndumejv","vb3xq295"'
        )}`
      );
    });
  }
);

test.describe(
  'genres used by works and images, with nothing about them @conceptPage @genres',
  () => {
    test.beforeEach(async ({ page, context }) => {
      await concept(conceptIds['Lithographs'], context, page);
    });

    test('both the Works and images sections are shown', async ({ page }) => {
      await page.waitForSelector('h2 >> text="Catalogue"');
      await page.waitForSelector('h2 >> text="Images"');
    });

    test('the "All works" link filters by all ids associated with the concept', async ({
      page,
    }) => {
      const allWorks = await allRecordsLink(page, 'worksIn', 'works');
      expect(await allWorks.getAttribute('href')).toBe(
        `/search/works?genres.concepts=${encodeURIComponent(
          '"fmydsuw2","pzbaq8tx","yqxm24zx"'
        )}`
      );
    });

    test('the "All images" link filters by all ids associated with the concept', async ({
      page,
    }) => {
      const allImages = await allRecordsLink(page, 'imagesIn', 'images');
      expect(await allImages.getAttribute('href')).toBe(
        `/search/images?source.genres.concepts=${encodeURIComponent(
          '"fmydsuw2","pzbaq8tx","yqxm24zx"'
        )}`
      );
    });
  }
);
