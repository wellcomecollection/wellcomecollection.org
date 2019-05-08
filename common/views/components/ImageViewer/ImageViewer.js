// @flow
import { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import OpenSeadragon from 'openseadragon';
import { Transition } from 'react-transition-group';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import Control from '../Buttons/Control/Control';
import { spacing, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';

function setupViewer(imageInfoSrc, viewerId) {
  return fetch(imageInfoSrc)
    .then(response => response.json())
    .then(data => {
      return OpenSeadragon({
        id: `image-viewer-${viewerId}`,
        showNavigationControl: false,
        showNavigator: true,
        tileSources: [
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
        ],
      });
    })
    .catch(err => {
      console.log(err);
      // FIXME: handle error
    });
}

type LaunchViewerButtonProps = {|
  classes: string,
  clickHandler: () => void,
  didMountHandler: () => void,
|};

const LaunchViewerButton = ({
  classes,
  clickHandler,
  didMountHandler,
}: LaunchViewerButtonProps) => {
  useEffect(() => {
    didMountHandler();
  }, []);

  return (
    <Control
      type="dark"
      text="View larger image"
      icon="zoomIn"
      extraClasses={`image-viewer__launch-button ${classes}`}
      clickHandler={clickHandler}
    />
  );
};

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
  const [mountViewButton, setMountViewButton] = useState(false);
  const [viewButtonMounted, setViewButtonMounted] = useState(false);
  const [viewer, setViewer] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  function handleRotate() {
    if (!viewer) return;

    viewer.viewport.setRotation(viewer.viewport.getRotation() + 90);
  }

  function handleZoomIn() {
    if (!viewer) return;

    const max = viewer.viewport.getMaxZoom();
    const nextMax = viewer.viewport.getZoom() + 0.5;
    const newMax = nextMax <= max ? nextMax : max;

    viewer.viewport.zoomTo(newMax);
  }

  function closeViewer() {
    if (!viewer) return;

    setShowViewer(false);
    viewer.viewport.goHome();
  }

  function handleZoomOut() {
    if (!viewer) return;

    const min = viewer.viewport.getMinZoom();
    const nextMin = viewer.viewport.getZoom() - 0.5;
    const newMin = nextMin >= min ? nextMin : min;

    viewer.viewport.zoomTo(newMin);
  }

  useEffect(() => {
    if (viewer) {
      viewer.destroy();
      setViewer(null);
    }

    setupViewer(infoUrl, id).then(setViewer);
  }, [infoUrl]);

  const handleViewerDisplay = (initiator: 'Control' | 'Image' | 'Keyboard') => {
    trackEvent({
      category: initiator,
      action: `${showViewer ? 'closed' : 'opened'} ImageViewer`,
      label: id,
    });
  };

  const viewButtonMountedHandler = () => {
    setViewButtonMounted(!viewButtonMounted);
  };

  useEffect(() => {
    setMountViewButton(!viewButtonMounted);
  }, []);

  return (
    <>
      <IIIFResponsiveImage
        width={width}
        height={height}
        src={src}
        srcSet={srcSet}
        sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`} // FIXME: do this better
        extraClasses={classNames({
          'block h-center': true,
          [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
          'cursor-zoom-in': viewButtonMounted,
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
      <Transition in={mountViewButton} timeout={700}>
        {status => {
          if (status === 'exited') {
            return null;
          }
          return (
            <LaunchViewerButton
              classes={`slideup-viewer-btn slideup-viewer-btn-${status}`}
              didMountHandler={viewButtonMountedHandler}
              clickHandler={() => {
                setShowViewer(true);
                handleViewerDisplay('Control');
              }}
            />
          );
        }}
      </Transition>
      <div
        className={classNames({
          'is-hidden': !showViewer,
          'image-viewer__content image-viewer__content2': true,
        })}
      >
        {viewer && (
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

            <Control
              type="light"
              text="Close image viewer"
              icon="cross"
              extraClasses={`${spacing({ s: 2 }, { margin: ['right'] })}`}
              clickHandler={() => {
                closeViewer();
                handleViewerDisplay('Control');
              }}
            />
          </div>
        )}
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
