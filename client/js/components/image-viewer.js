import fastdom from '../utils/fastdom-promise';
import { trackGaEvent } from '../tracking';
import OpenSeadragon from 'openseadragon';

function setupViewer(imageInfoSrc, viewer, viewerId) {
  if (viewer.querySelector('.openseadragon-container')) return;
  window.fetch(imageInfoSrc)
    .then(response => response.json())
    .then((response) => {
      OpenSeadragon({
        id: `image-viewer-${viewerId}`,
        visibilityRatio: 1,
        showFullPageControl: false,
        showHomeControl: false,
        zoomInButton: `zoom-in-${viewerId}`,
        zoomOutButton: `zoom-out-${viewerId}`,
        showNavigator: true,
        controlsFadeDelay: 0,
        tileSources: [{
          '@context': 'http://iiif.io/api/image/2/context.json',
          '@id': response['@id'],
          'height': response.height,
          'width': response.width,
          'profile': [ 'http://iiif.io/api/image/2/level2.json' ],
          'protocol': 'http://iiif.io/api/image',
          'tiles': [{
            'scaleFactors': [ 1, 2, 4, 8, 16, 32 ],
            'width': 400
          }]
        }]
      });
    }).catch(err => { throw err; });
}

function showViewerOnPage(viewerContent) {
  viewerContent.style.display = 'block';
}

function hideViewerOnPage(viewerContent) {
  viewerContent.style.display = 'none';
}

const createImageViewer = (viewer) => {
  if (window.fetch) {
    const image = viewer.previousElementSibling;
    const viewerContent = viewer.querySelector('.image-viewer__content');
    const viewerId = viewerContent.getAttribute('id');
    const imageInfoSrc = document.getElementById(viewerId).getAttribute('data-info-src');
    const launchImageViewerButton = viewer.querySelector('.js-image-viewer__launch-button');
    const exitImageViewerButton = viewer.querySelector('.js-image-viewer__exit-button');

    fastdom.mutate(() => {
      viewer.style.display = 'block';
    });

    image.addEventListener('click', (e) => {
      const gaData = {
        category: 'component',
        action: 'work-launch-image-viewer:imgClick',
        label: `id:${window.location.pathname.match(/\/works\/(.+)/)[1]}, title:${document.title}`
      };
      setupViewer(imageInfoSrc, viewer, viewerId);
      showViewerOnPage(viewerContent);
      trackGaEvent(gaData);
    });

    launchImageViewerButton.addEventListener('click', (e) => {
      setupViewer(imageInfoSrc, viewer, viewerId);
      showViewerOnPage(viewerContent);
    });

    exitImageViewerButton.addEventListener('click', (e) => {
      hideViewerOnPage(viewerContent);
    });
  }
};

export default createImageViewer;
