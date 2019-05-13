// @flow
import fetch from 'isomorphic-unfetch';
import openseadragon from 'openseadragon';
import { useState, useEffect } from 'react';
import { spacing } from '../../../utils/classnames';

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

function setupViewer(imageInfoSrc, viewerId, handleScriptError) {
  return fetch(imageInfoSrc)
    .then(response => response.json())
    .then(data => {
      return openseadragon({
        id: `image-viewer-${viewerId}`,
        visibilityRatio: 1,
        showFullPageControl: false,
        showHomeControl: false,
        zoomInButton: `zoom-in-${viewerId}`,
        zoomOutButton: `zoom-out-${viewerId}`,
        rotateRightButton: `rotate-right-${viewerId}`,
        rotateLeftButton: `rotate-left-${viewerId}`,
        showRotationControl: true,
        controlsFadeDelay: 0,
        animationTime: 0.5,
        tileSources: getTileSources(data),
      });
    })
    .catch(_ => {
      handleScriptError();
    });
}

const ErrorMessage = () => (
  <div
    className={`image-viewer__error ${spacing(
      { s: 5 },
      { padding: ['left', 'right', 'top', 'bottom'] }
    )}`}
  >
    <p>The image viewer is not working.</p>
  </div>
);

type Props = {|
  id: string,
  infoUrl: string,
|};

const ImageViewerImage = ({ id, infoUrl }: Props) => {
  const [scriptError, setScriptError] = useState(false);
  const [viewer, setViewer] = useState(null);
  const handleScriptError = () => {
    setScriptError(true);
  };

  useEffect(() => {
    if (viewer) {
      // If we have an instantiated viewer, we reuse it calling open() rather than destroy()
      // This gets around some issues we were having with OSD apparently not cleaning
      // up event handlers on zoom/rotate buttons when using destroy().
      fetch(infoUrl)
        .then(response => response.json())
        .then(data => viewer.open(getTileSources(data)));
    } else {
      setupViewer(infoUrl, id, handleScriptError).then(setViewer);
    }
  }, [infoUrl]);

  return (
    <div className="image-viewer__image" id={`image-viewer-${id}`}>
      {scriptError && <ErrorMessage />}
    </div>
  );
};

export default ImageViewerImage;
