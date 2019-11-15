// @flow
import fetch from 'isomorphic-unfetch';
import openseadragon from 'openseadragon';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Control from '@weco/common/views/components/Buttons/Control/Control';

const ZoomedImageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  padding: 48px 0 6px;
  top: 0;
  left: 0;
  z-index: 2;
  background: ${props => props.theme.colors.black};
`;

const Image = styled.div`
  height: 100%;
`;

const ErrorMessage = () => (
  <div>
    <p>The image viewer is not working.</p>
  </div>
);

type Props = {|
  id: string,
  infoUrl: string,
  setShowViewer: boolean => void,
|};

const ZoomedImage = ({ id, infoUrl, setShowViewer }: Props) => {
  const [scriptError, setScriptError] = useState(false);
  const [viewer, setViewer] = useState(null);
  const zoomStep = 0.5;
  function setupViewer(imageInfoSrc, viewerId, handleScriptError) {
    fetch(imageInfoSrc)
      .then(response => response.json())
      .then(response => {
        const osdViewer = openseadragon({
          id: `image-viewer-${viewerId}`,
          visibilityRatio: 1,
          showFullPageControl: false,
          showHomeControl: false,
          zoomInButton: `zoom-in-${viewerId}`,
          zoomOutButton: `zoom-out-${viewerId}`,
          showNavigator: true,
          controlsFadeDelay: 0,
          animationTime: 0.5,
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
        setViewer(osdViewer);
      })
      .catch(_ => {
        // handleScriptError(); // TODO
      });
  }

  const handleScriptError = () => {
    setScriptError(true);
  };

  useEffect(() => {
    setViewer(setupViewer(infoUrl, id, handleScriptError));
  }, []);

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

  function handleZoomIn(v) {
    if (v.isOpen()) {
      doZoomIn(v);
    } else {
      v.addOnceHandler('tile-loaded', _ => {
        doZoomIn(v);
      });
    }

    // trackEvent({
    //   category: 'Control',
    //   action: 'zoom in ImageViewer',
    //   label: id,
    // });
  }

  function handleZoomOut(v) {
    if (v.isOpen()) {
      doZoomOut(v);
    } else {
      v.addOnceHandler('tile-loaded', _ => {
        doZoomOut(v);
      });
    }

    //   trackEvent({
    //     category: 'Control',
    //     action: 'zoom out ImageViewer',
    //     label: id,
    //   });
  }

  return (
    <ZoomedImageContainer>
      <>
        <Control
          // tabIndex={tabbableControls ? '0' : '-1'} // TODO check if needed
          type="on-black"
          text="Close"
          icon="cross"
          clickHandler={() => {
            setShowViewer(false);
          }}
        />
        <Control
          // tabIndex={tabbableControls ? '0' : '-1'} // TODO check if needed
          type="on-black"
          text="Zoom in"
          icon="zoomIn"
          clickHandler={() => {
            handleZoomIn(viewer);
          }}
        />
        <Control
          // tabIndex={tabbableControls ? '0' : '-1'} // TODO check if needed
          type="on-black"
          text="Zoom out"
          icon="zoomOut"
          clickHandler={() => {
            handleZoomOut(viewer);
          }}
        />
        <Image id={`image-viewer-${id}`}>
          {scriptError && <ErrorMessage />}
        </Image>
      </>
    </ZoomedImageContainer>
  );
};

export default ZoomedImage;
