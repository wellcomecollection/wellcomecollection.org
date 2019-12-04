// @flow
import fetch from 'isomorphic-unfetch';
import openseadragon from 'openseadragon';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { trackEvent } from '@weco/common/utils/ga';
import Raven from 'raven-js';
import Control from '@weco/common/views/components/Buttons/Control/Control';

const ZoomedImageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
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
  const firstControl = useRef(null);
  const lastControl = useRef(null);
  const zoomedImage = useRef(null);
  const handleScriptError = error => {
    Raven.captureException(new Error(`OpenSeadragon error: ${error}`), {
      tags: {
        service: 'dlcs',
      },
    });
    setScriptError(true);
  };

  function setupViewer(imageInfoSrc, viewerId, handleScriptError) {
    fetch(imageInfoSrc)
      .then(response => response.json())
      .then(response => {
        const osdViewer = openseadragon({
          id: `image-viewer-${viewerId}`,
          showNavigationControl: false,
          visibilityRatio: 1,
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
      .catch(error => {
        handleScriptError(error);
      });
  }

  useEffect(() => {
    setupViewer(infoUrl, id, handleScriptError);
    lastControl && lastControl.current && lastControl.current.focus();
  }, []);

  function doZoomIn(viewer) {
    if (!viewer) {
      return;
    }
    const max = viewer.viewport.getMaxZoom();
    const nextMax = viewer.viewport.getZoom() + zoomStep;
    const newMax = nextMax <= max ? nextMax : max;

    viewer.viewport.zoomTo(newMax);
  }

  function doZoomOut(viewer) {
    if (!viewer) return;
    const min = viewer.viewport.getMinZoom();
    const nextMin = viewer.viewport.getZoom() - zoomStep;
    const newMin = nextMin >= min ? nextMin : min;

    viewer.viewport.zoomTo(newMin);
  }

  function handleZoomIn(viewer) {
    if (!viewer) return;

    if (viewer.isOpen()) {
      doZoomIn(viewer);
    }
    trackEvent({
      category: 'Control',
      action: 'zoom in ImageViewer',
      label: id,
    });
  }

  function handleZoomOut(viewer) {
    if (!viewer) return;
    if (viewer.isOpen()) {
      doZoomOut(viewer);
    }
    trackEvent({
      category: 'Control',
      action: 'zoom out ImageViewer',
      label: id,
    });
  }

  function handleRotate(viewer) {
    if (!viewer) return;
    viewer.viewport.setRotation(viewer.viewport.getRotation() + 90);
    trackEvent({
      category: 'Control',
      action: 'rotate ImageViewer',
      label: id,
    });
  }

  function handleTrapStartKeyDown(event) {
    if (event.shiftKey && event.keyCode === 9) {
      event.preventDefault();
      zoomedImage &&
        zoomedImage.current &&
        zoomedImage.current.querySelector('.openseadragon-canvas').focus();
    }
  }

  function handleTrapEndKeyDown(event) {
    if (!event.shiftKey && event.keyCode === 9) {
      event.preventDefault();
      firstControl && firstControl.current && firstControl.current.focus();
    }
  }

  function handleKeyDown(event) {
    if (event.target === firstControl.current) {
      handleTrapStartKeyDown(event);
    }
    if (event.target.classList.contains('openseadragon-canvas')) {
      handleTrapEndKeyDown(event);
    }
  }

  return (
    <ZoomedImageContainer ref={zoomedImage} onKeyDown={handleKeyDown}>
      <Control
        ref={firstControl}
        type="on-black"
        text="Zoom in"
        icon="zoomIn"
        clickHandler={() => {
          handleZoomIn(viewer);
        }}
      />
      <Control
        type="on-black"
        text="Zoom out"
        icon="zoomOut"
        clickHandler={() => {
          handleZoomOut(viewer);
        }}
      />
      <Control
        type="on-black"
        text="Rotate"
        icon="rotatePageRight"
        clickHandler={() => {
          handleRotate(viewer);
        }}
      />
      <span style={{ float: 'right' }}>
        <Control
          ref={lastControl}
          type="on-black"
          text="Close"
          icon="cross"
          clickHandler={() => {
            setShowViewer(false);
          }}
        />
      </span>
      <Image id={`image-viewer-${id}`}>{scriptError && <ErrorMessage />}</Image>
    </ZoomedImageContainer>
  );
};

export default ZoomedImage;
