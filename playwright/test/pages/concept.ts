import { Locator, Page } from '@playwright/test';

export class ConceptPage {
  readonly page: Page;
  readonly conceptTypeLabel: string;
  readonly imagesHeader: Locator;
  readonly worksHeader: Locator;
  readonly worksSection: Locator;
  readonly imagesSection: Locator;
  readonly allWorksLink: Locator;
  readonly allImagesByLink: Locator;
  readonly allImagesAboutLink: Locator;
  readonly allImagesInLink: Locator;
  readonly worksTabGroup: Locator;
  readonly imagesTabGroup: Locator;
  readonly worksAboutTab: Locator;
  readonly worksByTab: Locator;
  readonly worksInTab: Locator;
  readonly worksAboutTabPanel: Locator;
  readonly worksByTabPanel: Locator;
  readonly worksFeaturingTab: Locator;
  readonly worksFeaturingTabPanel: Locator;
  readonly worksInTabPanel: Locator;

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
    this.worksSection = page.getByTestId('works-section');
    this.imagesSection = page.getByTestId('images-section');

    this.allWorksLink = this.allRecordsLink();
    this.allImagesByLink = this.allRecordsByAboutInLink('images', 'by');
    this.allImagesAboutLink = this.allRecordsByAboutInLink('images', 'about');
    this.allImagesInLink = this.allRecordsByAboutInLink('images', 'in');
    this.worksTabGroup = page.getByRole('tablist', {
      name: 'works',
    });
    this.imagesTabGroup = page.getByRole('tablist', {
      name: 'images',
    });
    // Define labels based on concept type to match makeConceptConfig
    const labels = this.getLabelsForConceptType(this.conceptTypeLabel);

    this.worksAboutTab = this.tab(this.worksTabGroup, labels.worksAbout);
    this.worksByTab = this.tab(this.worksTabGroup, labels.worksBy);
    this.worksInTab = this.tab(this.worksTabGroup, labels.worksIn);
    this.worksFeaturingTab = this.tab(this.worksTabGroup, labels.worksAbout);
    this.worksAboutTabPanel = this.tabPanel(
      this.worksSection,
      labels.worksAbout
    );
    this.worksFeaturingTabPanel = this.tabPanel(
      this.worksSection,
      labels.worksAbout
    );
    this.worksByTabPanel = this.tabPanel(this.worksSection, labels.worksBy);
    this.worksInTabPanel = this.tabPanel(this.worksSection, labels.worksIn);
  }

  allRecordsLink = () => {
    const allRecords = this.page.getByRole('link', {
      name: /^View all works.*/,
      exact: false, // match substring, the actual link also includes the right-arrow.
    });
    return allRecords;
  };

  allRecordsByAboutInLink = (
    recordType: string,
    qualifier: 'by' | 'about' | 'in'
  ) => {
    const possibleWordsForQualifier = () => {
      switch (qualifier) {
        case 'by':
          return '(by|produced by)';
        case 'about':
          return '(featuring|referencing|about)';
        case 'in':
          return '(of)';
        default:
          throw new Error(`Unknown qualifier: ${qualifier}`);
      }
    };
    const allRecords = this.page.getByRole('link', {
      name: new RegExp(
        `^View all ${recordType} ${possibleWordsForQualifier()}.*`,
        'i'
      ),
      exact: false,
      // match substring, the actual link also includes the right-arrow.
    });
    return allRecords;
  };

  tab = (tabGroup: Locator, tabName?: string) =>
    tabGroup.getByRole('tab', {
      name: tabName,
      exact: false, // The text is expected to be followed by a count of the matching records
    });

  tabPanel = (section: Locator, tabName?: string) =>
    section.getByRole('tabpanel', {
      name: tabName,
      exact: false, // The text is expected to be followed by a count of the matching records
    });

  getLabelsForConceptType(conceptTypeLabel: string) {
    switch (conceptTypeLabel) {
      case 'person':
        return {
          worksBy: 'Works by this person',
          worksAbout: 'Works featuring this person',
        };
      case 'organisation':
        return {
          worksBy: 'Works by this organisation',
          worksAbout: 'Works referencing this organisation',
        };
      case 'type/technique':
        return {
          worksBy: 'Works by this type/technique',
          worksAbout: 'Works about this type/technique',
          worksIn: 'Works using this type/technique',
        };
      default:
        return {
          worksBy: `Works by this ${conceptTypeLabel}`,
          worksAbout: `Works about this ${conceptTypeLabel}`,
          worksIn: `Works using this ${conceptTypeLabel}`,
        };
    }
  }
}
