// @flow
import { Fragment, useState, useEffect } from 'react';
import { spacing, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
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

type IIIFImagePreviewProps = {|
  iiifImageLocationUrl: string,
|};
const IIIFImagePreview = ({ iiifImageLocationUrl }: IIIFImagePreviewProps) => {
  const [showViewer, setShowViewer] = useState(false);
  const [jsEnabled, setJsEnabled] = useState(false);
  const thumbnailUrl = iiifImageTemplate(iiifImageLocationUrl)({
    size: ',400',
  });
  const largeSizeUrl = iiifImageTemplate(iiifImageLocationUrl)({
    size: '1024,',
  });

  const handleViewerDisplay = (
    event,
    initiator: 'Button' | 'Control' | 'Image' | 'Keyboard'
  ) => {
    event && event.preventDefault();
    trackEvent({
      category: initiator,
      action: `${showViewer ? 'closed' : 'opened'} ImageViewer`,
      label: iiifImageLocationUrl,
    });
    setShowViewer(!showViewer);
  };

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  return (
    <Fragment>
      <img
        className={classNames({
          'cursor-zoom-in': jsEnabled,
          [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
        })}
        style={{ width: 'auto', height: '300px', display: 'block' }}
        src={thumbnailUrl}
        alt=""
        onClick={() => {
          handleViewerDisplay(null, 'Image');
        }}
      />
      <Button
        type="primary"
        url={largeSizeUrl}
        clickHandler={event => {
          handleViewerDisplay(event, 'Button');
        }}
        text="View larger"
      />
      {showViewer && (
        <ViewerContent
          classes=""
          viewerVisible={showViewer}
          id={iiifImageLocationUrl}
          handleViewerDisplay={handleViewerDisplay}
          infoUrl={iiifImageLocationUrl}
        />
      )}
    </Fragment>
  );
};

export default IIIFImagePreview;
// TODO alt - how do we handle this
// TODO layout / styling
