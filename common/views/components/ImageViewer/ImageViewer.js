// @flow
import { useState } from 'react';
import fetch from 'isomorphic-unfetch';
import OpenSeadragon from 'openseadragon';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import Control from '../Buttons/Control/Control';
import { spacing, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';

function getTileSources(data) {
  return [
    {
      '@context': 'http://iiif.io/api/image/2/context.json',
      '@id': data['@id'],
      height: data.height,
      width: data.width,
      profile: ['http://iiif.io/api/image/2/level2.json'],
      protocol: 'http://iiif.io/api/image',
      tiles: [
        {
          scaleFactors: [1, 2, 4, 8, 16, 32],
          width: 400,
        },
      ],
    },
  ];
}

function setupViewer(imageInfoSrc, viewerId) {
  return fetch(imageInfoSrc)
    .then(response => response.json())
    .then(data => {
      return OpenSeadragon({
        id: `image-viewer-${viewerId}`,
        visibilityRatio: 1,
        showFullPageControl: false,
        showHomeControl: false,
        zoomInButton: `zoom-in-${viewerId}`,
        zoomOutButton: `zoom-out-${viewerId}`,
        rotateRightButton: `rotate-right-${viewerId}`,
        rotateLeftButton: `rotate-left-${viewerId}`,
        showRotationControl: true,
        controlsFadeDelay: 0,
        animationTime: 0.5,
        tileSources: getTileSources(data),
      });
    })
    .catch(_ => {
      // TODO: handle errors
    });
}

type ImageViewerProps = {|
  id: string,
  src: string,
  srcSet: string,
  width: number,
  height?: number,
  canvasOcr: ?string,
  infoUrl: string,
  lang: ?string,
|};

const ImageViewer = ({
  id,
  width,
  height,
  canvasOcr,
  lang,
  infoUrl,
  src,
  srcSet,
}: ImageViewerProps) => {
  const [viewer, setViewer] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  function setupOrUpdateViewer(viewer) {
    return new Promise((resolve, reject) => {
      if (viewer) {
        fetch(infoUrl)
          .then(response => response.json())
          .then(data => {
            viewer.open(getTileSources(data));
            resolve();
          });
      } else {
        setupViewer(infoUrl, id).then(setViewer);
        resolve();
      }
    });
  }

  async function handleRotate() {
    await setupOrUpdateViewer();

    viewer.viewport.setRotation(viewer.viewport.getRotation() + 90);
  }

  async function handleZoomIn() {
    await setupOrUpdateViewer();

    const max = viewer.viewport.getMaxZoom();
    const nextMax = viewer.viewport.getZoom() + 0.5;
    const newMax = nextMax <= max ? nextMax : max;

    viewer.viewport.zoomTo(newMax);
  }

  async function handleZoomOut() {
    await setupOrUpdateViewer();

    const min = viewer.viewport.getMinZoom();
    const nextMin = viewer.viewport.getZoom() - 0.5;
    const newMin = nextMin >= min ? nextMin : min;

    viewer.viewport.zoomTo(newMin);
  }

  const handleViewerDisplay = (initiator: 'Control' | 'Image' | 'Keyboard') => {
    trackEvent({
      category: initiator,
      action: `${showViewer ? 'closed' : 'opened'} ImageViewer`,
      label: id,
    });
  };

  return (
    <>
      {!showViewer && (
        <IIIFResponsiveImage
          width={width}
          height={height}
          src={src}
          srcSet={srcSet}
          sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`} // FIXME: do this better
          extraClasses={classNames({
            'block h-center': true,
            [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
          })}
          lang={lang}
          clickHandler={() => {
            setShowViewer(true);
            handleViewerDisplay('Image');
          }}
          alt={
            (canvasOcr && canvasOcr.replace(/"/g, '')) || 'no text alternative'
          }
        />
      )}
      <div
        className={classNames({
          'image-viewer__content': true,
        })}
      >
        <div className="image-viewer__controls flex flex-end flex--v-center">
          <Control
            type="light"
            text="Rotate"
            icon="rotateRight"
            extraClasses={`${spacing({ s: 1 }, { margin: ['right'] })}`}
            clickHandler={handleRotate}
          />

          <Control
            type="light"
            text="Zoom in"
            icon="zoomIn"
            extraClasses={`${spacing({ s: 1 }, { margin: ['right'] })}`}
            clickHandler={handleZoomIn}
          />

          <Control
            type="light"
            text="Zoom out"
            icon="zoomOut"
            extraClasses={`${spacing({ s: 8 }, { margin: ['right'] })}`}
            clickHandler={handleZoomOut}
          />
        </div>

        <div
          id={`image-viewer-${id}`}
          className={classNames({
            'image-viewer__image': true,
          })}
        />
      </div>
    </>
  );
};

export default ImageViewer;
