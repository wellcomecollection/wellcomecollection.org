import { test as base, expect } from '@playwright/test';
import { concept } from './helpers/contexts';
import { ConceptPage } from './pages/concept';

const test = base.extend<{
  armyPage: ConceptPage;
  lithographsPage: ConceptPage;
  songsPage: ConceptPage;
  thackrahPage: ConceptPage;
}>({
  armyPage: async ({ context, page }, use) => {
    // Chosen because there are works both about and by this organisation
    await concept('ck4h8gj9', context, page);
    const armyPage = new ConceptPage(page, 'organisation');
    await use(armyPage);
  },

  lithographsPage: async ({ context, page }, use) => {
    // A Genre with both works and images using it, but nothing about it.
    await concept('fmydsuw2', context, page);
    const lithographsPage = new ConceptPage(page, 'type/technique');
    await use(lithographsPage);
  },

  songsPage: async ({ context, page }, use) => {
    // A Genre chosen because it has works and images both about and using the technique
    await concept('cfxnfvnc', context, page);
    const songsPage = new ConceptPage(page, 'type/technique');
    await use(songsPage);
  },

  thackrahPage: async ({ context, page }, use) => {
    // Chosen because there are works both about and by this person,
    // and his label is punctuated in such a way that would break the page if
    // it is not escaped properly in the API calls.
    await concept('d46ea7yk', context, page);
    const thackrahPage = new ConceptPage(page, 'person');
    await use(thackrahPage);
  },
});

test.describe('concept pages', () => {
  test.describe('a Concept representing an Agent with no Images', () => {
    test('only has works tabs', async ({ thackrahPage }) => {
      // It has two tabs for works
      await expect(thackrahPage.worksAboutTab).toBeVisible();
      await expect(thackrahPage.worksByTab).toBeVisible();

      // and has no images tabs
      await expect(thackrahPage.imagesTabGroup).not.toBeAttached();

      // The "works by" panel should be visible initially
      const worksByList = await thackrahPage.recordListFor(
        thackrahPage.worksByTab
      );
      await expect(worksByList).toBeVisible();
      await expect(worksByList.getByRole('listitem')).not.toHaveCount(0);

      // The "works about" panel is not expected to be seen ...
      const worksAboutList = await thackrahPage.recordListFor(
        thackrahPage.worksAboutTab
      );
      await expect(worksAboutList).not.toBeVisible();
      // Until the "works about" tab is clicked
      await thackrahPage.worksAboutTab.click();
      // The works about panel is expected to contain a list of works about the concept (spookily enough)
      // This list is expected to be populated.
      // Live data is used in this test, so the actual number is not guaranteed
      // to remain stable. Hence asserting that it is not zero.
      await expect(worksAboutList.getByRole('listitem')).not.toHaveCount(0);
    });
  });

  test.describe('a Concept representing an Agent with Works and Images both about and by them', () => {
    test('has both works and image sections, each with about and by tabs', async ({
      armyPage,
    }) => {
      // It has four tabs (two works, two images)
      await expect(armyPage.worksAboutTab).toBeVisible();
      await expect(armyPage.worksByTab).toBeVisible();
      await expect(armyPage.imagesAboutTab).toBeVisible();
      await expect(armyPage.imagesByTab).toBeVisible();

      // The "works by" and "images by" panels should be visible initially
      const worksByList = await armyPage.recordListFor(armyPage.worksByTab);
      await expect(worksByList).toBeVisible();
      await expect(worksByList.getByRole('listitem')).not.toHaveCount(0);
      const imagesByList = await armyPage.recordListFor(armyPage.imagesByTab);
      await expect(imagesByList).toBeVisible();
      await expect(imagesByList.getByRole('listitem')).not.toHaveCount(0);

      // It has links to filtered searches
      await armyPage.worksAboutTab.click();
      expect(await armyPage.allWorksLink.getAttribute('href')).toBe(
        '/search/works?subjects.label=%22Great+Britain.+Army%22'
      );

      await armyPage.worksByTab.click();
      expect(await armyPage.allWorksLink.getAttribute('href')).toBe(
        '/search/works?contributors.agent.label=%22Great+Britain.+Army%22'
      );

      await armyPage.imagesByTab.click();
      expect(await armyPage.allImagesLink.getAttribute('href')).toBe(
        '/search/images?source.contributors.agent.label=%22Great+Britain.+Army%22'
      );

      await armyPage.imagesAboutTab.click();
      expect(await armyPage.allImagesLink.getAttribute('href')).toBe(
        '/search/images?source.subjects.label=%22Great+Britain.+Army%22'
      );
    });
  });

  test.describe('a Concept representing a Genre with works and images both about and using them', () => {
    test('has both works and image sections, each with about and using tabs', async ({
      songsPage,
    }) => {
      // It has four tabs (two works, two images)
      await expect(songsPage.worksAboutTab).toBeVisible();
      await expect(songsPage.worksInTab).toBeVisible();
      await expect(songsPage.imagesAboutTab).toBeVisible();
      await expect(songsPage.imagesInTab).toBeVisible();
      // The "works using" and "images using" panels should be visible initially
      const worksInList = await songsPage.recordListFor(songsPage.worksInTab);
      await expect(worksInList).toBeVisible();
      await expect(worksInList.getByRole('listitem')).not.toHaveCount(0);
      const imagesInList = await songsPage.recordListFor(songsPage.imagesInTab);
      await expect(imagesInList).toBeVisible();
      await expect(imagesInList.getByRole('listitem')).not.toHaveCount(0);

      // It has links to filtered searches
      await songsPage.worksInTab.click();
      expect(await songsPage.allWorksLink.getAttribute('href')).toBe(
        `/search/works?genres.label=${encodeURIComponent('"Songs"')}`
      );

      await songsPage.worksAboutTab.click();
      expect(await songsPage.allWorksLink.getAttribute('href')).toBe(
        `/search/works?subjects.label=${encodeURIComponent('"Songs"')}`
      );

      await songsPage.imagesInTab.click();
      expect(await songsPage.allImagesLink.getAttribute('href')).toBe(
        `/search/images?source.genres.label=${encodeURIComponent('"Songs"')}`
      );

      await songsPage.imagesAboutTab.click();
      expect(await songsPage.allImagesLink.getAttribute('href')).toBe(
        `/search/images?source.subjects.label=${encodeURIComponent('"Songs"')}`
      );
    });
  });

  test.describe('a Concept representing a Genre that is only used as a genre for both works and images', () => {
    test('has both works and image sections showing records in that genre', async ({
      lithographsPage,
    }) => {
      // Both images and works sections exist
      await expect(lithographsPage.imagesHeader).toBeVisible();
      await expect(lithographsPage.worksHeader).toBeVisible();
      // There are no tabs, because there is only one group within each of the two sections
      await expect(lithographsPage.worksAboutTab).not.toBeVisible();
      await expect(lithographsPage.worksInTab).not.toBeVisible();
      await expect(lithographsPage.imagesAboutTab).not.toBeVisible();
      await expect(lithographsPage.imagesInTab).not.toBeVisible();

      // It has links to filtered searches
      expect(await lithographsPage.allWorksLink.getAttribute('href')).toBe(
        `/search/works?genres.label=${encodeURIComponent('"Lithographs"')}`
      );

      expect(await lithographsPage.allImagesLink.getAttribute('href')).toBe(
        `/search/images?source.genres.label=${encodeURIComponent(
          '"Lithographs"'
        )}`
      );
    });
  });
});
