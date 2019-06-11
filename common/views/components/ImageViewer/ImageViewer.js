// @flow
import { useState, useEffect } from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import { spacing, classNames } from '../../../utils/classnames';
import Raven from 'raven-js';
import { trackEvent } from '../../../utils/ga';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import Control from '../Buttons/Control/Control';
import LL from '../styled/LL';

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
  tabbableControls: boolean,
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
  tabbableControls,
}: ImageViewerProps) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [viewer, setViewer] = useState(null);
  const [isError, setIsError] = useState(false);
  const zoomStep = 0.5;
  function routeChangeStart(url: string) {
    setImageLoading(true);
  }
  useEffect(() => {
    Router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
    };
  }, []);

  useEffect(() => {
    if (viewer) {
      fetch(infoUrl)
        .then(response => response.json())
        .then(data => {
          viewer.open(getTileSources(data));
        });
      viewer.open(setImageLoading(false));
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
      <div className="image-viewer__controls">
        <Control
          tabIndex={tabbableControls ? '0' : '-1'}
          type="on-black"
          text="Zoom in"
          icon="zoomIn"
          clickHandler={handleZoomIn}
        />
        <Control
          tabIndex={tabbableControls ? '0' : '-1'}
          type="on-black"
          text="Zoom out"
          icon="zoomOut"
          clickHandler={handleZoomOut}
        />
        <Control
          tabIndex={tabbableControls ? '0' : '-1'}
          type="on-black"
          text="Rotate"
          icon="rotatePageRight"
          clickHandler={handleRotate}
        />
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {imageLoading && <LL />}
        <div
          id={`image-viewer-${id}`}
          className={classNames({
            'image-viewer__image': true,
          })}
          style={{
            transition: 'opacity 1000ms ease',
            opacity: imageLoading ? 0 : 1,
          }}
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
              sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`}
              extraClasses={classNames({
                'block h-center': true,
                [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
              })}
              lang={lang}
              clickHandler={handleZoomIn}
              loadHandler={() => setImageLoading(false)}
              alt={
                (canvasOcr && canvasOcr.replace(/"/g, '')) ||
                'no text alternative'
              }
              isLazy={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
