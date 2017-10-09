import { enterFullscreen, exitFullscreen } from '../util';
import OpenSeadragon from 'openseadragon';

// centre fullscreen button under image - dark-btn style
// tracking on fullscreen and controls
// catch error
// controls placement and wording
// tidy js function / DOM performance read/write stuff - batched together

// Stretch:
// improve no js styling for entire page
// fix button icon spacing
// tidy component - use button component
// fullscreen Vs in page option
// have rotation controls? - do we have icons for the controls?

function setupViewer(imageInfoSrc, viewer, viewerId) { // TODO pass in params
  if (viewer.querySelector('.openseadragon-container')) return;
  window.fetch(imageInfoSrc)
  .then(function(response) {
    return response.json();
  })
  .then((response) => {
    OpenSeadragon({
      id: `image-viewer-${viewerId}`,
      visibilityRatio: 1, // TODO add links which explain these settings?
      showFullPageControl: false,
      showHomeControl: false,
      zoomInButton: `zoom-in-${viewerId}`,
      zoomOutButton: `zoom-out-${viewerId}`,
      // homeButton: `zoom-reset-${viewerId}`,
      // rotateLeftButton: `rotate-l-${viewerId}`,
      // rotateRightButton: `rotate-r-${viewerId}`,
      // degrees: 0,
      // showRotationControl: true,
      // gestureSettingsTouch: {
      //   pinchRotate: true
      // },
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
  });
  // TODO .catch(err => { throw err; });
}

const createImageViewer = (viewer/*, fullscreen or in page option */) => { // fullscreen adds button to launch a veiwer, in page replaces image with viewer
  // TODO check for support for fetch, fullscreen, first and just return
  const image = viewer.previousElementSibling;
  const viewerContent = viewer.querySelector('.fullscreen-viewer-content');
  const viewerId = viewerContent.getAttribute('id'); // TODO pass these to the function?
  const imageInfoSrc = document.getElementById(viewerId).getAttribute('data-info-src');
  const enterFullscreenButton = viewer.querySelector('.js-enter-fullscreen');
  const exitFullscreenButton = viewer.querySelector('.js-exit-fullscreen');

  image.addEventListener('dblclick', (e) => { // TODO tidy this up
    setupViewer(imageInfoSrc, viewer, viewerId);
    enterFullscreen(viewerContent);
  });

  enterFullscreenButton.addEventListener('click', (e) => {
    // const target = document.getElementById(e.currentTarget.getAttribute('data-target'));
    setupViewer(imageInfoSrc, viewer, viewerId);
    enterFullscreen(viewerContent);
  });

  exitFullscreenButton.addEventListener('click', (e) => {
    // const target = e.currentTarget.parentNode.getAttribute('id');
    exitFullscreen(viewer);
  });
};

export default createImageViewer;
