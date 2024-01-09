// TODO probably delete as part of the item-viewer.test file refactor
// https://github.com/wellcomecollection/wellcomecollection.org/issues/10409
// It's only used there and we're aiming to move away from this kind of locator
// In favour of `getByRole`, `getByLabel` etc.
export const zoomInButton = 'css=button >> text="Zoom in"';
export const rotateButton = 'css=button >> text="Rotate"';
export const openseadragonCanvas = `.openseadragon-canvas`;
export const downloadsButton = `[aria-controls="itemDownloads"]`;
export const itemDownloadsModal = `#itemDownloads`;
export const smallImageDownload = `${itemDownloadsModal} li:nth-of-type(1) a`;
export const fullItemDownload = `${itemDownloadsModal} li:nth-of-type(3) a`;
export const workContributors = `[data-test-id="work-contributors"]`;
export const workDates = `[data-test-id="work-dates"]`;
export const referenceNumber = `[data-test-id="reference-number"]`;
export const fullscreenButton = 'css=button >> text="Full screen"';
export const searchWithinResultsHeader = `[data-test-id="results-header"]`;
export const mainViewer = `[data-test-id=main-viewer] > div`;
export const activeIndex = `[data-test-id=active-index]`;
export const viewerSidebar = `[data-test-id="viewer-sidebar"]`;
export const toggleInfoDesktop = `[data-test-id="toggle-info-desktop"]`;
export const toggleInfoMobile = `[data-test-id="toggle-info-mobile"]`;
export const mobilePageGridButtons = `[data-test-id="page-grid-buttons"] button`;
