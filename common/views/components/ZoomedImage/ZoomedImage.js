// @flow
import fetch from 'isomorphic-unfetch';
import openseadragon from 'openseadragon';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { trackEvent } from '@weco/common/utils/ga';
import Raven from 'raven-js';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import Space from '@weco/common/views/components/styled/Space';
// import headerHeight from '@weco/common/views/components/IIIFViewer/IIIFViewer';
const headerHeight = 149;

const ZoomedImageContainer = styled.div`
  /* TODO size and position */
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 2;
  background: ${props => props.theme.colors.black};
  @media (min-width: ${props => props.theme.sizes.large}px) {
    height: calc(100vh - ${`${headerHeight}px`};);
    top: ${`${headerHeight}px`};
  }
`;

const Controls = styled.div`
  /* TODO position controls at the bottom on small devices, having issues with iPhone so skipping for now */
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
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

  function setupViewer(imageInfoSrc, viewerId) {
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
        osdViewer.addOnceHandler('tile-loaded', _ => {
          doZoomIn(osdViewer);
        });
        setViewer(osdViewer);
      })
      .catch(error => {
        Raven.captureException(new Error(`OpenSeadragon error: ${error}`), {
          tags: {
            service: 'dlcs',
          },
        });
        setScriptError(true);
      });
  }

  useEffect(() => {
    setupViewer(infoUrl, id);
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
      <Controls>
        <Space
          v={{
            size: 'l',
            properties: ['margin-top', 'margin-bottom'],
          }}
          h={{
            size: 'l',
            properties: ['margin-left', 'margin-right'],
          }}
        >
          <Space
            as="span"
            h={{
              size: 'm',
              properties: ['margin-left'],
            }}
          >
            <Control
              ref={firstControl}
              type="black-on-white"
              text="Zoom in"
              icon="plus"
              clickHandler={() => {
                handleZoomIn(viewer);
              }}
            />
          </Space>
          <Space
            as="span"
            h={{
              size: 'm',
              properties: ['margin-left'],
            }}
          >
            <Control
              type="black-on-white"
              text="Zoom out"
              icon="minus"
              clickHandler={() => {
                handleZoomOut(viewer);
              }}
            />
          </Space>
          <Space
            as="span"
            h={{
              size: 'm',
              properties: ['margin-left'],
            }}
          >
            <Control
              type="black-on-white"
              text="Rotate"
              icon="rotatePageRight"
              clickHandler={() => {
                handleRotate(viewer);
              }}
            />
          </Space>
          <Space
            as="span"
            h={{
              size: 'm',
              properties: ['margin-left'],
            }}
          >
            <Control
              ref={lastControl}
              type="black-on-white"
              text="Close"
              icon="cross"
              clickHandler={() => {
                setShowViewer(false);
              }}
            />
          </Space>
        </Space>
      </Controls>
      <Image id={`image-viewer-${id}`}>{scriptError && <ErrorMessage />}</Image>
    </ZoomedImageContainer>
  );
};

export default ZoomedImage;
