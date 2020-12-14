import { fillInput, pressEnter, isMobile } from './common';

export const searchImagesForm =
  'form[aria-describedby="images-form-description"]';
export const worksSearchInputField = 'input[aria-label="search input field"]';
export const workSearchResultsContainer = 'div[role="search results list"]';
export const formatFilterDropDown = 'div[role="format filter drop down"]';
export const colourSelectorFilterDropDown = `${searchImagesForm} button[aria-controls="images.color"]`;

export const formatFilterDropDownContainer = 'div[id="format"]';
export const formatFilterMobileButton =
  'button[aria-controls="mobile-filters-modal"]';
export const mobileModal = 'div[aria-modal="true"]';
export const mobileModalCloseButton = `${mobileModal} button[aria-label="close filter button"]`;
export const searchWorksForm =
  'form[aria-describedby="library-catalogue-form-description"]';

export const colourSelector = '.react-colorful div[aria-label="Color"]';
type formType = 'images' | 'works';
export async function fillSearchInput(
  value: string,
  condition?: formType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${worksSearchInputField}`;

  await fillInput(selector, value);
}

export async function pressEnterSearchInput(): Promise<void> {
  await pressEnter(worksSearchInputField);
}

export async function clickFormatDropDown(): Promise<void> {
  await page.click(formatFilterDropDown);
}

export async function clickColourDropDown(): Promise<void> {
  await page.click(colourSelectorFilterDropDown);
}

export async function clickFormatRadioCheckbox(
  filterName: string
): Promise<void> {
  const selector = `${
    isMobile() ? mobileModal : formatFilterDropDown
  } label[aria-label="Radio checkbox ${filterName}"]`;
  await page.click(selector);
}

export async function clickModalFilterButton(
  condition?: formType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${formatFilterMobileButton}`;

  await page.click(selector);
}

export async function clickColourPicker(): Promise<void> {
  await page.click(colourSelector, {
    position: { x: 100, y: 100 },
  });
}

export async function closeModalFilterButton(
  condition?: formType
): Promise<void> {
  const selector = `${
    condition === 'images' ? searchImagesForm : searchWorksForm
  } ${mobileModalCloseButton}`;
  await page.click(selector);
}
