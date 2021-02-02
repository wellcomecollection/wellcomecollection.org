import {
  fillActionSearchInput,
  pressActionEnterSearchInput,
  clickActionFormatDropDown,
  clickActionFormatRadioCheckbox,
  clickActionCloseModalFilterButton,
  clickActionModalFilterButton,
  clickActionClickSearchResultItem,
} from './actions/search';
import {
  elementIsVisible,
  getInputValueAction,
  isMobile,
} from './actions/common';
import {
  expectFindTextOnPage,
  expectItemIsVisible,
  expectItemsIsVisible,
  expectUrlToMatch,
} from './asserts/common';
import { worksUrl } from './helpers/urls';
import {
  worksSearchResultsListItem,
  workTitleHeading,
} from './selectors/works';
import { regexImageSearchResultsUrl } from './helpers/regex';
import {
  mobileModal,
  searchResultsContainer,
  worksSearchCatalogueInputField,
} from './selectors/search';
import { archiveTreeContainerList } from './selectors/archive';

describe('works', () => {
  beforeEach(async () => {
    await page.goto(worksUrl);
  });

  test('Submits the form correctly', async () => {
    const expectedValue = 'heArTs';
    await fillActionSearchInput(expectedValue);
    await pressActionEnterSearchInput();

    const value = await getInputValueAction(worksSearchCatalogueInputField);
    await page.waitForSelector(searchResultsContainer);

    await expectItemIsVisible(searchResultsContainer);
    expect(value).toBe(expectedValue);
  });

  test('Search by term, filter results, check results, view result', async () => {
    const expectedValue = 'art of science';
    await fillActionSearchInput(expectedValue);
    await pressActionEnterSearchInput();

    if (isMobile()) {
      await clickActionModalFilterButton();
      await elementIsVisible(mobileModal);
      await clickActionFormatRadioCheckbox('Pictures');
      await clickActionCloseModalFilterButton();
    } else {
      await clickActionFormatDropDown();
      await clickActionFormatRadioCheckbox('Pictures');
    }
    expectUrlToMatch(/art[+]of[+]science/);

    await expectItemIsVisible(searchResultsContainer);
    await page.waitForNavigation();
    expectUrlToMatch(/workType=k/);

    await expectItemIsVisible(searchResultsContainer);
    await expectItemsIsVisible(worksSearchResultsListItem, 1);
    await clickActionClickSearchResultItem(1);
    await page.waitForNavigation();
    expectUrlToMatch(regexImageSearchResultsUrl);
    await expectItemIsVisible(workTitleHeading);
  });

  describe('As a researcher I need to find things I am interested in so I can use them in my research', () => {
    describe('The person is looking for an archive', () => {
      test('Given we have the archive in our collection when the person searches for a term matching the archive and filters the results for “Archive and manuscripts” Then the work should be browsable to from the search results', async () => {
        const expectedValue = 'Printed items';
        const ArchivesManuscripts = 'Archives and manuscripts';
        await fillActionSearchInput(expectedValue);
        await pressActionEnterSearchInput();

        if (isMobile()) {
          await clickActionModalFilterButton();
          await elementIsVisible(mobileModal);
          await clickActionFormatRadioCheckbox(ArchivesManuscripts);
          await clickActionCloseModalFilterButton();
        } else {
          await clickActionFormatDropDown();
          await clickActionFormatRadioCheckbox(ArchivesManuscripts);
        }
        expectUrlToMatch(/Printed[+]items/);

        await expectItemIsVisible(searchResultsContainer);
        await page.waitForNavigation();
        expectUrlToMatch(/workType=h/);

        await expectItemIsVisible(searchResultsContainer);
        await expectItemsIsVisible(worksSearchResultsListItem, 1);

        await clickActionClickSearchResultItem(3);
        await page.waitForNavigation();
        expectUrlToMatch(regexImageSearchResultsUrl);

        await expectFindTextOnPage(ArchivesManuscripts);
        await expectItemsIsVisible(archiveTreeContainerList, 1);
      });
    });
  });
});
