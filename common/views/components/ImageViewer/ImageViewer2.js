// @flow
import { Fragment, useState, useEffect } from 'react';
import { spacing } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import dynamic from 'next/dynamic';
import Control from '../Buttons/Control/Control';
import Button from '@weco/common/views/components/Buttons/Button/Button';

const ImageViewerImage = dynamic(import('./ImageViewerImage'), { ssr: false });

type ViewerContentProps = {|
  id: string,
  classes: string,
  viewerVisible: boolean,
  handleViewerDisplay: Function,
  infoUrl: string,
|};

const ViewerContent = ({
  id,
  classes,
  viewerVisible,
  handleViewerDisplay,
  infoUrl,
}: ViewerContentProps) => {
  const escapeCloseViewer = ({ keyCode }: KeyboardEvent) => {
    if (keyCode === 27 && viewerVisible) {
      handleViewerDisplay(null, 'Keyboard');
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
    <div className={`${classes} image-viewer__content image-viewer__content2`}>
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
            handleViewerDisplay(null, 'Control');
          }}
        />
      </div>

      {viewerVisible && <ImageViewerImage id={id} infoUrl={infoUrl} />}
    </div>
  );
};

type ImageViewerProps = {|
  id: string,
  contentUrl: string,
  infoUrl: string,
|};

const ImageViewer = ({ id, contentUrl, infoUrl }: ImageViewerProps) => {
  const [showViewer, setShowViewer] = useState(false);

  const handleViewerDisplay = (
    event,
    initiator: 'Button' | 'Control' | 'Image' | 'Keyboard'
  ) => {
    event && event.preventDefault();
    trackEvent({
      category: initiator,
      action: `${showViewer ? 'closed' : 'opened'} ImageViewer`,
      label: id,
    });
    setShowViewer(!showViewer);
  };

  return (
    <Fragment>
      <img
        style={{ width: 'auto', display: 'block', float: 'left' }}
        src={contentUrl}
        alt=""
        onClick={() => {
          handleViewerDisplay(null, 'Image');
        }}
      />
      <Button
        type="tertiary"
        url="http://google.co.uk"
        clickHandler={event => {
          handleViewerDisplay(event, 'Button');
        }}
        text="View larger"
      />
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

// TODO alt
// TODO no-js link
// className="cursor-zoom-in" useEffect
