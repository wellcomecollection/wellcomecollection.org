import { test as base, expect } from '@playwright/test';

import { concept } from './helpers/contexts';
import { ConceptPage } from './pages/concept';

const test = base.extend<{
  armyPage: ConceptPage;
  mohPage: ConceptPage;
  statisticsPage: ConceptPage;
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

  statisticsPage: async ({ context, page }, use) => {
    // A Genre chosen because it has works and images both about and using the technique
    await concept('y2yes53w', context, page);
    const statisticsPage = new ConceptPage(page, 'type/technique');
    await use(statisticsPage);
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
    await expect(thackrahPage.worksFeaturingTab).toBeVisible();
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
    await expect(thackrahPage.worksFeaturingTabPanel).not.toBeVisible();
    // Until the "works about" tab is clicked
    await thackrahPage.worksFeaturingTab.click();
    // The works about panel is expected to contain a list of works about the concept (spookily enough)
    // This list is expected to be populated.
    await expect(
      thackrahPage.worksFeaturingTabPanel.getByRole('listitem')
    ).not.toHaveCount(0);
  });
});

test.describe('a Concept representing an Agent with Works and Images both about and by them', () => {
  test('has both works and image sections grouped into "by" and "about" sections', async ({
    armyPage,
  }) => {
    // It has two tabs (works)
    await expect(armyPage.worksAboutTab).toBeVisible();
    await expect(armyPage.worksByTab).toBeVisible();

    // It has an images section
    await expect(armyPage.imagesSection).toBeVisible();

    // The "works by" and "images by" panels should be visible initially
    await expect(armyPage.worksByTabPanel).toBeVisible();
    await expect(
      armyPage.worksByTabPanel.getByRole('listitem')
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

    // It has links to all images by
    await expect(armyPage.allImagesByLink).toHaveAttribute(
      'href',
      '/search/images?source.contributors.agent.label=%22Great+Britain.+Army%22'
    );
    // ...and images about
    await expect(armyPage.allImagesAboutLink).toHaveAttribute(
      'href',
      '/search/images?source.subjects.label=%22Great+Britain.+Army%22'
    );
  });
});

test.describe('a Concept representing a Genre with works and images both about and using them', () => {
  test('has both works and image sections, each with about and using tabs', async ({
    statisticsPage,
  }) => {
    // It has two tabs (works)
    await expect(statisticsPage.worksAboutTab).toBeVisible();
    await expect(statisticsPage.worksInTab).toBeVisible();

    // It has images
    await expect(statisticsPage.imagesSection).toBeVisible();

    // The "works in" panel should be visible initially
    await expect(statisticsPage.worksInTabPanel).toBeVisible();
    await expect(
      statisticsPage.worksInTabPanel.getByRole('listitem')
    ).not.toHaveCount(0);

    // It has links to filtered searches
    await statisticsPage.worksInTab.click();
    await expect(statisticsPage.allWorksLink).toHaveAttribute(
      'href',
      `/search/works?genres.label=${encodeURIComponent('"Songs"')}`
    );

    await statisticsPage.worksAboutTab.click();
    await expect(statisticsPage.allWorksLink).toHaveAttribute(
      'href',
      `/search/works?subjects.label=${encodeURIComponent('"Songs"')}`
    );

    await expect(statisticsPage.allImagesInLink).toHaveAttribute(
      'href',
      `/search/images?source.genres.label=${encodeURIComponent('"Songs"')}`
    );

    await expect(statisticsPage.allImagesAboutLink).toHaveAttribute(
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
    await expect(mohPage.imagesSection).toBeVisible();
    await expect(mohPage.worksSection).toBeVisible();

    // There are no tabs, because there is only one group
    await expect(mohPage.worksAboutTab).not.toBeVisible();
    await expect(mohPage.worksInTab).not.toBeVisible();

    // It has links to filtered searches, (not using encodeURIComponent because the genre includes '+'")
    await expect(mohPage.allWorksLink).toHaveAttribute(
      'href',
      `/search/works?genres.label=%22MOH+reports%22`
    );

    await expect(mohPage.allImagesInLink).toHaveAttribute(
      'href',
      `/search/images?source.genres.label=%22MOH+reports%22`
    );
  });
});
