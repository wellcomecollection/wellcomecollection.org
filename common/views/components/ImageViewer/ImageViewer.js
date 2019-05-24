// @flow
import { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import Control from '../Buttons/Control/Control';
import { spacing, classNames } from '../../../utils/classnames';
// import Raven from 'raven-js';
import { trackEvent } from '../../../utils/ga';
import { convertIiifUriToInfoUri } from '../../../utils/convert-image-uri';

function getTileSources(data) {
  return data.map(d => ({
    '@context': 'http://iiif.io/api/image/2/context.json',
    '@id': d['@id'],
    height: d.height,
    width: d.width,
    profile: ['http://iiif.io/api/image/2/level2.json'],
    protocol: 'http://iiif.io/api/image',
    tiles: [
      {
        scaleFactors: [1, 2, 4, 8, 16, 32],
        width: 400,
      },
    ],
  }));
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
  manifest: any,
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
  manifest,
}: ImageViewerProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [viewer, setViewer] = useState(null);
  const [isError, setIsError] = useState(false);
  const zoomStep = 0.5;

  useEffect(() => {
    if (viewer) {
      getLeftRightPageData().then(d => {
        viewer.open(getTileSources(d));
      });
    }
  }, [pageIndex]);

  async function getLeftRightPageData() {
    const leftInfoUrl = convertIiifUriToInfoUri(
      manifest.sequences[0].canvases[pageIndex].images[0].resource.service[
        '@id'
      ]
    );
    const rightInfoUrl = convertIiifUriToInfoUri(
      manifest.sequences[0].canvases[pageIndex + 1].images[0].resource.service[
        '@id'
      ]
    );

    const leftPromise = fetch(leftInfoUrl).then(res => res.json());
    const rightPromise = fetch(rightInfoUrl).then(res => res.json());
    const [left, right] = await Promise.all([leftPromise, rightPromise]);

    return [left, right];
  }

  async function setupViewer(imageInfoSrc, viewerId) {
    const leftInfoUrl = convertIiifUriToInfoUri(
      manifest.sequences[0].canvases[pageIndex].images[0].resource.service[
        '@id'
      ]
    );
    const rightInfoUrl = convertIiifUriToInfoUri(
      manifest.sequences[0].canvases[pageIndex + 1].images[0].resource.service[
        '@id'
      ]
    );

    const leftPromise = fetch(leftInfoUrl).then(res => res.json());
    const rightPromise = fetch(rightInfoUrl).then(res => res.json());
    const leftAndRight = await Promise.all([leftPromise, rightPromise]);

    const { default: OpenSeadragon } = await import('openseadragon');

    const osdViewer = OpenSeadragon({
      id: `image-viewer-${viewerId}`,
      showNavigationControl: false,
      gestureSettingsMouse: {
        scrollToZoom: false,
      },
      tileSources: getTileSources(leftAndRight),
      collectionMode: true,
      collectionRows: 1,
    });
    setIsError(false);
    setViewer(osdViewer);

    // Arrange two-up
    OpenSeadragon.World.prototype.arrange = function() {
      const tileSize = 800;
      let x = 0;

      this.setAutoRefigureSizes(false);

      this._items.forEach((item, i) => {
        const box = item.getBounds();
        const width =
          box.width > box.height
            ? tileSize
            : tileSize * (box.width / box.height);
        const height = width * (box.height / box.width);
        const position = new OpenSeadragon.Point(
          x + (tileSize - width) / 2,
          (tileSize - height) / 2
        );

        item.setPosition(position, true);
        item.setWidth(width, true);

        x += width;
      });

      this.setAutoRefigureSizes(true);
    };

    return osdViewer;
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

  async function handleNext() {
    if (pageIndex + 1 > manifest.sequences[0].canvases.length) return;
    if (pageIndex + 2 > manifest.sequences[0].canvases.length) {
      return setPageIndex(pageIndex + 1);
    }

    return setPageIndex(pageIndex + 2);
  }

  async function handlePrev() {
    if (pageIndex - 1 < 0) return;
    if (pageIndex - 2 < 0) {
      return setPageIndex(pageIndex - 1);
    }

    return setPageIndex(pageIndex - 2);
  }

  return (
    <div
      className={classNames({
        'image-viewer__content': true,
      })}
    >
      <div className="image-viewer__controls">
        <Control
          type="light"
          text="Rotate"
          icon="rotateRight"
          extraClasses={`${spacing({ s: 1 }, { margin: ['bottom'] })}`}
          clickHandler={handleRotate}
        />

        <Control
          type="light"
          text="Zoom in"
          icon="zoomIn"
          extraClasses={`${spacing({ s: 1 }, { margin: ['bottom'] })}`}
          clickHandler={handleZoomIn}
        />

        <Control
          type="light"
          text="Zoom out"
          icon="zoomOut"
          extraClasses={`${spacing({ s: 1 }, { margin: ['bottom'] })}`}
          clickHandler={handleZoomOut}
        />

        <Control
          type="light"
          text="Prev"
          icon="chevron"
          extraClasses={`icon--180 ${spacing(
            { s: 1 },
            { margin: ['bottom'] }
          )}`}
          clickHandler={handlePrev}
        />

        <Control
          type="light"
          text="Next"
          icon="chevron"
          extraClasses={`${spacing({ s: 1 }, { margin: ['bottom'] })}`}
          clickHandler={handleNext}
        />
      </div>

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
