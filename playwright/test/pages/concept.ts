import { Locator, Page } from '@playwright/test';

export class ConceptPage {
  readonly page: Page;
  readonly conceptTypeLabel: string;
  readonly imagesHeader: Locator;
  readonly worksHeader: Locator;
  readonly worksSection: Locator;
  readonly imagesSection: Locator;
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
  readonly worksAboutTabPanel: Locator;
  readonly worksByTabPanel: Locator;
  readonly worksInTabPanel: Locator;
  readonly imagesAboutTabPanel: Locator;
  readonly imagesByTabPanel: Locator;
  readonly imagesInTabPanel: Locator;

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
    this.worksSection = page.getByRole('region', { name: 'Catalogue' });
    this.imagesSection = page.getByRole('region', { name: 'Images' });

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
      this.imagesTabGroup,
      `Using this ${this.conceptTypeLabel}`
    );

    this.worksAboutTabPanel = this.tabPanel(
      this.worksSection,
      `About this ${this.conceptTypeLabel}`
    );
    this.worksByTabPanel = this.tabPanel(
      this.worksSection,
      `By this ${this.conceptTypeLabel}`
    );
    this.worksInTabPanel = this.tabPanel(
      this.worksSection,
      `Using this ${this.conceptTypeLabel}`
    );
    this.imagesAboutTabPanel = this.tabPanel(
      this.imagesSection,
      `About this ${this.conceptTypeLabel}`
    );
    this.imagesByTabPanel = this.tabPanel(
      this.imagesSection,
      `By this ${this.conceptTypeLabel}`
    );
    this.imagesInTabPanel = this.tabPanel(
      this.imagesSection,
      `Using this ${this.conceptTypeLabel}`
    );
  }

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

  tabPanel = (tabGroup: Locator, tabName: string) =>
    tabGroup.getByRole('tabpanel', {
      name: tabName,
      exact: false, // The text is expected to be followed by a count of the matching records
    });
}
