import { hasFullscreen, enterFullscreen, exitFullscreen } from '../util';
import fastdom from '../utils/fastdom-promise';
import OpenSeadragon from 'openseadragon';

function setupViewer(imageInfoSrc, viewer, viewerId) {
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
  if (window.fetch && hasFullscreen()) {
    const image = viewer.previousElementSibling;
    const viewerContent = viewer.querySelector('.image-viewer-fullscreen__content');
    const viewerId = viewerContent.getAttribute('id');
    const imageInfoSrc = document.getElementById(viewerId).getAttribute('data-info-src');
    const enterFullscreenButton = viewer.querySelector('.js-enter-fullscreen');
    const exitFullscreenButton = viewer.querySelector('.js-exit-fullscreen');

    fastdom.mutate(() => {
      viewer.style.display = 'block';
    });

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
  }
};

export default createImageViewer;
