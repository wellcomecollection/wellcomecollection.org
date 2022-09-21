import { test as base, expect } from '@playwright/test';
import { concept } from './contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleCookies } from './helpers/utils';
import { imagesByThisPerson, worksByThisPerson } from './selectors/concepts';

const domain = new URL(baseUrl).host;

const test = base.extend({
  context: async ({ context }, use) => {
    const defaultToggleCookies = await makeDefaultToggleCookies(domain);

    // This adds the conceptsPages toggle so the e2e tests can see the concept pages,
    // but once they're out from behind a toggle we can remove this.
    await context.addCookies([
      {
        name: 'toggle_conceptsPages',
        value: 'true',
        domain,
        path: '/',
      },
      ...defaultToggleCookies.filter(c => c.name !== 'toggle_conceptsPages'),
    ]);

    await use(context);
  },
});

const conceptIds = {
  'Thackrah, Charles Turner, 1795-1833': 'd46ea7yk',
  'John, the Baptist, Saint': 'qd86ycny',
  'Stephens, Joanna': 'pg43g9hn',
  'Darwin, Charles, 1809-1882': 'v3m7uhy9',
};

test.describe('concepts', () => {
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
    await page.waitForSelector('h2 >> text="Works"');
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
      '/works?subjects.label=%22Stephens%2C+Joanna%22'
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
      '/works?contributors.agent.label=%22Stephens%2C+Joanna%22'
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
      '/images?source.subjects.label=%22Darwin%2C+Charles%2C+1809-1882%22'
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
      '/images?source.contributors.agent.label=%22Darwin%2C+Charles%2C+1809-1882%22'
    );
  });
});
