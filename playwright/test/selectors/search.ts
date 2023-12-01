import { searchFormInputImage } from '../text/aria-labels';

// input
export const worksSearchImagesInputField = `input[aria-label="${searchFormInputImage}"]`;

// modal
export const mobileModal = '#mobile-filters-modal';
export const mobileModalCloseButton = `${mobileModal} [data-testid="close-modal-button"]`;
export const formatFilterDropDownContainer = 'div[id="workType"]';
export const formatFilterMobileButton =
  'button[aria-controls="mobile-filters-modal"]';

// result list
export const searchResultsContainer =
  '[data-test-id="image-search-results-container"]';
