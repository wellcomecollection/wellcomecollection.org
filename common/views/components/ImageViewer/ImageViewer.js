// @flow
import { createContext, useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';
import Image from '../Image/Image';
import Control from '../Buttons/Control/Control';
import { spacing } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import dynamic from 'next/dynamic';

const ImageViewerImage = dynamic(import('./ImageViewerImage'), { ssr: false });

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
|};

const ViewerContent = ({
  id,
  classes,
  viewerVisible,
  handleViewerDisplay,
}: ViewerContentProps) => {
  const escapeCloseViewer = ({ keyCode }: KeyboardEvent) => {
    if (keyCode === 27 && viewerVisible) {
      handleViewerDisplay('Keyboard');
    }
  };

  const handleZoomIn = event => {
    trackEvent({
      category: 'Control',
      action: 'zoom in ImageViewer',
      label: id,
    });
  };

  const handleZoomOut = event => {
    trackEvent({
      category: 'Control',
      action: 'zoom out ImageViewer',
      label: id,
    });
  };

  useEffect(() => {
    document.addEventListener('keydown', escapeCloseViewer);
    return function cleanup() {
      document.removeEventListener('keydown', escapeCloseViewer);
    };
  }, []);

  return (
    <div className={`${classes} image-viewer__content`}>
      <div className="image-viewer__controls flex flex-end flex--v-center">
        <Control
          type="light"
          text="Zoom in"
          id={`zoom-in-${id}`}
          icon="zoomIn"
          extraClasses={`${spacing({ s: 1 }, { margin: ['right'] })}`}
          clickHandler={handleZoomIn}
        />

        <Control
          type="light"
          text="Zoom out"
          id={`zoom-out-${id}`}
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
            handleViewerDisplay('Control');
          }}
        />
      </div>

      {viewerVisible && <ImageViewerImage id={id} />}
    </div>
  );
};

type ImageViewerProps = {|
  id: string,
  contentUrl: string,
  infoUrl: string,
  width: number,
|};

// $FlowFixMe
export const ImageInfoContext = createContext();

const ImageViewer = ({ id, contentUrl, infoUrl, width }: ImageViewerProps) => {
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
    <ImageInfoContext.Provider value={infoUrl}>
      <Image
        width={width}
        contentUrl={contentUrl}
        lazyload={false}
        sizesQueries="(min-width: 860px) 800px, calc(92.59vw + 22px)"
        alt=""
        clickHandler={() => {
          handleViewerDisplay('Image');
        }}
        zoomable={viewButtonMounted}
        defaultSize={800}
        extraClasses="margin-h-auto width-auto full-height full-max-width block"
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
      <Transition in={showViewer} timeout={700}>
        {status => {
          if (status === 'exited') {
            return null;
          }
          return (
            <ViewerContent
              classes={`slidedown-image-viewer slidedown-image-viewer-${status}`}
              viewerVisible={showViewer}
              id={id}
              handleViewerDisplay={handleViewerDisplay}
            />
          );
        }}
      </Transition>
    </ImageInfoContext.Provider>
  );
};

export default ImageViewer;
