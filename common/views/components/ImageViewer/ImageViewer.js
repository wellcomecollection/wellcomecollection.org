// @flow
import { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import Control from '../Buttons/Control/Control';
import { spacing, classNames } from '../../../utils/classnames';
import Raven from 'raven-js';
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
  const [isError, setIsError] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const zoomStep = 0.5;

  useEffect(() => {
    setEnhanced(true);
  }, []);
  useEffect(() => {
    if (viewer) {
      fetch(infoUrl)
        .then(response => response.json())
        .then(data => {
          viewer.open(getTileSources(data));
        });
    }
  }, [infoUrl]);

  async function setupViewer(imageInfoSrc, viewerId) {
    const { default: OpenSeadragon } = await import('openseadragon');

    return fetch(imageInfoSrc)
      .then(response => response.json())
      .then(data => {
        const osdViewer = OpenSeadragon({
          id: `image-viewer-${viewerId}`,
          showNavigationControl: false,
          gestureSettingsMouse: {
            scrollToZoom: false,
          },
          tileSources: getTileSources(data),
        });
        setIsError(false);
        setViewer(osdViewer);

        return osdViewer;
      })
      .catch(error => {
        Raven.captureException(new Error(`OpenSeadragon error: ${error}`), {
          tags: {
            service: 'dlcs',
          },
        });
        setIsError(true);
      });
  }

  async function handleRotate() {
    const v = viewer || (await setupViewer(infoUrl, id));

    v.viewport.setRotation(v.viewport.getRotation() + 90);

    trackEvent({
      category: 'Control',
      action: 'rotate ImageViewer',
      label: id,
    });
  }

  function doZoomIn(viewer) {
    const max = viewer.viewport.getMaxZoom();
    const nextMax = viewer.viewport.getZoom() + zoomStep;
    const newMax = nextMax <= max ? nextMax : max;

    viewer.viewport.zoomTo(newMax);
  }

  function doZoomOut(viewer) {
    const min = viewer.viewport.getMinZoom();
    const nextMin = viewer.viewport.getZoom() - zoomStep;
    const newMin = nextMin >= min ? nextMin : min;

    viewer.viewport.zoomTo(newMin);
  }

  async function handleZoomIn() {
    const v = viewer || (await setupViewer(infoUrl, id));

    if (v.isOpen()) {
      doZoomIn(v);
    } else {
      v.addOnceHandler('tile-loaded', _ => {
        doZoomIn(v);
      });
    }

    trackEvent({
      category: 'Control',
      action: 'zoom in ImageViewer',
      label: id,
    });
  }

  async function handleZoomOut() {
    const v = viewer || (await setupViewer(infoUrl, id));

    if (v.isOpen()) {
      doZoomOut(v);
    } else {
      v.addOnceHandler('tile-loaded', _ => {
        doZoomOut(v);
      });
    }

    trackEvent({
      category: 'Control',
      action: 'zoom out ImageViewer',
      label: id,
    });
  }

  return (
    <div
      className={classNames({
        'image-viewer__content': true,
      })}
    >
      {enhanced && (
        <div className="image-viewer__controls">
          <Control
            type="dark"
            text="Zoom in"
            icon="zoomIn"
            extraClasses={`${spacing({ s: 1 }, { margin: ['bottom'] })}`}
            clickHandler={handleZoomIn}
          />
          <Control
            type="dark"
            text="Zoom out"
            icon="zoomOut"
            extraClasses={`${spacing({ s: 1 }, { margin: ['bottom'] })}`}
            clickHandler={handleZoomOut}
          />
          <Control
            type="dark"
            text="Rotate"
            icon="rotateRight"
            clickHandler={handleRotate}
          />
        </div>
      )}

      <div
        id={`image-viewer-${id}`}
        className={classNames({
          'image-viewer__image': true,
        })}
      >
        {isError && (
          <p
            className={classNames({
              [spacing({ s: 10 }, { padding: ['right', 'left'] })]: true,
            })}
          >
            The image viewer is not working
          </p>
        )}
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
              'is-hidden': !!viewer,
            })}
            lang={lang}
            clickHandler={handleZoomIn}
            alt={
              (canvasOcr && canvasOcr.replace(/"/g, '')) ||
              'no text alternative'
            }
            isLazy={false}
          />
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
