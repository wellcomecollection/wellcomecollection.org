// @flow
import { Fragment, useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import openseadragon from 'openseadragon';
import { Transition } from 'react-transition-group';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import Control from '../Buttons/Control/Control';
import { spacing, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';

function setupViewer(imageInfoSrc, viewerId) {
  return fetch(imageInfoSrc)
    .then(response => response.json())
    .then(response => {
      return openseadragon({
        id: `image-viewer-${viewerId}`,
        showNavigationControl: false,
        tileSources: [
          {
            '@context': 'http://iiif.io/api/image/2/context.json',
            '@id': response['@id'],
            height: response.height,
            width: response.width,
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
    .catch(console.log);
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

type ViewerContentProps = {|
  id: string,
  classes: string,
  viewerVisible: boolean,
  handleViewerDisplay: Function,
  infoUrl: string,
|};

function handleRotate(viewer) {
  viewer.viewport.setRotation(viewer.viewport.getRotation() + 90);
}

function handleZoomIn(viewer) {
  console.log(viewer.viewport.getZoom());
}

function handleZoomOut(viewer) {
  console.log(viewer.viewport.getZoom());
}

const ViewerContent = ({
  id,
  classes,
  viewerVisible,
  handleViewerDisplay,
  infoUrl,
}: ViewerContentProps) => {
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    if (viewer) {
      viewer.destroy();
      setViewer(null);
    }

    setupViewer(infoUrl, id).then(setViewer);
  }, [infoUrl]);

  return (
    <div className={`${classes} image-viewer__content image-viewer__content2`}>
      {viewer && (
        <div className="image-viewer__controls flex flex-end flex--v-center">
          <Control
            type="light"
            text="Rotate"
            id={`rotate-right-${id}`}
            icon="rotateRight"
            extraClasses={`${spacing({ s: 1 }, { margin: ['right'] })}`}
            clickHandler={() => handleRotate(viewer)}
          />

          <Control
            type="light"
            text="Zoom in"
            id={`zoom-in-${id}`}
            icon="zoomIn"
            extraClasses={`${spacing({ s: 1 }, { margin: ['right'] })}`}
            clickHandler={() => handleZoomIn(viewer)}
          />

          <Control
            type="light"
            text="Zoom out"
            id={`zoom-out-${id}`}
            icon="zoomOut"
            extraClasses={`${spacing({ s: 8 }, { margin: ['right'] })}`}
            clickHandler={() => handleZoomOut(viewer)}
          />

          <Control
            type="light"
            text="Close image viewer"
            icon="cross"
            extraClasses={`${spacing({ s: 2 }, { margin: ['right'] })}`}
            clickHandler={() => {
              handleViewerDisplay('Control');
            }}
          />
        </div>
      )}
      <div id={`image-viewer-${id}`} className="image-viewer__image" />
    </div>
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
  const [showViewer, setShowViewer] = useState(false);
  const [mountViewButton, setMountViewButton] = useState(false);
  const [viewButtonMounted, setViewButtonMounted] = useState(false);

  const handleViewerDisplay = (initiator: 'Control' | 'Image' | 'Keyboard') => {
    trackEvent({
      category: initiator,
      action: `${showViewer ? 'closed' : 'opened'} ImageViewer`,
      label: id,
    });
    setShowViewer(!showViewer);
  };

  const viewButtonMountedHandler = () => {
    setViewButtonMounted(!viewButtonMounted);
  };

  useEffect(() => {
    setMountViewButton(!viewButtonMounted);
  }, []);

  return (
    <Fragment>
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
        clickHandler={() => handleViewerDisplay('Image')}
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
                handleViewerDisplay('Control');
              }}
            />
          );
        }}
      </Transition>
      {showViewer && (
        <ViewerContent
          classes=""
          viewerVisible={showViewer}
          id={id}
          handleViewerDisplay={handleViewerDisplay}
          infoUrl={infoUrl}
        />
      )}
    </Fragment>
  );
};

export default ImageViewer;
