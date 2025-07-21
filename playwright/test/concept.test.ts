import { test as base, expect } from '@playwright/test';

import { concept } from './helpers/contexts';
import { ConceptPage } from './pages/concept';

const test = base.extend<{
  armyPage: ConceptPage;
  mohPage: ConceptPage;
  songsPage: ConceptPage;
  thackrahPage: ConceptPage;
}>({
  armyPage: async ({ context, page }, use) => {
    // Chosen because there are works both about and by this organisation
    await concept('ck4h8gj9', context, page);
    const armyPage = new ConceptPage(page, 'organisation');
    await use(armyPage);
  },

  mohPage: async ({ context, page }, use) => {
    // A Genre with both works and images using it, but nothing about it.
    await concept('rasp7aye', context, page);
    const mohPage = new ConceptPage(page, 'type/technique');
    await use(mohPage);
  },

  songsPage: async ({ context, page }, use) => {
    // A Genre chosen because it has works and images both about and using the technique
    await concept('vb3xq295', context, page);
    const songsPage = new ConceptPage(page, 'type/technique');
    await use(songsPage);
  },

  thackrahPage: async ({ context, page }, use) => {
    // Chosen because there are works both about and by this person,
    // and his label is punctuated in such a way that would break the page if
    // it is not escaped properly in the API calls.
    await concept('qad4wpqg', context, page);
    const thackrahPage = new ConceptPage(page, 'person');
    await use(thackrahPage);
  },
});

test.describe('navigating to/from a work page from a concept page', () => {
  test('the concept -> work -> concept journey with the browser back button', async ({
    armyPage,
  }) => {
    // Click on the first work in the "works by" section
    await armyPage.worksByTabPanel.getByRole('listitem').first().click();

    // The work page should be visible
    await expect(armyPage.page).toHaveURL(/\/works\//);

    // Click the browser back button
    await armyPage.page.goBack();

    // The concept page should be visible again
    await expect(armyPage.page).toHaveURL(/\/concepts\//);

    // Check something we know should exist on the concept page is visible
    // (we have had instances of the URL being correct but displaying the wrong content)
    await expect(armyPage.worksAboutTab).toBeVisible();
  });
});

test.describe('a Concept representing an Agent with no Images', () => {
  test('only has works tabs', async ({ thackrahPage }) => {
    // It has two tabs for works
    await expect(thackrahPage.worksAboutTab).toBeVisible();
    await expect(thackrahPage.worksByTab).toBeVisible();

    // and has no images tabs
    await expect(thackrahPage.imagesTabGroup).not.toBeAttached();

    // The "works by" panel should be visible initially
    await expect(thackrahPage.worksByTabPanel).toBeVisible();
    // Live data is used in this test, so the actual number is not guaranteed
    // to remain stable. Hence asserting that it is not zero.
    await expect(
      thackrahPage.worksByTabPanel.getByRole('listitem')
    ).not.toHaveCount(0);

    // The "works about" panel is not expected to be seen ...
    await expect(thackrahPage.worksAboutTabPanel).not.toBeVisible();
    // Until the "works about" tab is clicked
    await thackrahPage.worksAboutTab.click();
    // The works about panel is expected to contain a list of works about the concept (spookily enough)
    // This list is expected to be populated.
    await expect(
      thackrahPage.worksAboutTabPanel.getByRole('listitem')
    ).not.toHaveCount(0);
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
    await expect(armyPage.worksByTabPanel).toBeVisible();
    await expect(
      armyPage.worksByTabPanel.getByRole('listitem')
    ).not.toHaveCount(0);

    await expect(armyPage.imagesByTabPanel).toBeVisible();
    await expect(
      armyPage.imagesByTabPanel.getByRole('listitem')
    ).not.toHaveCount(0);

    // It has links to filtered searches
    await armyPage.worksAboutTab.click();
    await expect(armyPage.allWorksLink).toHaveAttribute(
      'href',
      '/search/works?subjects.label=%22Great+Britain.+Army%22'
    );

    await armyPage.worksByTab.click();
    await expect(armyPage.allWorksLink).toHaveAttribute(
      'href',
      '/search/works?contributors.agent.label=%22Great+Britain.+Army%22'
    );

    await armyPage.imagesByTab.click();
    await expect(armyPage.allImagesLink).toHaveAttribute(
      'href',
      '/search/images?source.contributors.agent.label=%22Great+Britain.+Army%22'
    );

    await armyPage.imagesAboutTab.click();
    await expect(armyPage.allImagesLink).toHaveAttribute(
      'href',
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
    await expect(songsPage.worksInTabPanel).toBeVisible();
    await expect(
      songsPage.worksInTabPanel.getByRole('listitem')
    ).not.toHaveCount(0);
    await expect(songsPage.imagesInTabPanel).toBeVisible();
    await expect(
      songsPage.imagesInTabPanel.getByRole('listitem')
    ).not.toHaveCount(0);

    // It has links to filtered searches
    await songsPage.worksInTab.click();
    await expect(songsPage.allWorksLink).toHaveAttribute(
      'href',
      `/search/works?genres.label=${encodeURIComponent('"Songs"')}`
    );

    await songsPage.worksAboutTab.click();
    await expect(songsPage.allWorksLink).toHaveAttribute(
      'href',
      `/search/works?subjects.label=${encodeURIComponent('"Songs"')}`
    );

    await songsPage.imagesInTab.click();
    await expect(songsPage.allImagesLink).toHaveAttribute(
      'href',
      `/search/images?source.genres.label=${encodeURIComponent('"Songs"')}`
    );

    await songsPage.imagesAboutTab.click();
    await expect(songsPage.allImagesLink).toHaveAttribute(
      'href',
      `/search/images?source.subjects.label=${encodeURIComponent('"Songs"')}`
    );
  });
});

test.describe('a Concept representing a Genre that is only used as a genre for both works and images', () => {
  test('has both works and image sections showing records in that genre', async ({
    mohPage,
  }) => {
    // Both images and works sections exist
    await expect(mohPage.imagesHeader).toBeVisible();
    await expect(mohPage.worksHeader).toBeVisible();

    // There are no tabs, because there is only one group within each of the two sections
    await expect(mohPage.worksAboutTab).not.toBeVisible();
    await expect(mohPage.worksInTab).not.toBeVisible();
    await expect(mohPage.imagesAboutTab).not.toBeVisible();
    await expect(mohPage.imagesInTab).not.toBeVisible();

    // It has links to filtered searches, (not using encodeURIComponent because the genre includes '+'")
    await expect(mohPage.allWorksLink).toHaveAttribute(
      'href',
      `/search/works?genres.label=%22MOH+reports%22`
    );

    await expect(mohPage.allImagesLink).toHaveAttribute(
      'href',
      `/search/images?source.genres.label=%22MOH+reports%22`
    );
  });
});
