import { mobileModal, searchResultsContainer } from './search';

// filters
export const searchImagesForm =
  'form[aria-describedby="images-form-description"]';
export const colourSelectorFilterDropDown = `${searchImagesForm} button[aria-controls="images.color"]`;
export const colourSelector = '.react-colorful div[aria-label="Color"]';

// results list
export const imagesResultsListItem = `${searchResultsContainer} li[role="listitem"]`;

// modal
export const mobileModalImageSearch = `${searchImagesForm} ${mobileModal}`;
export const modalexpandedImaged =
  'div[aria-labelledby="expanded-image-dialog"]';
export const modalexpandedImageViewMoreButton =
  'a[aria-label="View expanded image"]';
