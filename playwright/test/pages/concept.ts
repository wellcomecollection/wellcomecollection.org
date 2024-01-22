import { Locator, Page } from '@playwright/test';

export class ConceptPage {
  readonly page: Page;
  readonly conceptTypeLabel: string;
  readonly imagesHeader: Locator;
  readonly worksHeader: Locator;
  readonly worksSection: Locator;
  readonly allWorksLink: Locator;
  readonly allImagesLink: Locator;
  readonly worksTabGroup: Locator;
  readonly imagesTabGroup: Locator;
  readonly worksAboutTab: Locator;
  readonly worksByTab: Locator;
  readonly worksInTab: Locator;
  readonly imagesAboutTab: Locator;
  readonly imagesByTab: Locator;
  readonly imagesInTab: Locator;

  constructor(page: Page, conceptTypeLabel: string) {
    this.page = page;
    this.conceptTypeLabel = conceptTypeLabel;
    this.worksHeader = page.getByRole('heading', {
      name: 'Catalogue',
      level: 2,
    });
    this.imagesHeader = page.getByRole('heading', {
      name: 'Images',
      level: 2,
    });
    this.worksSection = this.worksHeader;
    this.allWorksLink = this.allRecordsLink('works');
    this.allImagesLink = this.allRecordsLink('images');
    this.worksTabGroup = page.getByRole('tablist', {
      name: 'works',
    });
    this.imagesTabGroup = page.getByRole('tablist', {
      name: 'images',
    });
    this.worksAboutTab = this.tab(
      this.worksTabGroup,
      `About this ${this.conceptTypeLabel}`
    );
    this.worksByTab = this.tab(
      this.worksTabGroup,
      `By this ${this.conceptTypeLabel}`
    );
    this.worksInTab = this.tab(
      this.worksTabGroup,
      `Using this ${this.conceptTypeLabel}`
    );
    this.imagesAboutTab = this.tab(
      this.imagesTabGroup,
      `About this ${this.conceptTypeLabel}`
    );
    this.imagesByTab = this.tab(
      this.imagesTabGroup,
      `By this ${this.conceptTypeLabel}`
    );
    this.imagesInTab = this.tab(
      this.worksTabGroup,
      `Using this ${this.conceptTypeLabel}`
    );
  }

  // Return a locator to find the corresponding tab panel for a given tab.
  // The tab panel should be aria labelled by the tab, meaning that its accessible name
  // is the same as the label for the tab, allowing this use of getByRole.
  // The use of the full and exact label should mean that the correct panel is found (images vs works),
  // as it includes the count suffix.
  // However, this does mean that tabPanelFor is not a "pure" Locator that can be stored as
  // a property in the constructor.  The test author needs to know that the tab exists
  tabPanelFor = async (tab: Locator) => {
    const label = await tab.textContent();
    if (label) return this.page.getByRole('tabpanel', { name: label });
    fail();
  };

  recordListFor = async (tab: Locator) => {
    const panel = await this.tabPanelFor(tab);
    // Entries in the recordList may themselves contain lists.
    // return the first, which should be the top-level one.
    return panel.getByRole('list').first();
  };

  allRecordsLink = (recordType: string) => {
    const allRecords = this.page.getByRole('link', {
      name: new RegExp(`^All ${recordType} \\([0-9,\\.K]+\\)`),
      exact: false, // match substring, the actual link also includes the right-arrow.
    });
    return allRecords;
  };

  tab = (tabGroup: Locator, tabName: string) =>
    tabGroup.getByRole('tab', {
      name: tabName,
      exact: false, // The text is expected to be followed by a count of the matching records
    });
}
