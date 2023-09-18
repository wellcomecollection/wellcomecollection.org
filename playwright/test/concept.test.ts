import { test as base, expect } from '@playwright/test';
import { concept } from './contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleCookies } from './helpers/utils';
import {
  imagesAboutThisPerson,
  worksAboutThisPerson,
} from './selectors/concepts';
import { ConceptPage } from './pages/concept';
const domain = new URL(baseUrl).host;

const test = base.extend<{
  songsPage: ConceptPage;
  lithographsPage: ConceptPage;
}>({
  context: async ({ context }, use) => {
    const defaultToggleAndTestCookies = await makeDefaultToggleCookies(domain);
    await context.addCookies([
      { name: 'WC_cookiesAccepted', value: 'true', domain, path: '/' },
      ...defaultToggleAndTestCookies,
    ]);

    await use(context);
  },

  songsPage: async ({ context, page }, use) => {
    // A Genre chosen because it has works and images both about and using the technique
    await concept('cfxnfvnc', context, page);
    const songsPage = new ConceptPage(page, 'type/technique');
    await use(songsPage);
  },

  lithographsPage: async ({ context, page }, use) => {
    // A Genre with both works and images using it, but nothing about it.
    await concept('fmydsuw2', context, page);
    const songsPage = new ConceptPage(page, 'type/technique');
    await use(songsPage);
  },
});

const conceptIds = {
  // Chosen because there are no associated works if you don't quote
  // the search properly.
  'Thackrah, Charles Turner, 1795-1833': 'd46ea7yk',

  // Chosen because there are works both about and by this organisation
  'Great Britain. Army': 'ck4h8gj9',

  // Chosen because there are images both about and by this organisation
  'Physiological Society (Great Britain)': 'gdhn3r7q',
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
    await concept(conceptIds['Great Britain. Army'], context, page);
    await page.click(worksAboutThisPerson);

    // Note: the `link-reset` class is added by ButtonSolid, and is a way to
    // make sure we find the "All Works" link, and not a link to an individual work.
    const aboutThisPerson = await page.waitForSelector(
      'div#tabpanel-worksAbout a.link-reset'
    );

    const content = await aboutThisPerson.textContent();

    expect(content?.startsWith('All works')).toBe(true);
    expect(await aboutThisPerson.getAttribute('href')).toBe(
      '/search/works?subjects.label=%22Great+Britain.+Army%22'
    );
  });

  test('concept pages link to a filtered search for works by this subject/person', async ({
    page,
    context,
  }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the link to a filtered search.
    await concept(conceptIds['Great Britain. Army'], context, page);

    // Note: the `link-reset` class is added by ButtonSolid, and is a way to
    // make sure we find the "All Works" link, and not a link to an individual work.
    const byThisPerson = await page.waitForSelector(
      'div#tabpanel-worksBy a.link-reset'
    );

    const content = await byThisPerson.textContent();

    expect(content?.startsWith('All works')).toBe(true);
    expect(await byThisPerson.getAttribute('href')).toBe(
      '/search/works?contributors.agent.label=%22Great+Britain.+Army%22'
    );
  });

  test('concept pages get a list of related images', async ({
    page,
    context,
  }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the query we send to the images API.
    await concept(conceptIds['Great Britain. Army'], context, page);
    await page.waitForSelector('h2 >> text="Images"');
  });

  test('concept pages link to a filtered search for images about this subject/person', async ({
    page,
    context,
  }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the link to a filtered search.
    await concept(
      conceptIds['Physiological Society (Great Britain)'],
      context,
      page
    );

    await page.click(imagesAboutThisPerson);
    // Note: the `link-reset` class is added by ButtonSolid, and is a way to
    // make sure we find the "All Works" link, and not a link to an individual work.
    const aboutThisPerson = await page.waitForSelector(
      'div#tabpanel-imagesAbout a.link-reset'
    );

    const content = await aboutThisPerson.textContent();

    expect(content?.startsWith('All images')).toBe(true);
    expect(await aboutThisPerson.getAttribute('href')).toBe(
      '/search/images?source.subjects.label=%22Physiological+Society+%28Great+Britain%29%22'
    );
  });

  test('concept pages link to a filtered search for images by this subject/person', async ({
    page,
    context,
  }) => {
    // I've deliberately picked a complicated ID with commas here, to make sure
    // we're quoting the link to a filtered search.
    await concept(
      conceptIds['Physiological Society (Great Britain)'],
      context,
      page
    );

    // Note: the `link-reset` class is added by ButtonSolid, and is a way to
    // make sure we find the "All Works" link, and not a link to an individual work.
    const byThisPerson = await page.waitForSelector(
      'div#tabpanel-imagesBy a.link-reset'
    );

    const content = await byThisPerson.textContent();

    expect(content?.startsWith('All images')).toBe(true);
    expect(await byThisPerson.getAttribute('href')).toBe(
      '/search/images?source.contributors.agent.label=%22Physiological+Society+%28Great+Britain%29%22'
    );
  });
});

test.describe('genres with works and images both about and using @conceptPage @genres', () => {
  test('two works sections are shown: about and using', async ({
    songsPage,
  }) => {
    await expect(songsPage.worksAboutTab).toBeVisible();
    await expect(songsPage.worksInTab).toBeVisible();
  });

  test('the "All works" link filters by the concept label', async ({
    songsPage,
  }) => {
    expect(await songsPage.allWorksLink.getAttribute('href')).toBe(
      `/search/works?genres.label=${encodeURIComponent('"Songs"')}`
    );
  });

  test('two images sections are shown: about and using', async ({
    songsPage,
  }) => {
    await expect(songsPage.imagesAboutTab).toBeVisible();
    await expect(songsPage.imagesInTab).toBeVisible();
  });

  test('the "All images" link filters by the concept label', async ({
    songsPage,
  }) => {
    expect(await songsPage.allImagesLink.getAttribute('href')).toBe(
      `/search/images?source.genres.label=${encodeURIComponent('"Songs"')}`
    );
  });
});

test.describe('genres used by works and images, with nothing about them @conceptPage @genres', () => {
  test('both the Works and images sections are shown', async ({
    lithographsPage,
  }) => {
    await expect(lithographsPage.imagesHeader).toBeVisible();
    await expect(lithographsPage.worksHeader).toBeVisible();
  });

  test('the "All works" link filters by the concept label', async ({
    lithographsPage,
  }) => {
    const allWorks = lithographsPage.allWorksLink;
    expect(await allWorks.getAttribute('href')).toBe(
      `/search/works?genres.label=${encodeURIComponent('"Lithographs"')}`
    );
  });

  test('the "All images" link filters by the concept label', async ({
    lithographsPage,
  }) => {
    expect(await lithographsPage.allImagesLink.getAttribute('href')).toBe(
      `/search/images?source.genres.label=${encodeURIComponent(
        '"Lithographs"'
      )}`
    );
  });
});
