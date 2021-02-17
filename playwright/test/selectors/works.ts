import { searchImagesForm } from './images';
import { mobileModal, searchResultsContainer } from './search';

// text
export const workTitleHeading = 'h1';

// results list
export const worksSearchResultsListItem = `${searchResultsContainer} li[role="listitem"]`;
export const searchWorksForm =
  'form[aria-describedby="library-catalogue-form-description"]';

// modal
export const mobileModalImageSearch = `${searchImagesForm} ${mobileModal}`;
