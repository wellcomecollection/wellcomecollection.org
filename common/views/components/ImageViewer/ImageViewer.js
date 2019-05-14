// @flow
import { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import Control from '../Buttons/Control/Control';
import { spacing, classNames } from '../../../utils/classnames';

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

async function setupViewer(imageInfoSrc, viewerId) {
  const { default: OpenSeadragon } = await import('openseadragon');

  return fetch(imageInfoSrc)
    .then(response => response.json())
    .then(data => {
      return OpenSeadragon({
        id: `image-viewer-${viewerId}`,
        showNavigationControl: false,
        gestureSettingsMouse: {
          scrollToZoom: false,
        },
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

  useEffect(() => {
    if (viewer) {
      fetch(infoUrl)
        .then(response => response.json())
        .then(data => {
          viewer.open(getTileSources(data));
        });
    } else {
      setupViewer(infoUrl, id).then(setViewer);
    }
  }, [infoUrl]);

  function handleRotate() {
    if (viewer) {
      viewer.viewport.setRotation(viewer.viewport.getRotation() + 90);
    }
  }

  function handleZoomIn() {
    if (viewer) {
      const max = viewer.viewport.getMaxZoom();
      const nextMax = viewer.viewport.getZoom() + 0.5;
      const newMax = nextMax <= max ? nextMax : max;

      viewer.viewport.zoomTo(newMax);
    }
  }

  function handleZoomOut() {
    if (viewer) {
      const min = viewer.viewport.getMinZoom();
      const nextMin = viewer.viewport.getZoom() - 0.5;
      const newMin = nextMin >= min ? nextMin : min;

      viewer.viewport.zoomTo(newMin);
    }
  }

  return (
    <>
      {!viewer && (
        <IIIFResponsiveImage
          width={width}
          height={height}
          src={src}
          srcSet={srcSet}
          sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`} // FIXME: do this better
          extraClasses={classNames({
            'block h-center': true,
            [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
            'is-hidden': viewer,
          })}
          lang={lang}
          clickHandler={handleZoomIn}
          alt={
            (canvasOcr && canvasOcr.replace(/"/g, '')) || 'no text alternative'
          }
        />
      )}
      <div
        className={classNames({
          'image-viewer__content': true,
          'is-hidden': !viewer,
        })}
      >
        <div className="image-viewer__controls">
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
