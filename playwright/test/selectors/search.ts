import {
  searchFormInputCatalogue,
  searchFormInputImage,
  searchFilterCloseButton,
} from '../text/aria-labels';

// input

export const worksSearchCatalogueInputField = `input[aria-label="${searchFormInputCatalogue}"]`;
export const worksSearchImagesInputField = `input[aria-label="${searchFormInputImage}"]`;

// modal

export const mobileModal = '#mobile-filters-modal';
export const mobileModalCloseButton = `${mobileModal} button[aria-label="${searchFilterCloseButton}"]`;
export const formatFilterDropDownContainer = 'div[id="format"]';
export const formatFilterMobileButton =
  'button[aria-controls="mobile-filters-modal"]';

// dropdown

export const formatFilterDropDown = '#formats';
export const formatFilterDropDownButton = 'button[aria-controls="formats"]';

// result list

export const searchResultsContainer = 'ul[role="list"]';
