import { enterFullscreen, exitFullscreen } from '../util';
import OpenSeadragon from 'openseadragon';

// utilise button component > then >
// tracking on fullscreen button and controls
// no navigator on mobile
// check for support for fetch, fullscreen, first and just return
// improve no js styling for entire page
// tidy js function / TODO check for support for fetch, fullscreen, first and just return
// utilise fastdom
// cross browser checks

// Stretch:
// fullscreen VS in page option

function setupViewer(imageInfoSrc, viewer, viewerId) { // TODO pass in params
  if (viewer.querySelector('.openseadragon-container')) return;
  window.fetch(imageInfoSrc)
  .then(function(response) {
    return response.json();
  })
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

const createImageViewer = (viewer) => {
  // TODO check for support for fetch, fullscreen, first and just return
  const image = viewer.previousElementSibling;
  const viewerContent = viewer.querySelector('.fullscreen-viewer-content');
  const viewerId = viewerContent.getAttribute('id'); // TODO pass these to the function?
  const imageInfoSrc = document.getElementById(viewerId).getAttribute('data-info-src');
  const enterFullscreenButton = viewer.querySelector('.js-enter-fullscreen');
  const exitFullscreenButton = viewer.querySelector('.js-exit-fullscreen');

  image.addEventListener('dblclick', (e) => {
    setupViewer(imageInfoSrc, viewer, viewerId);
    enterFullscreen(viewerContent);
  });

  enterFullscreenButton.addEventListener('click', (e) => {
    setupViewer(imageInfoSrc, viewer, viewerId);
    enterFullscreen(viewerContent);
  });

  exitFullscreenButton.addEventListener('click', (e) => {
    exitFullscreen(viewer);
  });
};

export default createImageViewer;
