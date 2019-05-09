// @flow
import { useState, useEffect } from 'react';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import Control from '../Buttons/Control/Control';
import { spacing, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import dynamic from 'next/dynamic';

const ImageViewerImage = dynamic(import('./ImageViewerImage'), { ssr: false });

type ViewerContentProps = {|
  id: string,
  classes: string,
  viewerVisible: boolean,
  infoUrl: string,
|};

const ViewerContent = ({
  id,
  classes,
  viewerVisible,
  infoUrl,
}: ViewerContentProps) => {
  const handleRotate = event => {
    trackEvent({
      category: 'Control',
      action: 'rotate ImageViewer',
      label: id,
    });
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

  return (
    <div className={`${classes} image-viewer__content`}>
      <div className="image-viewer__controls">
        {/* Setting OpenSeaDragon's `showRotationControl` option to `true` means we have to provide
        a dummy `rotateLeftButton` or handle rotation programatically. The former is simpler. */}
        <span id={`rotate-left-${id}`} className={'is-hidden'} />
        <Control
          type="light"
          text="Rotate"
          id={`rotate-right-${id}`}
          icon="rotateRight"
          extraClasses={`${spacing({ s: 1 }, { margin: ['bottom'] })}`}
          clickHandler={handleRotate}
        />

        <Control
          type="light"
          text="Zoom in"
          id={`zoom-in-${id}`}
          icon="zoomIn"
          extraClasses={`${spacing({ s: 1 }, { margin: ['bottom'] })}`}
          clickHandler={handleZoomIn}
        />

        <Control
          type="light"
          text="Zoom out"
          id={`zoom-out-${id}`}
          icon="zoomOut"
          extraClasses={`${spacing({ s: 1 }, { margin: ['bottom'] })}`}
          clickHandler={handleZoomOut}
        />
      </div>
      {viewerVisible && <ImageViewerImage id={id} infoUrl={infoUrl} />}
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

  useEffect(() => {
    setShowViewer(true);
  }, []);

  return (
    <>
      {showViewer ? (
        <ViewerContent
          classes=""
          viewerVisible={showViewer}
          id={id}
          infoUrl={infoUrl}
        />
      ) : (
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
          alt={
            (canvasOcr && canvasOcr.replace(/"/g, '')) || 'no text alternative'
          }
        />
      )}
    </>
  );
};

export default ImageViewer;
